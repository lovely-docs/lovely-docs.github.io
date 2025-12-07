## Setup Drizzle ORM with PlanetScale in an existing project

This guide covers integrating Drizzle ORM with PlanetScale (MySQL database platform) using the `database-js` HTTP driver for serverless connections.

### Prerequisites
- dotenv for environment variables
- tsx for running TypeScript files
- PlanetScale account and database
- @planetscale/database driver (HTTP-based, not TCP)

### Setup Steps

1. **Install package**: `npm install @planetscale/database`

2. **Environment variables**: Set `DATABASE_URL` in `.env` file

3. **Drizzle config**: Create `drizzle.config.ts` with MySQL dialect and DATABASE_URL reference

4. **Introspect database**: Run `drizzle-kit introspect:mysql` to generate schema from existing database

5. **Transfer schema**: Move generated schema to your actual schema file

6. **Connect to database**:
```typescript
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const db = drizzle({ 
  connection: {
    host: process.env.DATABASE_HOST!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
  }
});
```

7. **Query database**: Execute SELECT, INSERT, UPDATE, DELETE operations

### Example: Full CRUD Operations
```typescript
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { usersTable } from './db/schema';

const db = drizzle({ 
  connection: {
    host: process.env.DATABASE_HOST!,
    username: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
  }
});

// INSERT
const user = { name: 'John', age: 30, email: 'john@example.com', phone: '123-456-7890' };
await db.insert(usersTable).values(user);

// SELECT
const users = await db.select().from(usersTable);

// UPDATE
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, user.email));

// DELETE
await db.delete(usersTable).where(eq(usersTable.email, user.email));
```

### Optional Steps
- Update table schema with new fields
- Apply schema changes to database
- Query with new fields