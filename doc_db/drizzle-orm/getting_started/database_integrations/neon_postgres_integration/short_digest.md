## Setup

Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`. Set `DATABASE_URL` in `.env`.

Create `src/db.ts`:
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
export const db = drizzle({ client: neon(process.env.DATABASE_URL!) });
```

## Schema & Config

Define tables in `src/schema.ts` with `pgTable()`. Create `drizzle.config.ts` with schema path, migrations output, and database credentials. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`.

## CRUD Operations

```typescript
// Insert
await db.insert(usersTable).values(data);

// Select with joins and aggregation
db.select({ ...getTableColumns(usersTable), postsCount: count(postsTable.id) })
  .from(usersTable)
  .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
  .groupBy(usersTable.id);

// Update
await db.update(postsTable).set(data).where(eq(postsTable.id, id));

// Delete
await db.delete(usersTable).where(eq(usersTable.id, id));
```