## Expo SQLite with Drizzle

**Installation:**
```
npm install drizzle-orm expo-sqlite@next -D drizzle-kit
```

**Basic usage:**
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const db = drizzle(openDatabaseSync("db.db"));
await db.select().from(users);
```

**Live queries with auto-rerender:**
```ts
const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const { data } = useLiveQuery(db.select().from(schema.users));
```

**Migrations:** Install `babel-plugin-inline-import`, configure `babel.config.js` (add inline-import plugin for .sql), `metro.config.js` (add 'sql' to sourceExts), and `drizzle.config.ts` (set `dialect: 'sqlite'`, `driver: 'expo'`). Run `npx drizzle-kit generate`, then use `useMigrations(db, migrations)` hook in app startup.