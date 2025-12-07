## Setup

Install dependencies: `drizzle-orm`, `drizzle-kit`, `dotenv`, `node-postgres`, `express`.

Sign up to Nile, create a database, get connection string from Settings > Postgres logo > generate credentials, add to `.env`:
```
NILEDB_URL=postgres://user:password@us-west-2.db.thenile.dev:5432:5432/db_name
```

## Database Configuration

Create `src/db/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from "dotenv/config";
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

Create `drizzle.config.ts`:
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.NILEDB_URL! },
});
```

Run `npx drizzle-kit pull` to introspect Nile's built-in tables (especially `tenants` table).

## Schema

Generated `src/db/schema.ts` includes Nile's built-in `tenants` table. Add custom tables:
```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenants = pgTable("tenants", {
  id: uuid().default(sql`public.uuid_generate_v7()`).primaryKey().notNull(),
  name: text(),
  created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
  updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
  deleted: timestamp({ mode: 'string' }),
});

export const todos = pgTable("todos", {
  id: uuid().defaultRandom(),
  tenantId: uuid("tenant_id"),
  title: varchar({ length: 256 }),
  estimate: varchar({ length: 256 }),
  embedding: vector({ dimensions: 3 }),
  complete: boolean(),
});
```

Apply migrations with `npx drizzle-kit push`.

## Express Application

Create `src/app.ts`:
```typescript
import express from "express";
import { tenantDB, tenantContext, db } from "./db/db";
import { tenants as tenantSchema, todos as todoSchema } from "./db/schema";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

// Tenant-aware middleware: extract tenant ID from URL and store in AsyncLocalStorage
app.use('/api/tenants/:tenantId/*', (req, res, next) => {
  tenantContext.run(req.params.tenantId, next);
});

// Create tenant
app.post("/api/tenants", async (req, res) => {
  try {
    const tenants = await tenantDB(async (tx) => {
      return await tx.insert(tenantSchema).values({ name: req.body.name }).returning();
    });
    res.json(tenants);
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// List all tenants
app.get("/api/tenants", async (req, res) => {
  try {
    const tenants = await tenantDB(async (tx) => {
      return await tx.select().from(tenantSchema);
    });
    res.json(tenants);
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create todo for tenant
app.post("/api/tenants/:tenantId/todos", async (req, res) => {
  try {
    const { title, complete } = req.body;
    if (!title) return res.status(400).json({ message: "No task title provided" });
    
    const newTodo = await tenantDB(async (tx) => {
      return await tx.insert(todoSchema)
        .values({ tenantId: req.params.tenantId, title, complete })
        .returning();
    });
    res.json(newTodo);
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update todo for tenant
app.put("/api/tenants/:tenantId/todos", async (req, res) => {
  try {
    const { id, complete } = req.body;
    await tenantDB(async (tx) => {
      return await tx.update(todoSchema)
        .set({ complete })
        .where(eq(todoSchema.id, id));
    });
    res.sendStatus(200);
  } catch (error: any) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// List todos for tenant (no WHERE clause needed - tenant context handles isolation)
app.get("/api/tenants/:tenantId/todos", async (req, res) => {
  try {
    const todos = await tenantDB(async (tx) => {
      return await tx.select({
        id: todoSchema.id,
        tenant_id: todoSchema.tenantId,
        title: todoSchema.title,
        estimate: todoSchema.estimate,
      }).from(todoSchema);
    });
    res.json(todos);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT || 3001, () => console.log("Server running"));
```

Run with `npx tsx src/app.ts`.

## Testing

```bash
# Create tenant
curl -X POST 'localhost:3001/api/tenants' \
  -H 'Content-Type: application/json' \
  -d '{"name":"my first customer"}'

# List tenants
curl -X GET 'http://localhost:3001/api/tenants'

# Create todo (use real tenant-id)
curl -X POST 'http://localhost:3001/api/tenants/{tenantId}/todos' \
  -H 'Content-Type: application/json' \
  -d '{"title": "feed the cat", "complete": false}'

# List todos for tenant
curl -X GET 'http://localhost:3001/api/tenants/{tenantId}/todos'
```

## Key Concepts

- **Nile** is Postgres re-engineered for multi-tenant apps with built-in `tenants` table and virtual tenant databases
- **AsyncLocalStorage** stores tenant context per request, passed to `tenantDB()` wrapper
- **tenantDB()** wrapper executes queries in transaction with `nile.tenant_id` set, automatically isolating data per tenant
- Tenant ID can come from URL path, headers (`x-tenant-id`), or cookies
- No need for explicit `WHERE tenant_id = ...` clauses - Nile handles isolation at database level