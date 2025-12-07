## Setup Drizzle ORM with Turso Database in an existing project

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- Turso Database account and driver

**Installation:**
```bash
npm install drizzle-orm@beta @tursodatabase/database dotenv
npm install -D drizzle-kit@beta tsx
```

**Configuration:**
1. Set environment variable `DB_FILE_NAME` in `.env` file (e.g., `DB_FILE_NAME=mydb.sqlite`)
2. Create `drizzle.config.ts` with SQLite dialect and reference the env variable
3. Introspect existing database to generate schema
4. Transfer introspected code to `src/db/schema.ts`

**Connection:**
```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
const db = drizzle();
```

**Database Operations:**
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
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

**Schema Updates:**
After modifying schema, apply changes to database and query with new fields. Example with added `phone` field:
```typescript
const user = { name: 'John', age: 30, email: 'john@example.com', phone: '123-456-7890' };
await db.insert(usersTable).values(user);
```

**Execution:**
Run with `tsx src/index.ts`