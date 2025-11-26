
import { getLibraries } from 'lovely-docs/doc-cache';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async () => {
    return { libraries: getLibraries() }
};
