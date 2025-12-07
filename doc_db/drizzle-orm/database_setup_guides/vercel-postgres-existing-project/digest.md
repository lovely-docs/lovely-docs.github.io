## Setup Drizzle ORM with Vercel Postgres in an existing project

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Vercel Postgres database and driver

**Steps:**

1. Install `@vercel/postgres` package

2. Set up `POSTGRES_URL` environment variable in `.env.local` (copy from Vercel Postgres storage tab)

3. Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  schema: './src/db/schema.ts',
  out: './drizzle',
});
```

4. Introspect existing database to generate schema

5. Transfer introspected code to `src/db/schema.ts`

6. Connect to database in `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
```

7. Query database with CRUD operations:
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { usersTable } from './db/schema';

async function main() {
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
}

main();
```

8. Run with `tsx src/index.ts`

9. (Optional) Update schema by modifying `src/db/schema.ts`

10. (Optional) Apply migrations to database

11. (Optional) Query with new fields - same pattern as step 7 but with updated schema including new fields like `phone: string | null`