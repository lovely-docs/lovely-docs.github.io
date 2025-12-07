## Getting Started with OP-SQLite

OP-SQLite is a SQLite library for React Native. This guide covers setting up Drizzle ORM with OP-SQLite in an Expo project.

### Prerequisites
- OP-SQLite library installed

### Setup Steps

**1. Create Expo project:**
```bash
npx create-expo-app --template blank-typescript
```

**2. Install packages:**
```bash
npm install drizzle-orm @op-engineering/op-sqlite
npm install -D drizzle-kit
```

**3. Initialize database connection in App.tsx:**
```ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

const opsqliteDb = open({ name: 'db' });
const db = drizzle(opsqliteDb);
```

**4. Define schema in db/schema.ts:**
```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

**5. Create drizzle.config.ts:**
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

**6. Configure metro.config.js:**
```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

**7. Update babel.config.js:**
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

**8. Generate migrations:**
```bash
npx drizzle-kit generate
```

**9. Apply migrations and query database in App.tsx:**
```ts
import { Text, View } from 'react-native';
import { open } from '@op-engineering/op-sqlite';
import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/op-sqlite';
import { usersTable } from './db/schema';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const opsqliteDb = open({ name: 'db' });
const db = drizzle(opsqliteDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) return;
    (async () => {
      await db.delete(usersTable);
      await db.insert(usersTable).values([
        { name: 'John', age: 30, email: 'john@example.com' }
      ]);
      const users = await db.select().from(usersTable);
      setItems(users);
    })();
  }, [success]);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  if (!items?.length) return <View><Text>Empty</Text></View>;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {items.map((item) => <Text key={item.id}>{item.email}</Text>)}
    </View>
  );
}
```

**10. Run the app:**
```bash
npx expo run:ios  # or yarn/pnpm/bun
```

### Project Structure
```
📦 project
 ├ 📂 drizzle (migrations)
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 App.tsx
 ├ 📜 drizzle.config.ts
 ├ 📜 metro.config.js
 ├ 📜 babel.config.js
 └ 📜 package.json
```