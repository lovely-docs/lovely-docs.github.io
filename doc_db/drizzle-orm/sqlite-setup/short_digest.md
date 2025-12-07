## SQLite Setup

**libsql** (supports files + Turso remote):
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DATABASE_URL);
// or with config: drizzle({ connection: { url: '', authToken: '' } })
// or with client: drizzle(createClient({ url, authToken }))
```

**better-sqlite3** (local files only):
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle(process.env.DATABASE_URL);
// or with config: drizzle({ connection: { source: process.env.DATABASE_URL } })
// or with client: drizzle({ client: new Database('sqlite.db') })
```

libsql offers more ALTER statements, encryption at rest, and extension support.