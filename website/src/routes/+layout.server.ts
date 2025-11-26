import { loadLibrariesFromJson } from "lovely-docs/doc-cache";
import path from 'path';

const docPath = path.resolve(process.cwd(), '../doc_db/');

await loadLibrariesFromJson(docPath);

