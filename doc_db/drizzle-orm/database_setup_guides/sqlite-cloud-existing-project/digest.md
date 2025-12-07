## Setup Drizzle ORM with SQLite Cloud in an existing project

**Prerequisites:**
- dotenv package for environment variables
- tsx package for running TypeScript files
- SQLite Cloud database and driver

**Installation:**
```bash
npm install drizzle-orm@beta @sqlitecloud/drivers dotenv
npm install -D drizzle-kit@beta tsx
```

**Configuration:**
1. Set `SQLITE_CLOUD_CONNECTION_STRING` environment variable
2. Create drizzle config file with `dialect: 'sqlite'` and the connection string env variable
3. Introspect existing database to generate schema
4. Transfer introspected code to schema file

**Connection:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const db = drizzle();
```

**Database Operations:**
```typescript
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

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

**Schema Updates:**
After modifying schema, apply changes to database and query with new fields. Example with added phone field:
```typescript
const user = { name: 'John', age: 30, email: 'john@example.com', phone: '123-456-7890' };
await db.insert(usersTable).values(user);
```