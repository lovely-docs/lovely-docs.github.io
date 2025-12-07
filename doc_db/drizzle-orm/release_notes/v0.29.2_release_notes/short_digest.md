## Fixes
- PgArray string escaping, SQLite exists syntax, AWS Data API dates, Hermes mixins

## ESLint Plugin v0.2.3
- Support for Drizzle objects from functions, improved error messages

## New: Expo SQLite Driver
Install: `npm install drizzle-orm expo-sqlite@next`

Usage:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const db = drizzle(openDatabaseSync("db.db"));
await db.select().from(...);
```

For migrations, add babel plugin `inline-import` with `.sql` extension, update `metro.config.js` to include `sql` in sourceExts, create `drizzle.config.ts` with `driver: 'expo'`, then run `npx drizzle-kit generate` and use `useMigrations` hook in App.tsx.