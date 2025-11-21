import type { LayoutServerLoad } from './$types';
import YAML from 'yaml';
import {
	filterEcosystems,
	filterLibraries,
	getEcosystems,
	getLibraries,
	type LibraryFilterOptions
} from 'lovely-docs-mcp/doc-cache';
import { libraryIndex } from 'lovely-docs-mcp/handlers';

const toYaml = (value: unknown): string => YAML.stringify(value).trim();

function buildIndexes(options: LibraryFilterOptions) {
	const libs = filterLibraries(getLibraries(), options);
	const ecosystems = Array.from(filterEcosystems(getEcosystems(getLibraries()), options)).sort();

	const ecosystemKeys = ecosystems.length > 0 ? ecosystems : ['*'];

	const tools = ecosystemKeys.map((eco) => {
		const ecosystem = eco === '*' ? '*' : eco;
		const idx = libraryIndex(libs, ecosystem === '*' ? '*' : ecosystem);
		return {
			id: `listLibraries:${ecosystem}`,
			name: 'listLibraries',
			label: ecosystem,
			payloadYaml: toYaml(Object.keys(idx)),
			verboseYaml: toYaml(idx)
		};
	});

	const resources = ecosystemKeys.map((eco) => {
		const ecosystem = eco === '*' ? '*' : eco;
		const idx = libraryIndex(libs, ecosystem === '*' ? '*' : ecosystem);
		return {
			id: `doc-index:${ecosystem}`,
			name: 'doc-index',
			label: ecosystem,
			indexYaml: toYaml(Object.keys(idx)),
			verboseYaml: toYaml(idx)
		};
	});

	return { tools, resources, ecosystems: ecosystemKeys };
}

export const load: LayoutServerLoad = async () => {
	const baseOptions: LibraryFilterOptions = {};
	const { tools, resources, ecosystems } = buildIndexes(baseOptions);

	return {
		mcp: {
			tools,
			resources,
			ecosystems
		}
	};
};
