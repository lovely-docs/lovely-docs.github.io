import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import dbg from 'debug';

const debug = dbg('app:lib:doc-cache');

interface IndexEntry {
	path: string;
	relevant: boolean;
	type: 'page' | 'directory';
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

// Directory type - has digest and essence but not short_digest or fulltext
interface DocDirectory extends BaseDocItem {
	type: 'directory';
}

type DocItem = DocPage | DocDirectory;

interface LibraryDBItem {
	library: string;
	source: {
		name: string;
		doc_dir?: string;
		repo?: string;
		commit?: string;
	};
	source_type: "git" | "web";
	items: Map<string, DocItem>; // Key is the full name-based path (e.g., "Introduction/getting-started")
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

async function loadLibrary(libraryPath: string, libraryName: string): Promise<LibraryDBItem> {
	debug(`Loading library: ${libraryName} from ${libraryPath}`);
	const indexPath = join(libraryPath, 'index.json');

	const content = await readFile(indexPath, 'utf-8');
	const data = JSON.parse(content);

	// Validate the index data
	validateIndexData(data);

	const items = new Map<string, DocItem>();

	// Build the flat cache - keys are already full name-based paths
	for (const [fullPath, entry] of Object.entries(data.map as Record<string, IndexEntry>)) {

		// Load all markdown variants
		const markdown = await loadMarkdownVariants(libraryPath, fullPath);
		const nonNullMarkdown = Object.keys(markdown)
		debug(`${fullPath} -> ${entry.path} (${entry.type}) [${nonNullMarkdown.join(', ')}]`);

		const docItem: DocItem = {
			type: entry.type,
			path: entry.path,
			relevant: entry.relevant,
			usage: entry.usage,
			markdown
		};

		items.set(fullPath, docItem);
	}

	debug(`Loaded ${items.size} items for ${libraryName}`);

	return {
		library: libraryName,
		source: data.source,
		source_type: data.source_type,
		items
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
				debug(`Failed to load library ${entry.name}: %O`, error);
			}
		}

		debug(`Loaded ${cache.size} libraries`);
	} catch (error) {
		debug('Failed to scan libraries: %O', error)
	}
}

export function getLibraries(): Array<{ name: string; source?: any }> {
	return Array.from(cache.values()).map(lib => ({
		name: lib.library,
	}));
}

export function getLibrary(name: string): LibraryDBItem | undefined {
	const res = cache.get(name);
	debug(`getLibrary(${name}) -> %o`, res)
	return res
}

export function getDocItem(library: string, fullPath: string): DocItem | undefined {
	const lib = cache.get(library);
	const res = lib?.items.get(fullPath);
	debug(`getDocItem(${library}, ${fullPath}) -> %o`, res)
	return res
}
