## Setup Drizzle ORM with Nile in an existing project

Prerequisites: dotenv, tsx, Nile (PostgreSQL re-engineered for multi-tenant apps)

**Step 1-3: Installation and Configuration**
- Install `pg` package and `@types/pg` dev dependency
- Set `NILEDB_URL` environment variable
- Create drizzle config file with `postgresql` dialect pointing to `NILEDB_URL`

**Step 4: Introspect Database**
Run `npx drizzle-kit pull` to generate schema from existing database. This creates:
- `schema.ts` file with table definitions
- `meta` folder with schema snapshots
- SQL migration file
- `relations.ts` file for relational queries

Example database table:
```sql
CREATE TABLE IF NOT EXISTS "todos" (
  "id" uuid DEFAULT gen_random_uuid(),
  "tenant_id" uuid,
  "title" varchar(256),
  "estimate" varchar(256),
  "embedding" vector(3),
  "complete" boolean
);
```

Generated schema includes Nile's built-in tables (e.g., `tenants`):
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

**Step 5-7: Connect and Query**
- Transfer generated schema to actual schema file
- Connect Drizzle ORM to database using Nile connection
- Write and execute queries

**Step 9-11: Schema Updates (Optional)**
Add new columns to schema file:
```typescript
export const todos = pgTable("todos", {
	// ... existing fields
  deadline: timestamp({ mode: 'string' })
});
```

Run `npx drizzle-kit generate` to create migration, then apply changes to database. Re-run queries to see new fields (populated as null for existing records).