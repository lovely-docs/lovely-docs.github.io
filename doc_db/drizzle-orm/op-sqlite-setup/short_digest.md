## OP SQLite Setup

Install: `npm install drizzle-orm @op-engineering/op-sqlite -D drizzle-kit`

Basic usage:
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';

const db = drizzle(open({ name: 'myDB' }));
await db.select().from(users);
```

For Expo/React Native migrations: install `babel-plugin-inline-import`, configure `babel.config.js`, `metro.config.js` with `dialect: 'sqlite'` and `driver: 'expo'` in `drizzle.config.ts`, run `npx drizzle-kit generate`, then use `useMigrations` hook to run migrations on app startup.