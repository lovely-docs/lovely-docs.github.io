## Schema Organization

Drizzle schemas can be organized in a single file or spread across multiple files. All models must be exported for Drizzle-Kit to use them in migrations.

**Single file approach:**
```
src/db/schema.ts
```
Configure in `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts'
})
```

**Multiple files approach:**
```
src/db/schema/
  ├ users.ts
  ├ countries.ts
  ├ products.ts
```
Configure in `drizzle.config.ts`:
```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema'
})
```

## Tables and Columns

Tables must be defined with at least 1 column using dialect-specific functions (pgTable, mysqlTable, sqliteTable).

**PostgreSQL:**
```ts
import { pgTable, integer, varchar } from "drizzle-orm/pg-core";
export const users = pgTable('users', {
  id: integer(),
  firstName: varchar('first_name')
})
```

**MySQL:**
```ts
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";
export const users = mysqlTable('users', {
  id: int(),
  firstName: varchar('first_name', { length: 256 })
})
```

**SQLite:**
```ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
export const users = sqliteTable('users', {
  id: integer(),
  firstName: text('first_name')
})
```

By default, TypeScript key names are used as database column names. Use column aliases (second parameter) to use different names.

## Camel/Snake Case Mapping

Use the `casing` option during database initialization to automatically map camelCase to snake_case:

```ts
const db = drizzle({ 
  connection: process.env.DATABASE_URL, 
  casing: 'snake_case' 
})
```

With this, `firstName` in TypeScript automatically maps to `first_name` in the database.

## Reusable Column Definitions

Define common columns in a helper file and spread them across tables:

```ts
// columns.helpers.ts
const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
}

// users.ts
export const users = pgTable('users', {
  id: integer(),
  ...timestamps
})

// posts.ts
export const posts = pgTable('posts', {
  id: integer(),
  ...timestamps
})
```

## PostgreSQL Schemas

PostgreSQL supports schemas (namespace containers). Define with `pgSchema`:

```ts
import { pgSchema, integer } from "drizzle-orm/pg-core";

export const customSchema = pgSchema('custom');

export const users = customSchema.table('users', {
  id: integer()
})
```

## MySQL Schemas

MySQL schemas are equivalent to databases. Can be defined but won't be detected by Drizzle-Kit or included in migrations:

```ts
import { mysqlSchema, int } from "drizzle-orm/mysql-core";

export const customSchema = mysqlSchema('custom');

export const users = customSchema.table('users', {
  id: int()
})
```

## SQLite

SQLite has no schema concept; tables exist within a single file context.

## Complete Example

**PostgreSQL:**
```ts
import { pgEnum, pgTable as table, integer, varchar, uniqueIndex, index } from "drizzle-orm/pg-core";
import { AnyPgColumn } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["guest", "user", "admin"]);

export const users = table("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  email: varchar().notNull(),
  invitee: integer().references((): AnyPgColumn => users.id),
  role: rolesEnum().default("guest"),
}, (table) => [
  uniqueIndex("email_idx").on(table.email)
]);

export const posts = table("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar().$default(() => generateUniqueString(16)),
  title: varchar({ length: 256 }),
  ownerId: integer("owner_id").references(() => users.id),
}, (table) => [
  uniqueIndex("slug_idx").on(table.slug),
  index("title_idx").on(table.title),
]);

export const comments = table("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  text: varchar({ length: 256 }),
  postId: integer("post_id").references(() => posts.id),
  ownerId: integer("owner_id").references(() => users.id),
});
```

**MySQL:**
```ts
import { mysqlTable as table, int, varchar, mysqlEnum, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { AnyMySqlColumn } from "drizzle-orm/mysql-core";

export const users = table("users", {
  id: int().primaryKey().autoincrement(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  email: varchar({ length: 256 }).notNull(),
  invitee: int().references((): AnyMySqlColumn => users.id),
  role: mysqlEnum(["guest", "user", "admin"]).default("guest"),
}, (table) => [
  uniqueIndex("email_idx").on(table.email)
]);

export const posts = table("posts", {
  id: int().primaryKey().autoincrement(),
  slug: varchar({ length: 256 }).$default(() => generateUniqueString(16)),
  title: varchar({ length: 256 }),
  ownerId: int("owner_id").references(() => users.id),
}, (table) => [
  uniqueIndex("slug_idx").on(table.slug),
  index("title_idx").on(table.title),
]);

export const comments = table("comments", {
  id: int().primaryKey().autoincrement(),
  text: varchar({ length: 256 }),
  postId: int("post_id").references(() => posts.id),
  ownerId: int("owner_id").references(() => users.id),
});
```

**SQLite:**
```ts
import { sqliteTable as table, integer, text, uniqueIndex, index } from "drizzle-orm/sqlite-core";
import { AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const users = table("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text().notNull(),
  invitee: integer().references((): AnySQLiteColumn => users.id),
  role: text().$type<"guest" | "user" | "admin">().default("guest"),
}, (table) => [
  uniqueIndex("email_idx").on(table.email)
]);

export const posts = table("posts", {
  id: integer().primaryKey({ autoIncrement: true }),
  slug: text().$default(() => generateUniqueString(16)),
  title: text(),
  ownerId: integer("owner_id").references(() => users.id),
}, (table) => [
  uniqueIndex("slug_idx").on(table.slug),
  index("title_idx").on(table.title),
]);

export const comments = table("comments", {
  id: integer().primaryKey({ autoIncrement: true }),
  text: text({ length: 256 }),
  postId: integer("post_id").references(() => posts.id),
  ownerId: integer("owner_id").references(() => users.id),
});
```