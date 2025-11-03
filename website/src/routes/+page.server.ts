import { getLibraries } from 'lovely-docs-mcp/doc-cache';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { libraries: getLibraries() };
};
