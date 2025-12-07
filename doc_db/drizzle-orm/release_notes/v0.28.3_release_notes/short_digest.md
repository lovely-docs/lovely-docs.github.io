## Fixes
- Fixed sqlite-proxy and SQL.js `.get()` with empty results

## Features
- SQLite simplified query API
- Column `.$defaultFn()` / `.$default()` for runtime defaults
- Table `.$inferSelect` / `.$inferInsert` for type inference (replaces deprecated `InferModel`)

```ts
const table = mysqlTable('table', {
  id: varchar('id').$defaultFn(() => createId()),
});

type SelectUser = typeof usersTable.$inferSelect;
type InsertUser = typeof usersTable.$inferInsert;
```