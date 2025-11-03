import { getLibrary, getDocItem } from '$lib/server/doc-cache';
import { error } from '@sveltejs/kit';
import dbg from "debug";
const debug = dbg("app:page:library:path:server");

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const libraryName = params.name;
	const itemPath = params.path || '';

	const library = getLibrary(libraryName);

	if (!library) {
		throw error(404, `Library not found: ${libraryName}`);
	}

	const docItem = getDocItem(libraryName, itemPath);

	if (!docItem) {
		throw error(404, `Document not found: ${itemPath}`);
	}

	return {
		libraryName,
		itemPath,
		docItem
	};
};
