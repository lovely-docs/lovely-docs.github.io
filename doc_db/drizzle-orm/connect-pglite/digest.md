## PGlite Integration

PGlite is a WASM Postgres build packaged as a TypeScript client library that runs Postgres in the browser, Node.js, and Bun without external dependencies. It's 2.6mb gzipped and uses native WASM instead of a Linux VM. Supports ephemeral in-memory databases or persistence to the file system (Node/Bun) or indexedDB (Browser).

### Installation

```
npm install drizzle-orm @electric-sql/pglite
npm install -D drizzle-kit
```

### Usage

In-memory database:
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle();
await db.select().from(...);
```

With file system persistence:
```typescript
const db = drizzle('path-to-dir');
```

With advanced configuration:
```typescript
const db = drizzle({ connection: { dataDir: 'path-to-dir' }});
```

Using an existing PGlite client:
```typescript
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const client = new PGlite();
const db = drizzle({ client });
await db.select().from(users);
```