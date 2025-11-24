
import { getLibraries } from 'lovely-docs-mcp/doc-cache';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async () => {
    return { libraries: getLibraries() }
};
