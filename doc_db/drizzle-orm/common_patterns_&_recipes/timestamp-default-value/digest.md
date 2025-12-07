## Setting Timestamp Default Values

### PostgreSQL

Use `defaultNow()` or `sql` operator with `now()` for current timestamp:

```ts
import { sql } from 'drizzle-orm';
import { timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
});
```

The `mode: 'string'` option treats values as strings in the application but stores them as timestamps in the database. Default mode returns Date objects.

For unix timestamp (seconds since 1970-01-01), use `extract(epoch from now())`:

```ts
timestamp: integer('timestamp')
  .notNull()
  .default(sql`extract(epoch from now())`),
```

### MySQL

Use `defaultNow()` or `sql` operator with `now()`:

```ts
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
  timestamp3: timestamp('timestamp3', { fsp: 3 })
    .notNull()
    .default(sql`now(3)`),
});
```

The `fsp` option sets fractional seconds precision (0-6, default 0). The `mode: 'string'` option treats values as strings in the application.

For unix timestamp, use `unix_timestamp()`:

```ts
timestamp: int('timestamp')
  .notNull()
  .default(sql`(unix_timestamp())`),
```

### SQLite

Use `sql` operator with `current_timestamp` for text representation:

```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
});
```

For unix timestamp, use `unixepoch()`:

```ts
timestamp1: integer('timestamp1', { mode: 'timestamp' })
  .notNull()
  .default(sql`(unixepoch())`),
timestamp2: integer('timestamp2', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
timestamp3: integer('timestamp3', { mode: 'number' })
  .notNull()
  .default(sql`(unixepoch())`),
```

The `mode` option controls how values are handled in the application:
- `timestamp`: seconds as Date object
- `timestamp_ms`: milliseconds as Date object
- `number`: raw number value