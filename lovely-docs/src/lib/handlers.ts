import dbg from 'debug';
import { err, ok, type Result } from 'neverthrow';
import type { LibrarySummary } from './doc-cache.js';
import { getNodeMarkdown, getRelevantEssenceSubTree, type MarkdownLevel, getEcosystems } from './doc-cache.js';
const debug = dbg('app:lib:handlers');

export function libraryIndex(libraries: Map<string, LibrarySummary>, ecosystem: string) {
	let filtered = libraries;
	if (ecosystem !== '*') {
		filtered = new Map(Array.from(libraries.entries()).filter(([, lib]) => lib.ecosystems.includes(ecosystem)));
	}
	return Object.fromEntries(Array.from(filtered.entries()).map(([key, lib]) => [key, lib.essence]));
}

export const buildNested = (node: any): unknown[] => {
	const items: unknown[] = [];
	for (const [key, child] of Object.entries(node.children ?? {})) {
		const childNode = child as any;
		const hasChildren = childNode && Object.keys(childNode.children ?? {}).length > 0;
		if (!hasChildren) {
			items.push(key);
		} else {
			items.push({ [key]: buildNested(childNode) });
		}
	}
	return items;
};

export const buildNestedVerbose = (node: any): unknown[] => {
	const items: unknown[] = [];
	for (const [key, child] of Object.entries(node.children ?? {})) {
		const childNode = child as any;
		const hasChildren = childNode && Object.keys(childNode.children ?? {}).length > 0;
		if (!hasChildren) {
			items.push({ [key]: childNode.essence });
		} else {
			items.push({
				[key]: {
					essence: childNode.essence,
					children: buildNestedVerbose(childNode)
				}
			});
		}
	}
	return items;
};

export function getPageIndex(
	libraries: Map<string, LibrarySummary>,
	library: string,
	verbose: boolean = false
): Result<Record<string, unknown>, string> {
	const byKey = libraries.get(library);
	if (!byKey) return err(`Unknown library: ${library}`);
	const tree = getRelevantEssenceSubTree(library, '/');
	if (!tree) return ok({});
	return ok({ tree: verbose ? buildNestedVerbose(tree) : buildNested(tree) });
}

export function getPage(
	libraries: Map<string, LibrarySummary>,
	library: string,
	page: string | undefined,
	level: MarkdownLevel | undefined
): Result<{ text: string; children?: unknown[] }, string> {
	const byKey = libraries.get(library);
	if (!byKey) return err(`Library not found: ${library}`);
	const effectiveLevel = (level ?? 'digest') as MarkdownLevel;
	const text = getNodeMarkdown(library, page ?? '/', effectiveLevel);
	if (text === undefined) return err(`Page not found in ${library} at path ${page ?? '/'}`);

	let children: unknown[] | undefined;
	if (effectiveLevel === 'digest' || effectiveLevel === 'fulltext') {
		const subTree = getRelevantEssenceSubTree(library, page ?? '/');
		if (subTree) {
			children = buildNested(subTree);
		}
	}
	const payload: { text: string; children?: unknown[] } = { text };
	if (children) payload.children = children;
	return ok(payload);
}
