## UNIQUE Constraints Support Added

Support for `UNIQUE` constraints across PostgreSQL, MySQL, and SQLite databases.

### PostgreSQL
Single-column constraints defined at column level with optional custom name:
```ts
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: char('state', { length: 2 }).unique('custom'),
  field: char('field', { length: 2 }).unique('custom_field', { nulls: 'not distinct' }),
});
```

Multi-column constraints defined in table config with `nullsNotDistinct()` option:
```ts
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: char('state', { length: 2 }),
}, (t) => ({
  first: unique('custom_name').on(t.name, t.state).nullsNotDistinct(),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

PostgreSQL supports `NULLS NOT DISTINCT` option to restrict multiple NULL values.

### MySQL
Same syntax as PostgreSQL but without `NULLS NOT DISTINCT` support:
```ts
const table = mysqlTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

const table = mysqlTable('cities1', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

### SQLite
Unique constraints implemented as unique indexes. Supports optional naming:
```ts
const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom').on(t.name, t.state),
}));
```