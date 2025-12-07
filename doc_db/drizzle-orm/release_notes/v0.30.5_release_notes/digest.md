## `$onUpdate` functionality for PostgreSQL, MySQL and SQLite

Adds dynamic update values to columns. The `$onUpdate()` function is called when a row is updated, and its returned value is used as the column value if none is provided. If no `default` or `$defaultFn` is set, the function is also called on insert.

Note: This is runtime-only behavior in drizzle-orm and does not affect drizzle-kit.

Example:
```ts
const usersOnUpdate = pgTable('users_on_update', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  updateCounter: integer('update_counter').default(sql`1`).$onUpdateFn(() => sql`update_counter + 1`),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  alwaysNull: text('always_null').$type<string | null>().$onUpdate(() => null),
});
```

## Fixes

- Insertions on columns with smallserial datatype are now correctly non-optional (issue #1848)