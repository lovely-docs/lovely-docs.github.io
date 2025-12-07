## Expo SQLite Integration

Drizzle ORM provides native support for Expo SQLite with:
- Native ORM driver for Expo SQLite
- Drizzle Kit support for migration generation and bundling
- Drizzle Studio dev tools plugin for on-device database browsing
- Live Queries support

### Installation
```
npm install drizzle-orm expo-sqlite@next
npm install -D drizzle-kit
```

### Basic Usage
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
await db.select().from(users);
```

### Live Queries
Use `useLiveQuery` hook to make queries reactive with automatic re-renders on data changes:
```ts
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);

const App = () => {
  const { data } = useLiveQuery(db.select().from(schema.users));
  return <Text>{JSON.stringify(data)}</Text>;
};
```

### Migrations Setup
1. Install babel plugin for bundling SQL files:
```
npm install babel-plugin-inline-import
```

2. Update configuration files:
```js
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
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
  driver: 'expo'
});
```

3. Generate migrations:
```bash
npx drizzle-kit generate
```

4. Run migrations in app:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  
  return ...your application component;
}
```