import { getLibrary } from '$lib/server/doc-cache';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import dbg from 'debug'
const debug = dbg("app:pages:library:server")


export const load: PageServerLoad = async ({ params }) => {
	const libraryName = params.name;
	const library = getLibrary(libraryName);

	if (!library) {
		throw error(404, `Library not found: ${libraryName}`);
	}

	debug(library)

	return {
		library
	};
};
