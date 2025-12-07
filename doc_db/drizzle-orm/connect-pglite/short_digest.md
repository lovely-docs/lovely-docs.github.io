## PGlite Integration

WASM Postgres for browser/Node.js/Bun, 2.6mb gzipped, supports in-memory or persistent storage.

**Installation:**
```
npm install drizzle-orm @electric-sql/pglite -D drizzle-kit
```

**Usage:**
```typescript
import { drizzle } from 'drizzle-orm/pglite';

// In-memory
const db = drizzle();

// With persistence
const db = drizzle('path-to-dir');

// Advanced config
const db = drizzle({ connection: { dataDir: 'path-to-dir' }});

// With existing client
import { PGlite } from '@electric-sql/pglite';
const client = new PGlite();
const db = drizzle({ client });
```