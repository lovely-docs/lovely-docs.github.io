## Fixes
- Fixed sqlite-proxy and SQL.js `.get()` response when result is empty

## New Features

### SQLite Simplified Query API
Added simplified query API for SQLite.

### Column Builder Methods: `.$defaultFn()` / `.$default()`
Define runtime default values for columns with custom logic. Available for PostgreSQL, MySQL, and SQLite.

```ts
import { varchar, mysqlTable } from "drizzle-orm/mysql-core";
import { createId } from '@paralleldrive/cuid2';

const table = mysqlTable('table', {
  id: varchar('id', { length: 128 }).$defaultFn(() => createId()),
});
```

Note: Runtime defaults only affect drizzle-orm behavior, not drizzle-kit.

### Table Model Type Inference: `$inferSelect` / `$inferInsert`
Convenient methods for inferring table types. Replaces deprecated `InferModel`.

```ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
  jsonb: jsonb('jsonb').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// New approach
type SelectUser = typeof usersTable.$inferSelect;
type InsertUser = typeof usersTable.$inferInsert;

// Legacy approach (deprecated)
type SelectUser2 = InferSelectModel<typeof usersTable>;
type InsertUser2 = InferInsertModel<typeof usersTable>;
```

### Other Changes
- Deprecated `InferModel` type in favor of `InferSelectModel` and `InferInsertModel`
- Disabled `.d.ts` files bundling