## PostgreSQL Schemas
Declare PostgreSQL schemas and create tables within them:
```ts
import { pgSchema } from "drizzle-orm-pg";
export const mySchema = pgSchema("my_schema");
export const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```
Generates:
```sql
CREATE SCHEMA "my_schema";
CREATE TABLE IF NOT EXISTS "my_schema"."users" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text,
  "email" text
);
```
drizzle-kit auto-generates migrations: `drizzle-kit generate:pg --schema=src/schema.ts --out=migrations/`

## MySQL Databases/Schemas
Similar schema support for MySQL:
```ts
import { mysqlSchema } from "drizzle-orm-mysql";
const mySchema = mysqlSchema("my_schema");
const users = mySchema("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});
```
Generates:
```sql
CREATE DATABASE `my_schema`;
CREATE TABLE `my_schema`.`users` (
  `id` serial PRIMARY KEY NOT NULL,
  `name` text,
  `email` text
);
```
Command: `drizzle-kit generate:mysql --schema=src/schema.ts --out=migrations/`

## PostgreSQL Introspection
Pull existing PostgreSQL database schema automatically with drizzle-kit. Supports enums, tables with native/non-native columns, indexes, foreign keys, self-references, cyclic foreign keys, and schemas:
```shell
drizzle-kit introspect:pg --out=migrations/ --connectionString=postgresql://user:pass@host:port/db_name
```
Generates complete `schema.ts` with all detected types, enums, tables, columns, defaults, and relationships including cyclic references and self-references.

## Postgres.js Driver Support
Full support for postgres.js driver:
```ts
import { pgTable, serial, text, varchar } from "drizzle-orm-pg";
import { drizzle } from "drizzle-orm-pg/postgres.js";
import postgres from "postgres";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

const client = postgres(connectionString);
const db = drizzle(client);
const allUsers = await db.select(users);
```

## Custom Types
Create non-native PostgreSQL or MySQL types:
```ts
const customText = customType<{ data: string }>({
  dataType() { return "text"; }
});

// PostgreSQL
const pgUsersTable = pgTable("users", {
  name: customText("name").notNull(),
});

// MySQL
const mysqlUsersTable = mysqlTable("users", {
  name: customText("name").notNull(),
});
```