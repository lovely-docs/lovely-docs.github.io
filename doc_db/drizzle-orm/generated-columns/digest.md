## Generated Columns

Generated columns are database columns whose values are automatically computed based on expressions involving other columns. Two types exist:

1. **Virtual (non-persistent)**: Computed dynamically on query, no storage overhead
2. **Stored (persistent)**: Computed on insert/update and stored, can be indexed

Benefits: derive new data, automate calculations, enforce data integrity, simplify application logic.

### PostgreSQL

**Types**: STORED only

**Drizzle API**: `.generatedAlwaysAs()` on any column type

Three ways to specify expressions:

**String literal**:
```ts
export const test = pgTable("test", {
    generatedName: text("gen_name").generatedAlwaysAs(`hello world!`),
});
// CREATE TABLE "test" ("gen_name" text GENERATED ALWAYS AS (hello world!) STORED);
```

**SQL tag** (for escaping):
```ts
generatedName: text("gen_name").generatedAlwaysAs(sql`hello "world"!`),
// CREATE TABLE "test" ("gen_name" text GENERATED ALWAYS AS (hello "world"!) STORED);
```

**Callback** (to reference columns):
```ts
export const test = pgTable("test", {
    name: text("first_name"),
    generatedName: text("gen_name").generatedAlwaysAs(
      (): SQL => sql`hi, ${test.name}!`
    ),
});
// CREATE TABLE "test" ("first_name" text, "gen_name" text GENERATED ALWAYS AS (hi, "test"."first_name"!) STORED);
```

**Full-text search example**:
```ts
const tsVector = customType<{ data: string }>({
  dataType() { return "tsvector"; },
});

export const test = pgTable("test", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    content: text("content"),
    contentSearch: tsVector("content_search", { dimensions: 3 }).generatedAlwaysAs(
      (): SQL => sql`to_tsvector('english', ${test.content})`
    ),
  },
  (t) => [index("idx_content_search").using("gin", t.contentSearch)]
);
```

**Limitations**: Cannot specify defaults, reference other generated columns, use subqueries, modify expressions without schema changes, or use in primary/foreign/unique keys.

### MySQL

**Types**: STORED, VIRTUAL

**Drizzle API**: `.generatedAlwaysAs()` with optional `{ mode: "stored" | "virtual" }` parameter (defaults to VIRTUAL)

Same three expression formats as PostgreSQL:

```ts
export const users = mysqlTable("users", {
    id: int("id"),
    name: text("name"),
    storedGenerated: text("stored_gen").generatedAlwaysAs(
      (): SQL => sql`${users.name} || 'hello'`,
      { mode: "stored" }
    ),
    virtualGenerated: text("virtual_gen").generatedAlwaysAs(
      (): SQL => sql`${users.name} || 'hello'`,
      { mode: "virtual" }
    ),
});
// CREATE TABLE `users` (
//   `id` int, `name` text,
//   `stored_gen` text GENERATED ALWAYS AS (`users`.`name` || 'hello') STORED,
//   `virtual_gen` text GENERATED ALWAYS AS (`users`.`name` || 'hello') VIRTUAL
// );
```

**Drizzle Kit limitations for `push` command**:
1. Cannot change generated expression or type - must drop column, push, then add with new expression (data is restored since it's generated)
2. `generate` command has no limitations

### SQLite

**Types**: STORED, VIRTUAL

**Drizzle API**: `.generatedAlwaysAs()` with optional `{ mode: "stored" | "virtual" }` parameter (defaults to VIRTUAL)

Same three expression formats:

```ts
export const users = sqliteTable("users", {
  id: int("id"),
  name: text("name"),
  storedGenerated: text("stored_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "stored" }
  ),
  virtualGenerated: text("virtual_gen").generatedAlwaysAs(
    (): SQL => sql`${users.name} || 'hello'`,
    { mode: "virtual" }
  ),
});
// CREATE TABLE `users` (
//   `id` integer, `name` text,
//   `stored_gen` text GENERATED ALWAYS AS ("name" || 'hello') STORED,
//   `virtual_gen` text GENERATED ALWAYS AS ("name" || 'hello') VIRTUAL
// );
```

**Drizzle Kit limitations for `push` and `generate`**:
1. Cannot change stored generated expression - requires table recreation (data migration needed in future)
2. Cannot add stored expression to existing column, but can add virtual
3. Cannot change stored expression, but can change virtual
4. Cannot change from virtual to stored, but can change from stored to virtual

**Requirements**: drizzle-orm@0.32.0+, drizzle-kit@0.23.0+