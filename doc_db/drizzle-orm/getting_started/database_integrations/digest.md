## Database Integrations with Drizzle ORM

Complete setup guides for integrating Drizzle ORM with various database providers.

### Neon Postgres (neon-http driver)
Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`. Create `.env` with `DATABASE_URL`. Create `src/db.ts`:
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

Define schema in `src/schema.ts` with `pgTable`, `serial`, `text`, `integer`, `timestamp`. Use `.references()` for foreign keys with `onDelete: 'cascade'`. Use `.$onUpdate(() => new Date())` for auto-updating timestamps. Infer types with `$inferInsert` and `$inferSelect`.

Create `drizzle.config.ts` with dialect `postgresql`. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push` for prototyping.

Query examples: `db.insert(table).values(data)`, `db.select().from(table).where(eq(table.id, id))`, `db.update(table).set(data).where(eq(...))`, `db.delete(table).where(eq(...))`. Use `leftJoin()`, `groupBy()`, `count()`, `getTableColumns()` for aggregations and joins. Use `between()` and `sql` for date filtering.

### Nile Database (Multi-tenant)
Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `node-postgres`, `express`. Get connection string from Nile dashboard, add to `.env` as `NILEDB_URL`.

Create `src/db/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from "drizzle-orm";
import { AsyncLocalStorage } from "async_hooks";

export const db = drizzle(process.env.NILEDB_URL);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

Run `npx drizzle-kit pull` to introspect Nile's built-in `tenants` table. Define custom tables with `pgTable`. In Express, use middleware to extract tenant ID from URL and store in `tenantContext`: `app.use('/api/tenants/:tenantId/*', (req, res, next) => { tenantContext.run(req.params.tenantId, next); })`. Wrap all queries with `tenantDB()` to automatically set `nile.tenant_id` in transaction context—no explicit `WHERE tenant_id = ...` needed. Nile handles data isolation at database level.

### Supabase (postgres-js driver)
Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `postgres`. Create Supabase project, get connection string with pooling enabled, add to `.env` as `DATABASE_URL`.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Schema and migrations same as Neon. Create `drizzle.config.ts` with dialect `postgresql`. Generate migrations with `npx drizzle-kit generate`, run with `npx drizzle-kit migrate`, or use Supabase CLI: `supabase init`, `supabase link`, `supabase db push`. Queries identical to Neon examples.

### Turso (SQLite via libSQL)
Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `@libsql/client`. Turso is SQLite-compatible with replication support.

Signup with `turso auth signup`, create database with `turso db create drizzle-turso-db`, create token with `turso db tokens create drizzle-turso-db`. Add to `.env`:
```
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=
```

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { config } from 'dotenv';

config({ path: '.env' });
export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```

Define schema with `sqliteTable` instead of `pgTable`. Use `integer('id').primaryKey()` instead of `serial()`. Use `text('created_at').default(sql`(CURRENT_TIMESTAMP)`)` for timestamps. Use `integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date())` for auto-update.

Create `drizzle.config.ts` with dialect `turso`. Generate and run migrations. For date filtering, use `gt(postsTable.createdAt, sql`(datetime('now','-24 hour'))`)` instead of `between()`.

### Vercel Postgres
Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `@vercel/postgres`. Add `POSTGRES_URL` to `.env.local` from Vercel dashboard.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });
export const db = drizzle();
```

Schema and migrations same as Neon/Supabase. Queries identical.

### Xata (PostgreSQL)
Install `drizzle-orm`, `drizzle-kit`, `dotenv`, `postgres`. Create Xata database, get PostgreSQL connection string from dashboard, add to `.env` as `DATABASE_URL`.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Schema and migrations same as Supabase. Xata features: branch-based development for isolated environments, zero-downtime schema changes, data anonymization, AI-powered performance monitoring.