## SQLite Cloud Setup Guide

Prerequisites: dotenv, tsx, SQLite Cloud database, SQLite Cloud driver

**Installation:**
```bash
npm install drizzle-orm@beta @sqlitecloud/drivers dotenv
npm install -D drizzle-kit@beta tsx
```

**Environment Setup:**
Set `SQLITE_CLOUD_CONNECTION_STRING` environment variable

**Connection:**
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle();
```

**Schema Definition:**
Create tables using Drizzle schema definitions

**Configuration:**
Create drizzle.config.ts with dialect 'sqlite' and SQLITE_CLOUD_CONNECTION_STRING

**Database Operations:**
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/sqlite-cloud';
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

Run with: `npx tsx src/index.ts`