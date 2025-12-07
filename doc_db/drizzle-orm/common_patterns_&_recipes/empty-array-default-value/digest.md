## Setting Empty Array as Default Value

### PostgreSQL
Use `sql` operator with array syntax:
```ts
import { sql } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tags1: text('tags1').array().notNull().default(sql`'{}'::text[]`),
  tags2: text('tags2').array().notNull().default(sql`ARRAY[]::text[]`),
});
```

### MySQL
MySQL lacks native array type; use `json` instead with `JSON_ARRAY()` or `sql` operator:
```ts
import { sql } from 'drizzle-orm';
import { json, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  tags1: json('tags1').$type<string[]>().notNull().default([]),
  tags2: json('tags2').$type<string[]>().notNull().default(sql`('[]')`),
  tags3: json('tags3').$type<string[]>().notNull().default(sql`(JSON_ARRAY())`),
});
```
The `mode` option (e.g., `json` mode) defines how values are handled in the application. Use `.$type<..>()` for compile-time type inference and protection for default values, insert and select schemas.

### SQLite
SQLite lacks native array type; use `text` with `json` mode:
```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  tags1: text('tags1', { mode: 'json' }).notNull().$type<string[]>().default(sql`(json_array())`),
  tags2: text('tags2', { mode: 'json' }).notNull().$type<string[]>().default(sql`'[]'`),
});
```
The `mode: 'json'` option treats values as JSON object literals. Use `.$type<..>()` for compile-time type inference.