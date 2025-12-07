## Overview
The `sql` template is a type-safe, parameterized way to write raw SQL queries and fragments within Drizzle. It prevents SQL injection by automatically escaping table/column names and converting dynamic values to parameterized placeholders.

## Basic Usage
```typescript
import { sql } from 'drizzle-orm'
const id = 69;
await db.execute(sql`select * from ${usersTable} where ${usersTable.id} = ${id}`)
// Generates: select * from "users" where "users"."id" = $1; --> [69]
```

## Type Definition: `sql<T>`
Define custom return types for sql expressions (compile-time only, no runtime mapping):
```typescript
const response: { lowerName: string }[] = await db.select({
    lowerName: sql<string>`lower(${usersTable.name})`
}).from(usersTable);
```

## Runtime Mapping: `.mapWith()`
Map database driver values at runtime using column mapping or custom `DriverValueDecoder`:
```typescript
sql`...`.mapWith(usersTable.name);
// or
sql``.mapWith({ mapFromDriverValue: (value: any) => { /* mapping */ } });
sql``.mapWith(Number);
```

## Aliasing: `.as<T>()`
Explicitly name custom fields:
```typescript
sql`lower(usersTable.name)`.as('lower_name')
// Generates: ... "usersTable"."name" as lower_name ...
```

## Raw SQL: `sql.raw()`
Include unparameterized, unescaped SQL:
```typescript
sql.raw(`select * from users where id = ${12}`);
// Generates: select * from users where id = 12;

// Within sql template:
sql`select * from ${usersTable} where id = ${sql.raw(12)}`;
// Generates: select * from "users" where id = 12;
```

## Combining Chunks: `sql.fromList()`, `sql.join()`, `sql.append()`
Aggregate multiple SQL chunks:
```typescript
const sqlChunks: SQL[] = [sql`select * from users`];
sqlChunks.push(sql` where `);
for (let i = 0; i < 5; i++) {
    sqlChunks.push(sql`id = ${i}`);
    if (i < 4) sqlChunks.push(sql` or `);
}
const finalSql = sql.fromList(sqlChunks);
// or
const finalSql = sql.join(sqlChunks, sql.raw(' '));
// or
const finalSql = sql`select * from users`;
finalSql.append(sql` where id = 1`);
// All generate: select * from users where id = $1 or id = $2 or id = $3 or id = $4 or id = $5; --> [0, 1, 2, 3, 4]
```

## Empty SQL: `sql.empty()`
Start with blank SQL and build incrementally:
```typescript
const finalSql = sql.empty();
finalSql.append(sql`select * from users`);
finalSql.append(sql` where id = ${1}`);
```

## Converting to String and Parameters
Use dialect-specific implementations to get query string and params:
```typescript
import { PgDialect } from 'drizzle-orm/pg-core';
const pgDialect = new PgDialect();
pgDialect.sqlToQuery(sql`select * from ${usersTable} where ${usersTable.id} = ${12}`);
// PostgreSQL: select * from "users" where "users"."id" = $1; --> [12]

// MySQL: select * from `users` where `users`.`id` = ?; --> [12]
// SQLite: select * from "users" where "users"."id" = ?; --> [12]
```

## Usage in Query Clauses
Use `sql` in SELECT, WHERE, ORDER BY, GROUP BY, and HAVING clauses:

**SELECT:**
```typescript
await db.select({
    id: usersTable.id,
    lowerName: sql<string>`lower(${usersTable.name})`,
    aliasedName: sql<string>`lower(${usersTable.name})`.as('aliased_column'),
    count: sql<number>`count(*)`.mapWith(Number)
}).from(usersTable)
// Generates: select `id`, lower(`name`), lower(`name`) as `aliased_column`, count(*) from `users`;
```

**WHERE:**
```typescript
const id = 77;
await db.select().from(usersTable).where(sql`${usersTable.id} = ${id}`);
// Generates: select * from "users" where "users"."id" = $1; --> [77]

// Advanced fulltext search:
const searchParam = "Ale";
await db.select().from(usersTable)
    .where(sql`to_tsvector('simple', ${usersTable.name}) @@ to_tsquery('simple', ${searchParam})`);
// Generates: select * from "users" where to_tsvector('simple', "users"."name") @@ to_tsquery('simple', '$1'); --> ["Ale"]
```

**ORDER BY:**
```typescript
await db.select().from(usersTable).orderBy(sql`${usersTable.id} desc nulls first`);
// Generates: select * from "users" order by "users"."id" desc nulls first;
```

**GROUP BY and HAVING:**
```typescript
await db.select({
    projectId: usersTable.projectId,
    count: sql<number>`count(${usersTable.id})`.mapWith(Number)
}).from(usersTable)
    .groupBy(sql`${usersTable.projectId}`)
    .having(sql`count(${usersTable.id}) > 300`);
// Generates: select "project_id", count("users"."id") from users group by "users"."project_id" having count("users"."id") > 300;
```