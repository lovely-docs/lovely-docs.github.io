## Table Schemas

Drizzle ORM provides APIs for declaring SQL schemas in PostgreSQL, MySQL, and SingleStore dialects. When entities are declared within a schema, query builders prepend schema names in queries (e.g., `select * from "schema"."users"`). SQLite does not support schemas.

### PostgreSQL

```ts
import { serial, text, pgSchema } from "drizzle-orm/pg-core";

export const mySchema = pgSchema("my_schema");
export const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
export const mySchemaUsers = mySchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  color: colors('color').default('red'),
});
```

Generates:
```sql
CREATE SCHEMA "my_schema";
CREATE TYPE "my_schema"."colors" AS ENUM ('red', 'green', 'blue');
CREATE TABLE "my_schema"."users" (
  "id" serial PRIMARY KEY,
  "name" text,
  "color" "my_schema"."colors" DEFAULT 'red'
);
```

### MySQL

```ts
import { int, text, mysqlSchema } from "drizzle-orm/mysql-core";

export const mySchema = mysqlSchema("my_schema");
export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

Generates:
```sql
CREATE SCHEMA "my_schema";
CREATE TABLE "my_schema"."users" (
  "id" serial PRIMARY KEY,
  "name" text
);
```

### SingleStore

```ts
import { int, text, singlestoreSchema } from "drizzle-orm/singlestore-core";

export const mySchema = singlestoreSchema("my_schema");
export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
});
```

Generates the same SQL as MySQL variant.