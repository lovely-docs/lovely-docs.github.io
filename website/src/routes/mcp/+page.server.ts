import type { PageServerLoad } from './$types';
import { getLibraries } from 'lovely-docs-mcp/doc-cache';

export const load: PageServerLoad = async () => {
	const libs = getLibraries();
	const libraries = Array.from(libs.entries()).map(([key, summary]) => ({ key, summary }));

	return { libraries };
};
