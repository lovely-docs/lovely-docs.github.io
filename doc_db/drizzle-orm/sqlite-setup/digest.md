## SQLite Setup

Drizzle supports SQLite via two drivers: `libsql` and `better-sqlite3`.

### libsql vs better-sqlite3

**libsql** advantages:
- Connects to both SQLite files and Turso remote databases
- More ALTER statements for schema management
- Native encryption at rest configuration
- Broader SQLite extension support

### libsql Setup

Install packages:
```
drizzle-orm @libsql/client
-D drizzle-kit
```

Initialize driver (async):
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config:
```typescript
const db = drizzle({ connection: { url: '', authToken: '' } });
```

With explicit client:
```typescript
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);
```

### better-sqlite3 Setup

Install packages:
```
drizzle-orm better-sqlite3
-D drizzle-kit @types/better-sqlite3
```

Initialize driver:
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config:
```typescript
const db = drizzle({ connection: { source: process.env.DATABASE_URL } });
```

With existing driver:
```typescript
import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
```