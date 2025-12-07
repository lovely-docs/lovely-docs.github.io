## Getting Started with Vercel Postgres

Complete setup guide for using Drizzle ORM with Vercel Postgres.

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript
- Vercel Postgres database and driver

**Setup Steps:**

1. Install `@vercel/postgres` package
2. Set `POSTGRES_URL` environment variable (copy from Vercel Postgres storage tab)
3. Connect to database:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
```

4. Create a table schema
5. Setup `drizzle.config.ts` with `dialect: 'postgresql'` and `POSTGRES_URL` env variable
6. Run migrations with Drizzle CLI
7. Seed and query the database:
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { usersTable } from './db/schema';

const db = drizzle();

// Insert
const user = { name: 'John', age: 30, email: 'john@example.com' };
await db.insert(usersTable).values(user);

// Select
const users = await db.select().from(usersTable);

// Update
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// Delete
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

8. Run the file with tsx