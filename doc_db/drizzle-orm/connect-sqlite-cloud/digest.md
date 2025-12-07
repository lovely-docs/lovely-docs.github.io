## SQLite Cloud Integration

SQLite Cloud is a managed, distributed relational database system built on SQLite.

### Installation
```
drizzle-orm@beta @sqlitecloud/drivers
-D drizzle-kit@beta
```

### Basic Usage
Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle(process.env.SQLITE_CLOUD_CONNECTION_STRING);
const result = await db.execute('select 1');
```

Or provide your own driver instance:
```typescript
import { Database } from '@sqlitecloud/drivers';
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const client = new Database(process.env.SQLITE_CLOUD_CONNECTION_STRING!);
const db = drizzle({ client });
const result = await db.execute('select 1');
```

Two initialization patterns: pass connection string directly to `drizzle()`, or instantiate `Database` client first and pass it via `{ client }` option.