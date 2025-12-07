## Getting Started with Expo SQLite

Setup Drizzle ORM with Expo SQLite for React Native applications.

### Prerequisites
- Expo SQLite library for database access via SQLite API

### Project Setup

1. Create Expo project with TypeScript template:
```bash
npx create-expo-app --template blank-typescript
```

2. Install Expo SQLite:
```bash
npx expo install expo-sqlite
```

3. Install Drizzle packages:
```bash
npm install drizzle-orm
npm install -D drizzle-kit
```

### Database Configuration

Create `db/schema.ts` with table definitions:
```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

### Metro and Babel Configuration

Create `metro.config.js`:
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

Update `babel.config.js`:
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

### Database Connection and Migrations

Initialize database in `App.tsx`:
```typescript
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);
```

Generate migrations:
```bash
npx drizzle-kit generate
```

### Complete Example with CRUD Operations

```typescript
import { Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { usersTable } from './db/schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) return;

    (async () => {
      // Delete all users
      await db.delete(usersTable);

      // Insert user
      await db.insert(usersTable).values([
        {
          name: 'John',
          age: 30,
          email: 'john@example.com',
        },
      ]);

      // Query users
      const users = await db.select().from(usersTable);
      setItems(users);
    })();
  }, [success]);

  if (error) {
    return <View><Text>Migration error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Migration in progress...</Text></View>;
  }

  if (items === null || items.length === 0) {
    return <View><Text>Empty</Text></View>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {items.map((item) => (
        <Text key={item.id}>{item.email}</Text>
      ))}
    </View>
  );
}
```

### Running the App

```bash
npx expo run:ios
# or: yarn expo run:ios, pnpm expo run:ios, bun expo run:ios
```

### Project Structure
```
📦 project root
 ├ 📂 drizzle (migrations and snapshots)
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 drizzle.config.ts
 ├ 📜 metro.config.js
 ├ 📜 babel.config.js
 ├ 📜 App.tsx
 └ 📜 package.json
```