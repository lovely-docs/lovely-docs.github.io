## Setup Drizzle with Nile in existing project

1. Install `pg` and `@types/pg`
2. Set `NILEDB_URL` environment variable
3. Create drizzle config with `postgresql` dialect
4. Run `npx drizzle-kit pull` to introspect database and generate `schema.ts`, migrations, and `relations.ts`
5. Connect Drizzle to database and write queries
6. To update schema: modify `schema.ts`, run `npx drizzle-kit generate`, apply migrations

Example generated schema from introspection:
```typescript
import { pgTable, uuid, text, timestamp, varchar, vector, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const todos = pgTable("todos", {
	id: uuid().defaultRandom(),
	tenantId: uuid("tenant_id"),
	title: varchar({ length: 256 }),
	estimate: varchar({ length: 256 }),
	embedding: vector({ dimensions: 3 }),
	complete: boolean(),
});
```