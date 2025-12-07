## OP SQLite Integration

OP-SQLite embeds the latest SQLite version and provides a low-level API for SQL queries.

### Installation
```
npm install drizzle-orm @op-engineering/op-sqlite -D drizzle-kit
```

### Basic Usage
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);
await db.select().from(users);
```

### Migrations Setup (Expo/React Native)

OP SQLite requires SQL migrations bundled into the app. Use Drizzle Kit for generation.

1. **Install babel plugin** to inline SQL files:
```
npm install babel-plugin-inline-import
```

2. **Update config files**:
```js
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [['inline-import', { extensions: ['.sql'] }]],
};
```

```js
// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
});
```

3. **Generate migrations**:
```bash
npx drizzle-kit generate
```

4. **Run migrations in app**:
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const opsqliteDb = open({ name: 'myDB' });
const db = drizzle(opsqliteDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  
  return ...your application component;
}
```