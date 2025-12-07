## Migrations Fundamentals

SQL databases require strict schemas defined upfront. Schema changes are managed through migrations. There are two primary approaches:

**Database First**: Database schema is the source of truth. Manage schema directly on the database or via migration tools, then pull the schema to your codebase using `drizzle-kit pull`.

**Codebase First**: TypeScript/JavaScript schema in your codebase is the source of truth under version control. Declare and manage schema in code, then apply to the database.

## Six Migration Strategies

**Option 1 - Database First (Pull)**
Use `drizzle-kit pull` to extract database schema as TypeScript:
```typescript
import * as p from "drizzle-orm/pg-core";
export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

**Option 2 - Codebase First (Push)**
Modify TypeScript schema, use `drizzle-kit push` to apply directly to database. Best for rapid prototyping and production applications.

**Option 3 - Codebase First (Generate + Migrate)**
Use `drizzle-kit generate` to create SQL migration files from schema changes, then `drizzle-kit migrate` to apply them:
```sql
-- drizzle/20242409125510_premium_mister_fear/migration.sql
CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

**Option 4 - Codebase First (Generate + Runtime)**
Generate SQL migrations with `drizzle-kit generate`, apply during application runtime:
```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from 'drizzle-orm/node-postgres/migrator';
const db = drizzle(process.env.DATABASE_URL);
await migrate(db);
```
Used for monolithic apps with zero-downtime deployments and serverless deployments.

**Option 5 - Codebase First (Generate Only)**
Use `drizzle-kit generate` to create SQL files, apply manually or via external tools (Bytebase, Liquibase, Atlas, etc.).

**Option 6 - Codebase First (Export)**
Use `drizzle-kit export` to output SQL representation of schema to console, apply via Atlas or other external tools.