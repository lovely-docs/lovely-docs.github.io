## MySQL `$returningId()` function

MySQL lacks native `RETURNING` support for `INSERT`. Drizzle provides `$returningId()` to automatically retrieve inserted IDs from autoincrement primary keys:

```ts
const usersTable = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
});

const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// { id: number }[]
```

Also works with custom primary keys generated via `$defaultFn()`:

```ts
const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});

const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// { customId: string }[]
```

If no primary keys exist, returns `{}[]`.

## PostgreSQL Sequences

Define sequences with optional parameters in any schema:

```ts
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

export const customSequence = pgSequence("name");
export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});

export const customSchema = pgSchema('custom_schema');
export const customSequence = customSchema.sequence("name");
```

## PostgreSQL Identity Columns

Recommended replacement for deprecated `serial` type. Use `.generatedAlwaysAsIdentity()` with optional sequence properties:

```ts
import { pgTable, integer, text } from 'drizzle-orm/pg-core' 

export const ingredients = pgTable("ingredients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 }),
  name: text("name").notNull(),
  description: text("description"),
});
```

## PostgreSQL Generated Columns

Create generated columns using `.generatedAlwaysAs()` with SQL expressions or strings:

```ts
import { SQL, sql } from "drizzle-orm";
import { customType, index, integer, pgTable, text } from "drizzle-orm/pg-core";

const tsVector = customType<{ data: string }>({
  dataType() { return "tsvector"; },
});

export const test = pgTable("test", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  content: text("content"),
  contentSearch: tsVector("content_search", { dimensions: 3 })
    .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${test.content})`),
}, (t) => ({
  idx: index("idx_content_search").using("gin", t.contentSearch),
}));

export const users = pgTable("users", {
  id: integer("id"),
  name: text("name"),
  generatedName: text("gen_name").generatedAlwaysAs(sql`hello world!`),
  generatedName1: text("gen_name1").generatedAlwaysAs("hello world!"),
});
```

## MySQL Generated Columns

Supports both `stored` and `virtual` modes. Drizzle Kit `push` limitations: can't change expression/type (drop and recreate instead); `generate` has no limitations.

```ts
export const users = mysqlTable("users", {
  id: int("id"),
  name: text("name"),
  generatedName: text("gen_name").generatedAlwaysAs(
    (): SQL => sql`${schema2.users.name} || 'hello'`,
    { mode: "stored" }
  ),
  generatedName1: text("gen_name1").generatedAlwaysAs(
    (): SQL => sql`${schema2.users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
```

## SQLite Generated Columns

Supports `stored` and `virtual` modes. Drizzle Kit limitations: can't change stored expressions in existing tables (requires recreation); can't add stored expressions to existing columns (but can add virtual); can't change stored to virtual (but can change virtual to stored).

## Drizzle Kit Features

**Migrations support**: PostgreSQL sequences, identity columns, and generated columns for all dialects.

**`--force` flag for `push`**: Auto-accept all data-loss statements.

**`migrations.prefix` flag**: Customize migration file naming:
- `index` (default): `0001_name.sql`
- `supabase`/`timestamp`: `20240627123900_name.sql`
- `unix`: `1719481298_name.sql`
- `none`: no prefix

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  migrations: { prefix: 'supabase' }
});
```