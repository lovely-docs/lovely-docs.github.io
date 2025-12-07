## Setup

Install: `drizzle-orm`, `drizzle-kit`, `dotenv`, `postgres`.

Get PostgreSQL connection string from Xata dashboard, add to `.env` as `DATABASE_URL`.

Create `src/db/index.ts`:
```typescript
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });
export const db = drizzle({ client: postgres(process.env.DATABASE_URL!) });
```

Define schema in `src/db/schema.ts` with tables and inferred types.

Create `drizzle.config.ts` with schema path, migrations folder, dialect, and database credentials.

Run `npx drizzle-kit generate` then `npx drizzle-kit migrate` (or use `push` for prototyping).

## CRUD Examples

```typescript
// Insert
await db.insert(usersTable).values({ name, age, email });

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