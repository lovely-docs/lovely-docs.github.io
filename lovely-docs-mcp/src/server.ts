import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import YAML from "yaml";
import dbg from "debug";

import {
	filterEcosystems,
	filterLibraries,
	getEcosystems,
	getLibraries,
	isMarkdownLevel,
	markdownVariantKeys,
	type LibraryFilterOptions,
} from "./lib/doc-cache.js";
import { getPageIndex, getPage, libraryIndex } from "./lib/handlers.js";

const debug = dbg("app:server");

const toYaml = (value: unknown): string => YAML.stringify(value).trim();

function mcpError(text: string) {
	return {
		content: [{ type: "text" as const, text }],
		isError: true,
	};
}

export class ResourceResponseError extends Error {
	code: number;
	uri: string;

	constructor(message: string, uri: string, options?: { code?: number }) {
		super(message);
		this.code = options?.code ?? -32002;
		this.uri = uri;
	}
}

export function getServer(options: LibraryFilterOptions): McpServer {
	debug("getServer", options);

	const server = new McpServer({
		name: "lovely-docs-mcp",
		version: "0.1.0",
	});

	// Tools
	server.registerTool(
		"listLibraries",
		{
			title: "List available docs",
			description: `Optionally filter by ecosystem: [${Array.from(
				filterEcosystems(getEcosystems(getLibraries()), options)
			)
				.sort()
				.join(", ")}]. Set verbose=true for descriptions.`,
			inputSchema: {
				ecosystem: z.string().optional(),
				verbose: z.boolean().optional(),
			},
		},
		async ({ ecosystem, verbose }: { ecosystem?: string; verbose?: boolean }) => {
			if (!ecosystem) ecosystem = "*";
			const libs = filterLibraries(getLibraries(), options);
			const idx = libraryIndex(libs, ecosystem);
			const payload = verbose ? idx : Object.keys(idx);
			return {
				content: [{ type: "text" as const, text: toYaml(payload) }],
			};
		}
	);

	server.registerTool(
		"listPages",
		{
			title: "List documentation pages for a library",
			description: "Get available libraries with the `listLibraries` tool",
			inputSchema: {
				library: z.string(),
			},
		},
		async ({ library }: { library: string }) => {
			const libs = filterLibraries(getLibraries(), options);
			const result = getPageIndex(libs, library);
			if (result.isErr()) return mcpError(result.error);
			const pages = result.value.tree ?? {};
			return {
				content: [{ type: "text" as const, text: toYaml(pages) }],
			};
		}
	);

	server.registerTool(
		"getPage",
		{
			title: "Get documentation page content",
			description:
				"Get markdown content for a documentation page. " +
				"Provide the library name, optional page path within the library, and detail level (fulltext, digest, short_digest).",
			inputSchema: {
				library: z.string(),
				page: z.string().optional(),
				level: z.enum(["fulltext", "digest", "short_digest"]).optional(),
			},
		},
		async ({ library, page, level }: { library: string; page?: string; level?: string }) => {
			const libs = filterLibraries(getLibraries(), options);
			const result = getPage(libs, String(library), page, level as any);
			if (result.isErr()) return mcpError(result.error);
			const text =
				result.value.text +
				(result.value.children
					? "\nAvailable sub-pages:\n" + toYaml(result.value.children)
					: "");
			return {
				content: [{ type: "text" as const, text }],
			};
		}
	);

	// Resources

	// Static libraries index: overview of available libraries
	server.registerResource(
		"doc-index",
		new ResourceTemplate("lovely-docs://doc-index/{ecosystem}", { list: undefined }),
		{
			title: "Index of available libraries",
			description: `Available ecossytems: [${Array.from(
				filterEcosystems(getEcosystems(getLibraries()), options)
			)
				.sort()
				.join(", ")}] or * for all.`,
			mimeType: "text/yaml",
		},
		async (uri: URL, variables: any, extra: any) => {
			debug(uri, variables, extra);
			const ecosystem =
				typeof variables.ecosystem === "string"
					? variables.ecosystem
					: variables.ecosystem?.[0];
			const libs = filterLibraries(getLibraries(), options);
			const idx = libraryIndex(libs, ecosystem);
			return {
				contents: [
					{
						uri: uri.href,
						text: toYaml(Object.keys(idx)),
					},
				],
			};
		}
	);

	server.registerResource(
		"doc-index-verbose",
		new ResourceTemplate("lovely-docs://doc-index-verbose/{ecosystem}", { list: undefined }),
		{
			title: "Index of available libraries with a short description for each library",
			description: `Available ecossytems: [${Array.from(
				filterEcosystems(getEcosystems(getLibraries()), options)
			)
				.sort()
				.join(", ")}] or * for all.`,
			mimeType: "text/yaml",
		},
		async (uri: URL, variables: any, extra: any) => {
			const ecosystem =
				typeof variables.ecosystem === "string"
					? variables.ecosystem
					: variables.ecosystem?.[0];
			const libs = filterLibraries(getLibraries(), options);
			const idx = libraryIndex(libs, ecosystem);
			return {
				contents: [
					{
						uri: uri.href,
						text: toYaml(idx),
					},
				],
			};
		}
	);

	server.registerResource(
		"page-index",
		new ResourceTemplate("lovely-docs://index/{name}", { list: undefined }),
		{
			title: "Index of pages for a library",
			mimeType: "text/yaml",
		},
		async (uri: URL, variables: any, extra: any) => {
			const name = typeof variables.name === "string" ? variables.name : variables.name?.[0];
			if (!name)
				throw new ResourceResponseError("Missing required parameter: name", uri.href);
			debug(uri, variables);
			const libs = filterLibraries(getLibraries(), options);
			const result = getPageIndex(libs, name);
			if (result.isErr()) throw new ResourceResponseError(result.error, uri.href);
			const pages = result.value.tree ?? {};

			let textBody = toYaml({ "/": pages });

			return {
				contents: [
					{
						uri: uri.href,
						text: textBody,
					},
				],
			};
		}
	);

	server.registerResource(
		"doc-page",
		new ResourceTemplate("lovely-docs://page/{path*}/{?level}", { list: undefined }),
		{
			title: "A doc page",
			description:
				"path: library/path/to/page, just library returns the root page for the library\n" +
				"level: [fulltext, digest, short_digest, essence] - digest is a good default",
			mimeType: "text/yaml",
		},
		async (uri: URL, variables: any) => {
			const path =
				typeof variables.path === "string" ? variables.path : variables.path?.join("/");
			if (!path)
				throw new ResourceResponseError("Missing required parameter: path", uri.href);

			const decodedFullPath = decodeURIComponent(path);
			const [name, ...rest] = decodedFullPath.split("/");
			const p = rest.length ? rest.join("/") : undefined;

			const level =
				typeof variables.level === "string" ? variables.level : variables.level?.[0];
			if (level !== undefined && !isMarkdownLevel(level)) {
				throw new ResourceResponseError(
					`Invalid level: ${level}. Must be one of: ${markdownVariantKeys.join(", ")}`,
					uri.href
				);
			}

			const libs = filterLibraries(getLibraries(), options);
			const result = getPage(libs, name, p, level);
			if (result.isErr()) throw new ResourceResponseError(result.error, uri.href);

			// debug("doc-page",result.value.children);

			return {
				contents: [
					{
						uri: uri.href,
						text:
							result.value.text +
							(result.value.children
								? "\nAvailable sub-pages:\n" + toYaml(result.value.children)
								: ""),
					},
				],
			};
		}
	);

	return server;
}
