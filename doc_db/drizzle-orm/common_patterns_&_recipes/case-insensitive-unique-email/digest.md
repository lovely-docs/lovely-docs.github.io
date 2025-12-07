## Unique and Case-Insensitive Email Handling

Implement case-insensitive unique email validation across PostgreSQL, MySQL, and SQLite by creating a unique index on the lowercased email column.

### PostgreSQL

Create a custom `lower()` function that wraps the SQL `lower()` function:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ],
);
```

Generated SQL:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "users" USING btree (lower("email"));
```

Query users by email:
```ts
import { eq } from 'drizzle-orm';

const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

### MySQL

MySQL's default collation is case-insensitive, but explicitly enforce it with a functional index (requires MySQL 8.0.13+). The `lower()` function must wrap the column in parentheses:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyMySqlColumn, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`;
}

export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);
```

Generated SQL:
```sql
CREATE TABLE `users` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  CONSTRAINT `users_id` PRIMARY KEY(`id`),
  CONSTRAINT `emailUniqueIndex` UNIQUE((lower(`email`)))
);
```

Query pattern same as PostgreSQL.

### SQLite

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnySQLiteColumn, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);
```

Generated SQL:
```sql
CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower(`email`));
```

Query pattern same as PostgreSQL.