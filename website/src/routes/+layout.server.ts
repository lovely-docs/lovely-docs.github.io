import { loadLibrariesFromJson } from "$lib/server/doc-cache";
import path from 'path';

const docPath = path.resolve(process.cwd(), '../doc_db');

await loadLibrariesFromJson(docPath)