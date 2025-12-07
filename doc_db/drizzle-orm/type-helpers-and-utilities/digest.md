## Type API
Retrieve types from table schemas for select and insert queries using type helpers:
```ts
import { serial, text, pgTable } from 'drizzle-orm/pg-core';
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

type SelectUser = typeof users.$inferSelect;
type InsertUser = typeof users.$inferInsert;
// or
type SelectUser = InferSelectModel<typeof users>;
type InsertUser = InferInsertModel<typeof users>;
```
Works identically for MySQL, SQLite, and SingleStore with their respective table creators.

## Logging
Enable default query logging by passing `{ logger: true }` to drizzle initialization:
```ts
const db = drizzle({ logger: true });
```

Custom log destination with DefaultLogger:
```ts
import { DefaultLogger, LogWriter } from 'drizzle-orm/logger';

class MyLogWriter implements LogWriter {
  write(message: string) { /* Write to file, stdout, etc. */ }
}

const logger = new DefaultLogger({ writer: new MyLogWriter() });
const db = drizzle({ logger });
```

Custom logger implementation:
```ts
import { Logger } from 'drizzle-orm/logger';

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log({ query, params });
  }
}

const db = drizzle({ logger: new MyLogger() });
```

## Multi-project Schema
Use table creator API to customize table names for keeping multiple project schemas in one database:
```ts
import { serial, text, pgTableCreator } from 'drizzle-orm/pg-core';

const pgTable = pgTableCreator((name) => `project1_${name}`);

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
```
Works for MySQL, SQLite, and SingleStore with their respective creators.

In drizzle.config.ts, filter tables by prefix:
```ts
export default defineConfig({
  schema: "./src/schema/*",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: { url: process.env.DATABASE_URL },
  tablesFilter: ["project1_*", "project2_*"],
});
```

## Printing SQL Queries
Convert queries to SQL using `.toSQL()`:
```ts
const query = db
  .select({ id: users.id, name: users.name })
  .from(users)
  .groupBy(users.id)
  .toSQL();
// Returns: { sql: 'select "id", "name" from "users" group by "users"."id"', params: [] }
```

## Raw SQL Queries
Execute complex parametrized queries with `db.execute()`:
```ts
// PostgreSQL
const statement = sql`select * from ${users} where ${users.id} = ${userId}`;
const res = await db.execute(statement);

// MySQL
import { MySqlQueryResult } from "drizzle-orm/mysql2";
const res: MySqlRawQueryResult = await db.execute(statement);

// SQLite
const res = db.all(statement);  // unknown[]
const res = db.get(statement);  // unknown
const res = db.values(statement);  // unknown[][]
const res = db.run(statement);  // Database.RunResult

// SingleStore
import { SingleStoreQueryResult } from "drizzle-orm/singlestore";
const res: SingleStoreRawQueryResult = await db.execute(statement);
```

## Standalone Query Builder
Build queries without a database instance to generate SQL:
```ts
import { QueryBuilder } from 'drizzle-orm/pg-core';

const qb = new QueryBuilder();
const query = qb.select().from(users).where(eq(users.name, 'Dan'));
const { sql, params } = query.toSQL();
```
Works for MySQL, SQLite, and SingleStore with their respective QueryBuilder imports.

## Get Typed Table Columns
Retrieve a typed columns map to omit specific columns:
```ts
import { getTableColumns } from "drizzle-orm";
import { user } from "./schema";

const { password, role, ...rest } = getTableColumns(user);
await db.select({ ...rest }).from(users);
```

## Get Table Information
Extract table metadata using `getTableConfig()`:
```ts
import { getTableConfig, pgTable } from 'drizzle-orm/pg-core';

const table = pgTable(...);
const { columns, indexes, foreignKeys, checks, primaryKeys, name, schema } = getTableConfig(table);
```
Works for MySQL, SQLite, and SingleStore with their respective imports.

## Compare Object Types
Use `is()` function instead of `instanceof` to check Drizzle types:
```ts
import { Column, is } from 'drizzle-orm';

if (is(value, Column)) {
  // value's type is narrowed to Column
}
```

## Mock Driver
Create a mock database instance for testing without a real database connection:
```ts
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle.mock();

// Optionally provide schema for types
import * as schema from "./schema"
const db = drizzle.mock({ schema });
```