## PGlite Driver Support

PGlite is a WASM Postgres build packaged as a TypeScript client library that runs Postgres in the browser, Node.js, and Bun without additional dependencies. It's 2.6mb gzipped and can operate as an ephemeral in-memory database or with persistence to the file system (Node/Bun) or indexedDB (Browser). Unlike previous "Postgres in the browser" projects, PGlite uses pure Postgres in WASM without a Linux virtual machine.

**Usage:**
```ts
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { users } from './schema';

const client = new PGlite();
const db = drizzle(client);
await db.select().from(users);
```