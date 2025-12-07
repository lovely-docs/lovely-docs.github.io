## Bun SQLite Integration

Drizzle ORM natively supports the `bun:sqlite` module with both async and sync APIs.

### Installation
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Basic Setup
Initialize with default driver:
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
const db = drizzle();
const result = await db.select().from(...);
```

Or provide an existing Bun SQLite driver:
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
```

### Async API
```typescript
const result = await db.select().from(users);
```

### Sync API
For synchronous operations, use the following methods:
```typescript
const result = db.select().from(users).all();
const result = db.select().from(users).get();
const result = db.select().from(users).values();
const result = db.select().from(users).run();
```

The sync API mirrors popular SQLite methods: `all`, `get`, `values`, and `run`.