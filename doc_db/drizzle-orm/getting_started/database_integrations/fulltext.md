

## Pages

### neon_postgres_integration
Complete setup guide for Drizzle ORM with Neon Postgres: connection via neon-http driver, schema definition with foreign keys and timestamps, migrations via drizzle-kit, and CRUD examples including joins and aggregations.

## Setup

Install dependencies:
- `drizzle-orm`, `drizzle-kit`
- `@neondatabase/serverless` (Neon serverless driver)
- `dotenv`

Create `.env` with Neon connection string:
```
DATABASE_URL=postgres://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
```

Create `src/db.ts`:
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

## Schema Definition

Create `src/schema.ts`:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

## Drizzle Config

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Generate and run migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Or push directly: `npx drizzle-kit push` (for quick prototyping).

## Query Examples

Insert:
```typescript
import { db } from '../db';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

Select:
```typescript
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../db';
import { SelectUser, usersTable, postsTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

Update:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

Delete:
```typescript
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

### drizzle_with_nile_database
Multi-tenant Express app with Drizzle ORM and Nile Database: configure connection, introspect built-in tenants table, define schema, use AsyncLocalStorage + tenantDB() wrapper to set nile.tenant_id in transaction context for automatic per-tenant data isolation without explicit WHERE clauses.

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

### supabase_integration
Connect Drizzle to Supabase Postgres via postgres-js driver, define schema with pgTable, configure drizzle-kit for migrations, perform CRUD with insert/select/update/delete queries.

## Setup

Install dependencies: `drizzle-orm`, `drizzle-kit`, `dotenv`, `postgres` package.

Create Supabase project, get connection string from Database Settings with connection pooling enabled, add to `.env` as `DATABASE_URL`.

## Database Connection

Create `src/db/index.ts`:
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

## Schema Definition

Create `src/db/schema.ts` with table definitions:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

## Drizzle Config

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Migrations

Generate: `npx drizzle-kit generate` (creates SQL files in `supabase/migrations`)

Run: `npx drizzle-kit migrate`

Or use Supabase CLI: `supabase init`, `supabase link`, `supabase db push`

Alternative: `npx drizzle-kit push` for rapid prototyping (no migration files).

## Query Examples

**Insert:**
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

**Select:**
```typescript
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({ id: postsTable.id, title: postsTable.title })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete:**
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

### drizzle-with-turso
Setup Drizzle with Turso (SQLite-compatible database): install dependencies, create Turso DB and auth token, configure connection URL/token in .env, create db connection with libSQL driver, define SQLite schema, configure drizzle.config.ts with turso dialect, generate and run migrations, use standard insert/select/update/delete queries.

## Setup

Install dependencies:
- `drizzle-orm`, `drizzle-kit`
- `dotenv` for environment variables
- `@libsql/client` for Turso driver
- Turso CLI

Turso is a SQLite-compatible database built on libSQL with support for replication and microsecond-latency access.

## Configuration Steps

1. **Turso Setup**: Signup/login with `turso auth signup/login`, create database with `turso db create drizzle-turso-db`, create auth token with `turso db tokens create drizzle-turso-db`

2. **Environment Variables** (`.env`):
```
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=
```

3. **Database Connection** (`src/db/index.ts`):
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env' });

export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```

4. **Schema Definition** (`src/db/schema.ts`):
```typescript
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').unique().notNull(),
});

export const postsTable = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

5. **Drizzle Config** (`drizzle.config.ts`):
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

6. **Migrations**: Run `npx drizzle-kit generate` to create migrations in `migrations/` directory, then `npx drizzle-kit migrate` to apply them. Alternatively use `npx drizzle-kit push` for rapid prototyping.

## Query Examples

**Insert**:
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

**Select**:
```typescript
import { asc, count, eq, getTableColumns, gt, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({
      id: postsTable.id,
      title: postsTable.title,
    })
    .from(postsTable)
    .where(gt(postsTable.createdAt, sql`(datetime('now','-24 hour'))`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

**Update**:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

**Delete**:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

### vercel-postgres-setup
Complete setup guide for Vercel Postgres with Drizzle: connection config, schema definition with pgTable, drizzle-kit migrations, and CRUD query patterns (insert/select/update/delete with joins, filtering, pagination).

## Setup Vercel Postgres with Drizzle ORM

**Prerequisites:**
- drizzle-orm, drizzle-kit
- dotenv package
- @vercel/postgres package

**Connection Setup:**
Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });
export const db = drizzle();
```

Add `POSTGRES_URL` to `.env.local` from Vercel dashboard.

**Schema Definition** in `src/db/schema.ts`:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

**Drizzle Config** in `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

**Migrations:**
- Generate: `npx drizzle-kit generate` (creates SQL files in migrations directory)
- Run: `npx drizzle-kit migrate`
- Or push directly: `npx drizzle-kit push` (for quick prototyping)

**Query Examples:**

Insert:
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

Select:
```typescript
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({ id: postsTable.id, title: postsTable.title })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

Update:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

Delete:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

**File Structure:**
```
src/db/
  ├ index.ts (connection)
  ├ schema.ts (table definitions)
  └ queries/ (insert.ts, select.ts, update.ts, delete.ts)
migrations/ (generated SQL files)
drizzle.config.ts
.env.local (POSTGRES_URL)
```

### xata_integration
Connect Drizzle ORM to Xata PostgreSQL database with postgres-js driver, define schema, generate/run migrations, and perform CRUD operations with examples.

## Setup

Install dependencies: `drizzle-orm`, `drizzle-kit`, `dotenv`, `postgres` package.

Create Xata database and get PostgreSQL connection string from dashboard. Add to `.env`:
```
DATABASE_URL=postgresql://postgres:<password>@<branch-id>.<region>.xata.tech/<database>?sslmode=require
```

Create `src/db/index.ts`:
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Create `src/db/schema.ts` with table definitions:
```typescript
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
});

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;
```

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

Generate and run migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Or use `npx drizzle-kit push` for rapid prototyping.

## Query Examples

Insert:
```typescript
import { db } from '../index';
import { InsertPost, InsertUser, postsTable, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createPost(data: InsertPost) {
  await db.insert(postsTable).values(data);
}
```

Select:
```typescript
import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, postsTable, usersTable } from '../schema';

export async function getUserById(id: SelectUser['id']) {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUsersWithPostsCount(page = 1, pageSize = 5) {
  return db
    .select({
      ...getTableColumns(usersTable),
      postsCount: count(postsTable.id),
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
    .groupBy(usersTable.id)
    .orderBy(asc(usersTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

export async function getPostsForLast24Hours(page = 1, pageSize = 5) {
  return db
    .select({ id: postsTable.id, title: postsTable.title })
    .from(postsTable)
    .where(between(postsTable.createdAt, sql`now() - interval '1 day'`, sql`now()`))
    .orderBy(asc(postsTable.title), asc(postsTable.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
```

Update:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectPost, postsTable } from '../schema';

export async function updatePost(id: SelectPost['id'], data: Partial<Omit<SelectPost, 'id'>>) {
  await db.update(postsTable).set(data).where(eq(postsTable.id, id));
}
```

Delete:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../index';
import { SelectUser, usersTable } from '../schema';

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
```

Xata features: branch-based development for isolated dev/staging/production environments, zero-downtime schema changes, data anonymization, AI-powered performance monitoring.

