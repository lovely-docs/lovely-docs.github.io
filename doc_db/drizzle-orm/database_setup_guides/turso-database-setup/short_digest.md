## Turso Database Setup

Install `drizzle-orm@beta`, `@tursodatabase/database`, `dotenv`, and dev dependencies `drizzle-kit@beta`, `tsx`.

Set `DB_FILE_NAME` environment variable, connect to Turso, define schema, configure `drizzle.config.ts` with SQLite dialect, apply migrations.

CRUD example:
```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { eq } from 'drizzle-orm';

const db = drizzle();
await db.insert(usersTable).values({ name: 'John', age: 30, email: 'john@example.com' });
const users = await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, 'john@example.com'));
await db.delete(usersTable).where(eq(usersTable.email, 'john@example.com'));
```