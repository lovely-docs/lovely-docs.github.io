## Setup with Turso Database

Install: `drizzle-orm@beta @tursodatabase/database dotenv` and dev deps `drizzle-kit@beta tsx`

Set `DB_FILE_NAME` env variable, configure drizzle.config.ts with SQLite dialect, introspect existing database.

Connect: `const db = drizzle();`

Operations:
```typescript
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { usersTable } from './db/schema';

const db = drizzle();
await db.insert(usersTable).values({ name: 'John', age: 30, email: 'john@example.com' });
const users = await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));
await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
```

Run with `tsx src/index.ts`