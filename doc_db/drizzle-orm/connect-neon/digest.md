## Neon Postgres Connection

Drizzle has native support for Neon serverless database connections using `neon-http` and `neon-websockets` drivers, which wrap the neon-serverless driver. HTTP is faster for single non-interactive transactions; WebSockets support session and interactive transactions.

### Installation
```
drizzle-orm @neondatabase/serverless
-D drizzle-kit
```

### Neon HTTP
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Or with existing driver:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
```

### Neon WebSockets
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
const db = drizzle(process.env.DATABASE_URL);
```

For Node.js (requires `ws` and `bufferutil` packages):
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
const db = drizzle({ connection: process.env.DATABASE_URL, ws: ws });
```

Or with existing Pool:
```typescript
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

For Node.js with Pool:
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### node-postgres
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### postgres.js
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
```

For serverful Node.js environments, use PostgresJS driver as described in Neon's official Node.js docs. For Cloudflare Workers example, see Drizzle's Neon Cloudflare Worker example.