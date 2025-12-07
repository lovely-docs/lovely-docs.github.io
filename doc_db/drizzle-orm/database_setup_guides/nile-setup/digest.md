## Getting Started with Nile (PostgreSQL for Multi-Tenant Apps)

This guide walks through setting up Drizzle ORM with Nile, a PostgreSQL database re-engineered for multi-tenant applications.

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **Nile** - PostgreSQL re-engineered for multi-tenant apps

### Installation & Setup

**Step 1: Install postgres package**
```bash
npm install pg
npm install -D @types/pg
```

**Step 2: Setup connection variables**
Create a `.env` file with `NILEDB_URL` environment variable containing your Nile database connection string.

**Step 3: Connect Drizzle ORM to the database**
Create a database connection using the postgres driver with the Nile connection URL.

**Step 4: Create schema with tenant-aware tables**
```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const tenantsTable = pgTable("tenants", {
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

Key pattern: Nile schemas include a tenants table and tenant-aware tables with `tenant_id` columns for multi-tenant isolation.

**Step 5: Setup Drizzle config file**
Create `drizzle.config.ts` with PostgreSQL dialect and `NILEDB_URL` environment variable reference.

**Step 6: Apply changes to database**
Run migrations to create tables in Nile.

**Step 7: Seed and query the database**
Insert and retrieve data using Drizzle ORM queries.

**Step 8: Run the application**
Execute the TypeScript file using tsx.