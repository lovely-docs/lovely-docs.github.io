## PlanetScale Setup for Existing Project

Install `@planetscale/database`, set `DATABASE_URL` env var, create drizzle config with MySQL dialect, introspect existing database, then connect and query:

```typescript
import { drizzle } from 'drizzle-orm/planetscale-serverless';
const db = drizzle({ connection: { host, username, password } });

// CRUD operations
await db.insert(usersTable).values(user);
const users = await db.select().from(usersTable);
await db.update(usersTable).set({ age: 31 }).where(eq(usersTable.email, email));
await db.delete(usersTable).where(eq(usersTable.email, email));
```