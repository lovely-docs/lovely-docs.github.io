## Table Schemas

Declare SQL schemas using `pgSchema()`, `mysqlSchema()`, or `singlestoreSchema()` (SQLite unsupported). Schema names are prepended to queries.

**PostgreSQL:**
```ts
const mySchema = pgSchema("my_schema");
const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
const users = mySchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  color: colors('color').default('red'),
});
```

**MySQL/SingleStore:**
```ts
const mySchema = mysqlSchema("my_schema"); // or singlestoreSchema
const users = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```