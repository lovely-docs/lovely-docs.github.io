import { getLibrary } from 'lovely-docs-mcp/doc-cache';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import dbg from 'debug'
let debug = dbg("app:pages:[name]/server")


export const load: LayoutServerLoad = async ({ params }) => {
	const libraryName = params.name;
	debug = dbg(`app:pages:${libraryName}/+server`)
	const library = getLibrary(libraryName);

	if (!library) {
		throw error(404, `Library not found: ${libraryName}`);
	}

	debug(library)

	return { library };
};
