## Schema Organization

Single file: `schema: './src/db/schema.ts'` or multiple files: `schema: './src/db/schema'` in drizzle.config.ts.

## Tables & Columns

Use dialect-specific functions (pgTable, mysqlTable, sqliteTable). TypeScript keys become column names; use second parameter for aliases.

```ts
// PostgreSQL
import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
export const users = pgTable('users', {
  id: integer(),
  firstName: varchar('first_name')
})

// MySQL
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
export const users = mysqlTable('users', {
  id: int(),
  firstName: varchar('first_name', { length: 256 })
})

// SQLite
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
export const users = sqliteTable('users', {
  id: integer(),
  firstName: text('first_name')
})
```

## Camel/Snake Case Mapping

```ts
const db = drizzle({ connection: process.env.DATABASE_URL, casing: 'snake_case' })
```

## Reusable Columns

```ts
const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

export const users = pgTable('users', { id: integer(), ...timestamps })
```

## PostgreSQL Schemas

```ts
export const customSchema = pgSchema('custom');
export const users = customSchema.table('users', { id: integer() })
```

## MySQL Schemas

Equivalent to databases; defined but not included in migrations:

```ts
export const customSchema = mysqlSchema('custom');
export const users = customSchema.table('users', { id: int() })
```

## SQLite

No schema support; single file context only.