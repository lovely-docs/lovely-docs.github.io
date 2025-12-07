## Getting Started with Drizzle ORM and Turso Database

Complete setup guide for integrating Drizzle ORM with Turso Database (SQLite).

### Prerequisites
- dotenv package for environment variables
- tsx package for running TypeScript
- Turso Database account and JavaScript driver

### Installation
```
npm install drizzle-orm@beta @tursodatabase/database dotenv
npm install -D drizzle-kit@beta tsx
```

### Environment Setup
Create `.env` file with database connection variable:
```
DB_FILE_NAME=mydb.sqlite
```

### Database Connection
Connect to Turso Database using Drizzle ORM driver.

### Schema Definition
Create table schema using Drizzle ORM table definitions.

### Configuration
Setup `drizzle.config.ts` with SQLite dialect and environment variable reference.

### Database Operations
Apply migrations, then perform CRUD operations:

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

Run with `tsx src/index.ts`