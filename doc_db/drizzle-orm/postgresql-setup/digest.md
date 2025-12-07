## PostgreSQL Setup

Drizzle supports PostgreSQL via two drivers: `node-postgres` (pg) and `postgres.js`.

### Driver Differences
- **node-postgres**: Can install `pg-native` for ~10% speed boost; supports per-query type parsers without global patching
- **postgres.js**: Uses prepared statements by default (may need to opt out in AWS environments)

### node-postgres Setup

Install packages:
```
drizzle-orm pg
-D drizzle-kit @types/pg
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config options:
```typescript
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
```

With existing Pool:
```typescript
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### postgres.js Setup

Install packages:
```
drizzle-orm postgres
-D drizzle-kit
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config options:
```typescript
const db = drizzle({ 
  connection: { 
    url: process.env.DATABASE_URL, 
    ssl: true 
  }
});
```

With existing client:
```typescript
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
```