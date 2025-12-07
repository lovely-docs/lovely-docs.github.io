## Expo SQLite Setup

1. Create Expo TypeScript project and install `expo-sqlite`, `drizzle-orm`, `drizzle-kit`

2. Define schema in `db/schema.ts`:
```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

3. Create `drizzle.config.ts`:
```typescript
export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

4. Configure `metro.config.js` and `babel.config.js` to support SQL imports

5. Initialize in `App.tsx` and apply migrations:
```typescript
const db = drizzle(SQLite.openDatabaseSync('db.db'));
const { success, error } = useMigrations(db, migrations);

// CRUD operations
await db.insert(usersTable).values({ name: 'John', age: 30, email: 'john@example.com' });
const users = await db.select().from(usersTable);
await db.delete(usersTable);
```

6. Generate migrations: `npx drizzle-kit generate`
7. Run: `npx expo run:ios`