import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import dbg from 'debug';

const debug = dbg('app:lib:doc-cache');

interface IndexEntry {
	path: string;
	relevant: boolean;
	type: 'page' | 'directory';
	token_counts?: {
		fulltext?: number;
		digest?: number;
		short_digest?: number;
	};
	usage?: {
		input: number;
		output: number;
		details?: any;
	};
}

const markdownVariantKeys = ['fulltext', 'digest', 'short_digest', 'essence'] as const;
interface MarkdownVariants extends Partial<Record<typeof markdownVariantKeys[number], string>> { }

// Base type for both pages and directories
interface BaseDocItem {
	path: string; // Original filesystem path from index.json
	relevant: boolean;
	token_counts?: {
		fulltext?: number;
		digest?: number;
		short_digest?: number;
	};
	usage?: {
		input: number;
		output: number;
		details?: any;
	};
	markdown: MarkdownVariants; // Contains digest, essence, etc.
}

// Page type - has fulltext and short_digest
interface DocPage extends BaseDocItem {
	type: 'page';
}

// Directory type - now also has short_digest
interface DocDirectory extends BaseDocItem {
	type: 'directory';
}

export type DocItem = DocPage | DocDirectory;

export interface TreeNode {
	name: string;
	path: string;
	children: Map<string, TreeNode>;
	data?: DocItem;
}

export interface LibraryDBItem {
	library: string;
	source: {
		name: string;
		doc_dir?: string;
		repo?: string;
		commit?: string;
	};
	source_type: "git" | "web";
	date: string;
	model: string;
	commit: string;
	tree: TreeNode;
}

const cache = new Map<string, LibraryDBItem>();

function validateIndexData(data: any): void {
	if (!data.map || typeof data.map !== 'object') {
		throw new Error('Invalid index.json: missing or invalid "map" field');
	}

	const errors: string[] = [];
	for (const [key, value] of Object.entries(data.map)) {
		if (typeof value !== 'object' || value === null) {
			errors.push(`Entry "${key}": not an object`);
			continue;
		}

		const entry = value as any;
		if (typeof entry.path !== 'string') {
			errors.push(`Entry "${key}": missing or invalid "path" field`);
		}
		if (typeof entry.relevant !== 'boolean') {
			errors.push(`Entry "${key}": missing or invalid "relevant" field`);
		}
		if (entry.type !== 'page' && entry.type !== 'directory') {
			errors.push(`Entry "${key}": missing or invalid "type" field (must be "page" or "directory")`);
		}
	}

	if (errors.length > 0) {
		throw new Error(`Invalid index.json:\n${errors.join('\n')}`);
	}
}

// The keys in the index.json map are already the full name-based paths
// No need to build them - they're provided directly

async function loadMarkdownVariants(libraryPath: string, fullPath: string): Promise<MarkdownVariants> {
	const basePath = join(libraryPath, fullPath);
	const variants: MarkdownVariants = {};

	for (const variant of markdownVariantKeys) {
		const filePath = join(basePath, variant + ".md");
		if (existsSync(filePath)) {
			try {
				const content = await readFile(filePath, 'utf-8');
				variants[variant] = content;
				// debug(`Loaded ${variant} for ${fullPath}`);
			} catch (error) {
				console.warn(`Failed to read ${filePath}:`, error);
			}
		}
	}

	return variants;
}

export async function loadLibrary(libraryPath: string, libraryName: string): Promise<LibraryDBItem> {
	debug(`Loading library: ${libraryName} from ${libraryPath}`);
	const indexPath = join(libraryPath, 'index.json');

	const content = await readFile(indexPath, 'utf-8');
	const data = JSON.parse(content);

	// Validate the index data
	validateIndexData(data);

	// Build tree structure
	const root: TreeNode = {
		name: '',
		path: '',
		children: new Map()
	};

	let itemCount = 0;
	for (const [fullPath, entry] of Object.entries(data.map as Record<string, IndexEntry>)) {
		// Load all markdown variants
		const markdown = await loadMarkdownVariants(libraryPath, fullPath);
		const nonNullMarkdown = Object.keys(markdown)
		debug(`${fullPath} -> ${entry.path} (${entry.type}) [${nonNullMarkdown.join(', ')}]`);

		const docItem: DocItem = {
			type: entry.type,
			path: entry.path,
			relevant: entry.relevant,
			token_counts: entry.token_counts,
			usage: entry.usage,
			markdown
		};

		// Build tree path
		const parts = fullPath.split('/');
		let current = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isLast = i === parts.length - 1;
			const currentPath = parts.slice(0, i + 1).join('/');

			if (!current.children.has(part)) {
				current.children.set(part, {
					name: part,
					path: currentPath,
					children: new Map(),
					data: isLast ? docItem : undefined
				});
			}

			current = current.children.get(part)!;
		}

		itemCount++;
	}

	debug(`Loaded ${itemCount} items for ${libraryName}`);

	return {
		library: libraryName,
		source: data.source,
		source_type: data.source_type,
		date: data.date,
		model: data.model,
		commit: data.commit,
		tree: root
	};
}

export async function loadLibrariesFromJson(path: string): Promise<void> {
	debug('Scanning libraries...');

	try {
		const entries = await readdir(path, { withFileTypes: true });

		for (const entry of entries) {
			if (!entry.isDirectory()) continue;

			const libPath = join(path, entry.name)
			const indexPath = join(path, entry.name, 'index.json');
			if (!existsSync(indexPath)) continue;

			try {
				const libraryCache = await loadLibrary(libPath, entry.name);
				cache.set(entry.name, libraryCache);
			} catch (error) {
				debug(`Failed to load library ${entry.name}: %o`, error);
			}
		}

		debug(`Loaded ${cache.size} libraries, %O`, cache);
	} catch (error) {
		debug('Failed to scan libraries: %O', error)
	}
}

export function getLibraries(): Array<{ name: string; source?: any; source_type?: string }> {
	return Array.from(cache.values()).map(lib => ({
		name: lib.library,
		source: lib.source,
		source_type: lib.source_type
	}));
}

export function getLibrary(name: string): LibraryDBItem | undefined {
	const res = cache.get(name);
	debug(`getLibrary(${name}) -> %O`, res)
	return res
}

export function getDocItem(library: string, fullPath: string): DocItem | undefined {
	const lib = cache.get(library);
	if (!lib) return undefined;

	// Navigate tree to find item
	const parts = fullPath.split('/');
	let current = lib.tree;

	for (const part of parts) {
		const child = current.children.get(part);
		if (!child) return undefined;
		current = child;
	}

	const res = current.data;
	debug(`getDocItem(${library}, ${fullPath}) -> %O`, res)
	return res
}
