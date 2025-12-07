## OP-SQLite Setup

1. Create Expo project: `npx create-expo-app --template blank-typescript`
2. Install: `npm install drizzle-orm @op-engineering/op-sqlite drizzle-kit`
3. Connect: `const db = drizzle(open({ name: 'db' }))`
4. Define schema with `sqliteTable()` in db/schema.ts
5. Configure drizzle.config.ts with dialect 'sqlite' and driver 'expo'
6. Update metro.config.js to support .sql files
7. Update babel.config.js with inline-import plugin
8. Generate migrations: `npx drizzle-kit generate`
9. Apply migrations with `useMigrations()` hook and run queries (insert, select, delete)
10. Run: `npx expo run:ios`