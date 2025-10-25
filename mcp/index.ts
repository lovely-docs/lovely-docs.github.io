#!/usr/bin/env bun
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readdir, readFile, stat } from "fs/promises";
import { join, relative } from "path";

// Get processed_documents path from command line args or environment
const DOCS_PATH = process.argv[2] || process.env.LOVELY_DOCS_PATH || "../processed_documents";

interface Library {
  name: string;
  path: string;
  index: any;
}

interface DocumentMetadata {
  name: string;
  better_name?: string;
  better_filename?: string;
  one_line_summary?: string;
  path: string;
}

// Scan libraries on startup
async function scanLibraries(): Promise<Map<string, Library>> {
  const libraries = new Map<string, Library>();

  try {
    const entries = await readdir(DOCS_PATH, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const libPath = join(DOCS_PATH, entry.name);
        const indexPath = join(libPath, "index.json");

        try {
          const indexData = await readFile(indexPath, "utf-8");
          const index = JSON.parse(indexData);

          libraries.set(entry.name, {
            name: index.source_name || entry.name,
            path: libPath,
            index,
          });
        } catch (err) {
          console.error(`Failed to load library ${entry.name}:`, err);
        }
      }
    }
  } catch (err) {
    console.error(`Failed to scan docs directory ${DOCS_PATH}:`, err);
  }

  return libraries;
}

// Recursively find all documents in a directory
async function findDocuments(dirPath: string, basePath: string): Promise<DocumentMetadata[]> {
  const documents: DocumentMetadata[] = [];

  try {
    const entries = await readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);

      if (entry.isDirectory()) {
        const metadataPath = join(fullPath, "metadata.json");

        try {
          const metadataContent = await readFile(metadataPath, "utf-8");
          const metadata = JSON.parse(metadataContent);

          // Check if this is a document (has summary.md)
          try {
            await stat(join(fullPath, "summary.md"));
            documents.push({
              name: metadata.name,
              better_name: metadata.better_name,
              better_filename: metadata.better_filename,
              one_line_summary: metadata.one_line_summary,
              path: relative(basePath, fullPath),
            });
          } catch {
            // Not a document, continue recursing
          }

          // Recurse into subdirectories
          const subDocs = await findDocuments(fullPath, basePath);
          documents.push(...subDocs);
        } catch {
          // No metadata, skip
        }
      }
    }
  } catch (err) {
    console.error(`Failed to scan directory ${dirPath}:`, err);
  }

  return documents;
}

const libraries = await scanLibraries();
console.error(`Loaded ${libraries.size} libraries from ${DOCS_PATH}`);

// Create MCP server
const server = new Server(
  {
    name: "lovely-docs-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources = [];

  // Add library overview resources
  for (const [libKey, library] of libraries) {
    resources.push({
      uri: `lovely-docs://${libKey}`,
      name: `${library.name} - Library Overview`,
      description: library.index.root_directory?.one_line_summary || `Documentation for ${library.name}`,
      mimeType: "text/markdown",
    });

    // Find all documents in this library
    const rootName = library.index.root_directory?.better_name?.replace(/ /g, "_") || "root";
    const rootPath = join(library.path, rootName);

    try {
      const documents = await findDocuments(rootPath, library.path);

      for (const doc of documents) {
        const displayName = doc.better_filename || doc.better_name || doc.name;
        resources.push({
          uri: `lovely-docs://${libKey}/${doc.path}`,
          name: `${library.name} - ${displayName}`,
          description: doc.one_line_summary || `Documentation page: ${displayName}`,
          mimeType: "text/markdown",
        });
      }
    } catch (err) {
      console.error(`Failed to list documents for ${libKey}:`, err);
    }
  }

  return { resources };
});

// Read resource content
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (!uri.startsWith("lovely-docs://")) {
    throw new Error(`Invalid URI scheme: ${uri}`);
  }

  const path = uri.replace("lovely-docs://", "");
  const [libKey, ...pathParts] = path.split("/");

  if (!libKey) {
    throw new Error("Invalid URI: missing library key");
  }

  const library = libraries.get(libKey);
  if (!library) {
    throw new Error(`Library not found: ${libKey}`);
  }

  // If no path parts, return library overview.
  if (pathParts.length === 0) {
    const stats = library.index.statistics || {};
    const overview = `# ${library.name}

${library.index.root_directory?.one_line_summary || ""}

## Statistics

- **Total Pages**: ${stats.total_pages || 0}
- **Relevant Pages**: ${stats.relevant_pages || 0}
- **Relevant Directories**: ${stats.relevant_directories || 0}
`;

    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: overview,
        },
      ],
    };
  }

  // Read document content
  const docPath = join(library.path, pathParts.join("/"));

  try {
    // Read metadata
    const metadataContent = await readFile(join(docPath, "metadata.json"), "utf-8");
    const metadata = JSON.parse(metadataContent);

    // Read summary (default view)
    const summaryContent = await readFile(join(docPath, "summary.md"), "utf-8");

    // Optionally read other views
    let summaryShort = "";
    let original = "";

    try {
      summaryShort = await readFile(join(docPath, "summary_short.md"), "utf-8");
    } catch {}

    try {
      original = await readFile(join(docPath, "original.md"), "utf-8");
    } catch {}

    // Format the response with all available content
    const displayName = metadata.better_filename || metadata.better_name || metadata.name;
    let content = `# ${displayName}\n\n`;

    if (metadata.one_line_summary) {
      content += `> ${metadata.one_line_summary}\n\n`;
    }

    content += `## Summary\n\n${summaryContent}\n\n`;

    if (summaryShort) {
      content += `## Short Summary\n\n${summaryShort}\n\n`;
    }

    if (original) {
      content += `## Original Content\n\n${original}\n`;
    }

    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  } catch (err) {
    throw new Error(`Failed to read document: ${err}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Lovely Docs MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});