

## Pages

### v0.23.2_release
v0.23.2 bug fixes: PostgreSQL schemaFilter enum detection, drizzle-kit up command restoration

## Bug Fixes

**PostgreSQL schemaFilter bug**: Fixed an issue where the `schemaFilter` object in push and introspect commands was incorrectly detecting enums in schemas that were not defined in the filter.

**drizzle-kit up command**: Fixed the `drizzle-kit up` command to work correctly starting from the sequences release.

### v0.11.0_release
TypeScript ORM with in-code typed SQL schema; supports PostgreSQL; features typed queries, joins, filters, and automatic migration generation.

## Overview
Open source TypeScript ORM with fully typed SQL schema in-code. Supports PostgreSQL with MySQL and SQLite coming soon.

## Schema Definition
Define tables as classes extending `PgTable` with typed columns:
```ts
export const popularityEnum = createEnum({ alias: 'popularity', values: ['unknown', 'known', 'popular'] });

export class CountriesTable extends PgTable<CountriesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  nameIndex = this.uniqueIndex(this.name)
  public tableName(): string { return 'countries'; }
}

export class CitiesTable extends PgTable<CitiesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  countryId = this.int("country_id").foreignKey(CountriesTable, (country) => country.id)
  popularity = this.type(popularityEnum, "popularity")
  public tableName(): string { return 'cities'; }
}
```

## Connection & Basic Queries
```ts
import { drizzle } from 'drizzle-orm'

export class UsersTable extends PgTable<UsersTable> {
  public id = this.serial('id').primaryKey();
  public fullName = this.text('full_name');
  public phone = this.varchar('phone', { size: 256 });
  public tableName(): string { return 'users'; }
}
export type User = InferType<UsersTable>

const db = await drizzle.connect("postgres://user:password@host:port/db");
const usersTable = new UsersTable(db);
const users: User[] = await usersTable.select().execute();
```

## Filtering & Selection
```ts
// WHERE with filters
await table.select().where(eq(table.id, 42)).execute();
await table.select().where(and([eq(table.id, 42), eq(table.name, "Dan")])).execute();
await table.select().where(or([eq(table.id, 42), eq(table.id, 1)])).execute();

// Partial select
const result = await table.select({
  mapped1: table.id,
  mapped2: table.name,
}).execute();

// Pagination & ordering
await table.select().limit(10).offset(10).execute()
await table.select().orderBy((table) => table.name, Order.ASC).execute()
await table.select().orderBy((table) => table.name, Order.DESC).execute()
```

## Insert, Update, Delete
```ts
await usersTable.insert({ name: "Andrew", createdAt: new Date() }).execute();
await usersTable.insertMany([
  { name: "Andrew", createdAt: new Date() },
  { name: "Dan", createdAt: new Date() }
]).execute();
await usersTable.update().where(eq(usersTable.name, 'Dan')).set({ name: 'Mr. Dan' }).execute();
await usersTable.delete().where(eq(usersTable.name, 'Dan')).execute();
```

## Joins
Fully typed joins prevent mistakes at compile time:
```ts
const result = await citiesTable.select()
  .leftJoin(usersTable, (cities, users) => eq(cities.userId, users.id))
  .where((cities, users) => eq(cities.id, 1))
  .execute();
const citiesWithUsers: { city: City, user: User }[] = result.map((city, user) => ({ city, user }));
```

## Many-to-Many Relationships
```ts
export class UsersTable extends PgTable<UsersTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name");
}
export class ChatGroupsTable extends PgTable<ChatGroupsTable> {
  id = this.serial("id").primaryKey();
}
export class ManyToManyTable extends PgTable<ManyToManyTable> {
  userId = this.int('user_id').foreignKey(UsersTable, (table) => table.id, { onDelete: 'CASCADE' });
  groupId = this.int('group_id').foreignKey(ChatGroupsTable, (table) => table.id, { onDelete: 'CASCADE' });
}

const usersWithUserGroups = await manyToManyTable.select()
  .leftJoin(usersTable, (manyToMany, users) => eq(manyToManyTable.userId, users.id))
  .leftJoin(chatGroupsTable, (manyToMany, _users, chatGroups) => eq(manyToManyTable.groupId, chatGroups.id))
  .where((manyToMany, _users, userGroups) => eq(userGroups.id, 1))
  .execute();
```

## Migrations
CLI tool generates migrations automatically from TypeScript schema, handling renames and deletes with prompts.

Schema:
```ts
export class UsersTable extends PgTable<UsersTable> {
  public id = this.serial("id").primaryKey();
  public fullName = this.varchar("full_name", { size: 256 });
  public fullNameIndex = this.index(this.fullName);
  public tableName(): string { return "users"; }
}
export class AuthOtpTable extends PgTable<AuthOtpTable> {
  public id = this.serial("id").primaryKey();
  public phone = this.varchar("phone", { size: 256 });
  public userId = this.int("user_id").foreignKey(UsersTable, (t) => t.id);
  public tableName(): string { return "auth_otp"; }
}
```

Generated SQL:
```sql
CREATE TABLE IF NOT EXISTS auth_otp (
    "id" SERIAL PRIMARY KEY,
    "phone" character varying(256),
    "user_id" INT
);
CREATE TABLE IF NOT EXISTS users (
    "id" SERIAL PRIMARY KEY,
    "full_name" character varying(256)
);
DO $$ BEGIN
 ALTER TABLE auth_otp ADD CONSTRAINT auth_otp_user_id_fkey FOREIGN KEY ("user_id") REFERENCES users(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE INDEX IF NOT EXISTS users_full_name_index ON users (full_name);
```

### v0.16.2_release_notes
PostgreSQL/MySQL schema support, database introspection, postgres.js driver, custom type operators

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

### v0.27.2_-_unique_constraints_support
Added UNIQUE constraint support for PostgreSQL (with NULLS NOT DISTINCT option), MySQL, and SQLite via column-level `.unique()` or table-level `unique().on()` methods with optional custom names.

## UNIQUE Constraints Support Added

Support for `UNIQUE` constraints across PostgreSQL, MySQL, and SQLite databases.

### PostgreSQL
Single-column constraints defined at column level with optional custom name:
```ts
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: char('state', { length: 2 }).unique('custom'),
  field: char('field', { length: 2 }).unique('custom_field', { nulls: 'not distinct' }),
});
```

Multi-column constraints defined in table config with `nullsNotDistinct()` option:
```ts
const table = pgTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: char('state', { length: 2 }),
}, (t) => ({
  first: unique('custom_name').on(t.name, t.state).nullsNotDistinct(),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

PostgreSQL supports `NULLS NOT DISTINCT` option to restrict multiple NULL values.

### MySQL
Same syntax as PostgreSQL but without `NULLS NOT DISTINCT` support:
```ts
const table = mysqlTable('table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

const table = mysqlTable('cities1', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom_name1').on(t.name, t.state),
}));
```

### SQLite
Unique constraints implemented as unique indexes. Supports optional naming:
```ts
const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull().unique(),
  state: text('state').unique('custom'),
});

const table = sqliteTable('table', {
  id: int('id').primaryKey(),
  name: text('name').notNull(),
  state: text('state'),
}, (t) => ({
  first: unique().on(t.name, t.state),
  second: unique('custom').on(t.name, t.state),
}));
```

### v0.28.0_release_notes
v0.28.0: Removed nested relation filtering, added mysql2 mode config, 430% IntelliSense speedup, rewrote relational queries with lateral joins for better performance, added insert with all defaults.

## Breaking Changes

### Removed support for filtering by nested relations
The `table` object in the `where` callback no longer includes fields from `with` and `extras`. This change improves relational query efficiency.

```ts
// This no longer works:
const usersWithPosts = await db.query.users.findMany({
  where: (table, { sql }) => (sql`json_array_length(${table.posts}) > 0`),
  with: { posts: true },
});
```

Workarounds: apply filters manually after fetching, or use the core API.

### Added Relational Queries `mode` config for `mysql2` driver
Relational queries use lateral joins which PlanetScale doesn't support. Specify the mode when creating the connection:

```ts
const db = drizzle({ client, schema, mode: 'planetscale' });
// or
const db = drizzle({ client, schema, mode: 'default' }); // for regular MySQL
```

## Performance Improvements

### IntelliSense performance for large schemas
Optimized internal types resulting in **430% speed up** for IntelliSense on schemas with 85 tables, 666 columns, 26 enums, 172 indexes, and 133 foreign keys.

### Relational Queries Performance and Read Usage
Completely rewrote query generation strategy:
1. **Lateral Joins**: Uses "LEFT JOIN LATERAL" for efficient data retrieval; MySQL PlanetScale and SQLite use simple subquery selects
2. **Selective Data Retrieval**: Only fetches necessary columns, reducing dataset size
3. **Reduced Aggregations**: Uses `json_build_array` directly within lateral joins instead of multiple aggregation functions
4. **Simplified Grouping**: Removed GROUP BY clause as lateral joins handle aggregation more efficiently

Example query transformation:

```ts
const items = await db.query.comments.findMany({
  limit,
  orderBy: comments.id,
  with: {
    user: { columns: { name: true } },
    post: {
      columns: { title: true },
      with: { user: { columns: { name: true } } },
    },
  },
});
```

**New query** (with lateral joins):
```sql
select "comments"."id", "comments"."user_id", "comments"."post_id", "comments"."content",
       "comments_user"."data" as "user", "comments_post"."data" as "post"
from "comments"
left join lateral (select json_build_array("comments_user"."name") as "data"
                   from (select * from "users" "comments_user"
                         where "comments_user"."id" = "comments"."user_id" limit 1) "comments_user") "comments_user" on true
left join lateral (select json_build_array("comments_post"."title", "comments_post_user"."data") as "data"
                   from (select * from "posts" "comments_post"
                         where "comments_post"."id" = "comments"."post_id" limit 1) "comments_post"
                   left join lateral (select json_build_array("comments_post_user"."name") as "data"
                                      from (select * from "users" "comments_post_user"
                                            where "comments_post_user"."id" = "comments_post"."user_id" limit 1) "comments_post_user") "comments_post_user" on true) "comments_post" on true
order by "comments"."id" limit 1
```

**Old query** (with GROUP BY and aggregations) - significantly more complex with multiple CASE statements and json_agg calls.

## New Features

### Insert rows with default values for all columns
Provide empty objects to insert rows with all default values:

```ts
await db.insert(usersTable).values({});        // Insert 1 row with all defaults
await db.insert(usersTable).values([{}, {}]);  // Insert 2 rows with all defaults
```

### v0.28.1_release
v0.28.1 patch fixes Postgres array bugs from v0.28.0

## v0.28.1 Release

**Release Date:** August 7, 2023

### Fixes

Fixed Postgres array-related issues that were introduced in version 0.28.0. This patch addresses problems reported in issues #983 and #992.

### v0.28.2_release_notes
v0.28.2: fixes for MySQL timestamp milliseconds, SQLite .get() typing, SQLite proxy double-execution; adds Typebox support

## v0.28.2 Release

### Community Contributions
This release includes contributions from the community.

### Internal Changes
- Added comprehensive test suite for d1
- Fixed documentation issues

### Bug Fixes
- **MySQL timestamp milliseconds**: Fixed truncation issue where milliseconds were being lost in timestamp values
- **SQLite `.get()` method**: Corrected type signature for sqlite-based dialects (issue #565)
- **SQLite proxy**: Fixed bug causing queries to execute twice

### New Features
- **Typebox support**: Added official support for Typebox package integration via new `drizzle-typebox` package
  - Enables type-safe schema validation using Typebox
  - See `/docs/typebox` for usage examples and documentation

### v0.28.3_release_notes
v0.28.3: SQLite query API, column runtime defaults via .$defaultFn(), table type inference via .$inferSelect/$inferInsert, fixed sqlite-proxy/SQL.js .get() empty results

## Fixes
- Fixed sqlite-proxy and SQL.js `.get()` response when result is empty

## New Features

### SQLite Simplified Query API
Added simplified query API for SQLite.

### Column Builder Methods: `.$defaultFn()` / `.$default()`
Define runtime default values for columns with custom logic. Available for PostgreSQL, MySQL, and SQLite.

```ts
import { varchar, mysqlTable } from "drizzle-orm/mysql-core";
import { createId } from '@paralleldrive/cuid2';

const table = mysqlTable('table', {
  id: varchar('id', { length: 128 }).$defaultFn(() => createId()),
});
```

Note: Runtime defaults only affect drizzle-orm behavior, not drizzle-kit.

### Table Model Type Inference: `$inferSelect` / `$inferInsert`
Convenient methods for inferring table types. Replaces deprecated `InferModel`.

```ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm'

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
  jsonb: jsonb('jsonb').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// New approach
type SelectUser = typeof usersTable.$inferSelect;
type InsertUser = typeof usersTable.$inferInsert;

// Legacy approach (deprecated)
type SelectUser2 = InferSelectModel<typeof usersTable>;
type InsertUser2 = InferInsertModel<typeof usersTable>;
```

### Other Changes
- Deprecated `InferModel` type in favor of `InferSelectModel` and `InferInsertModel`
- Disabled `.d.ts` files bundling

### v0.28.4_release
v0.28.4 fixes ESM imports and Postgres table type errors; v0.28.5 fixes missing @opentelemetry/api package.

## v0.28.4 Release (2023-08-24)

### Fixes
- Fixed imports in ESM-based projects (issue #1088)
- Fixed type error on Postgres table definitions (issue #1089)

### Note
If you encounter a `Cannot find package '@opentelemetry/api'` error, update to v0.28.5 where this is resolved.

### v0.28.5_release_notes
v0.28.5 fixes OpenTelemetry type import syntax error causing runtime failures; OpenTelemetry feature is disabled.

## v0.28.5 Release

**Fix:** Corrected incorrect OpenTelemetry type import that caused a runtime error.

**Details:** The issue was caused by using `import { type ... }` syntax instead of `import type { ... }` on the tracing.ts file, which caused the `import '@opentelemetry/api'` line to leak into runtime code.

**Context:** OpenTelemetry integration in drizzle-orm is currently disabled and does nothing. It was an experimental feature designed to allow users to collect query statistics and send them to their own telemetry consumers. The ORM itself never collects or sends any stats. OpenTelemetry is simply a protocol that the library provides hooks for, but the feature is not active in current versions.

### v0.28.6_release_notes
v0.28.6: LibSQL batch API, SQLite JSON text mode, Relational Query .toSQL(), PostgreSQL array operators (arrayContains/arrayContained/arrayOverlaps), Relational Query where operators from callback, MySQL datetime UTC fix.

## Changes
MySQL `datetime` with `mode: 'date'` now stores and retrieves dates in UTC strings. Use `mode: 'string'` or custom types for different behavior.

## New Features

**LibSQL batch API support**
Execute multiple queries in a single batch call:
```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
]);
// Returns: [{ id: number }[], ResultSet, User[], User[]]
```
Supported builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

**JSON mode for SQLite text columns**
```ts
const test = sqliteTable('test', {
  dataTyped: text('data_typed', { mode: 'json' }).$type<{ a: 1 }>().notNull(),
});
```

**`.toSQL()` on Relational Query API**
```ts
const query = db.query.usersTable.findFirst().toSQL();
```

**PostgreSQL array operators**
```ts
const contains = await db.select({ id: posts.id }).from(posts)
  .where(arrayContains(posts.tags, ['Typescript', 'ORM']));
const contained = await db.select({ id: posts.id }).from(posts)
  .where(arrayContained(posts.tags, ['Typescript', 'ORM']));
const overlaps = await db.select({ id: posts.id }).from(posts)
  .where(arrayOverlaps(posts.tags, ['Typescript', 'ORM']));
const withSubQuery = await db.select({ id: posts.id }).from(posts)
  .where(arrayContains(posts.tags, db.select({ tags: posts.tags }).from(posts).where(eq(posts.id, 1))));
```

**More SQL operators in Relational Query where filters**
```ts
// Before: import { inArray } from "drizzle-orm/pg-core"; await db.users.findFirst({ where: (table, _) => inArray(table.id, [...]) })
// After: await db.users.findFirst({ where: (table, { inArray }) => inArray(table.id, [...]) })
```

## Fixes
- Correct where in on conflict in SQLite
- Fix libsql/client type import
- Fix raw SQL query mapping on RDS
- Fix datetime mapping for MySQL
- Fix smallserial generating as serial

### v0.29.0_release_notes
v0.29.0 adds MySQL unsigned bigint, dynamic query building with .$dynamic(), custom constraint names, read replicas with withReplicas(), set operators (UNION/INTERSECT/EXCEPT), MySQL/PostgreSQL proxy drivers, D1 Batch API, and requires Kit 0.20.0

## MySQL unsigned bigint
```ts
const table = mysqlTable('table', {
  id: bigint('id', { mode: 'number', unsigned: true }),
});
```

## Improved query builder types
By default, query builder methods can only be invoked once (e.g., `.where()` once per query) to match SQL semantics. Use `.$dynamic()` to enable multiple invocations for dynamic query building:

```ts
function withPagination<T extends PgSelect>(qb: T, page: number, pageSize: number = 10) {
  return qb.limit(pageSize).offset(page * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
withPagination(query, 1); // ✅ OK

function withFriends<T extends PgSelect>(qb: T) {
  return qb.leftJoin(friends, eq(friends.userId, users.id));
}
query = withFriends(query);
```

## Custom names for primary and foreign keys
```ts
const table = pgTable('table', {
  id: integer('id'),
  name: text('name'),
}, (table) => ({
  cpk: primaryKey({ name: 'composite_key', columns: [table.id, table.name] }),
  cfk: foreignKey({
    name: 'fkName',
    columns: [table.id],
    foreignColumns: [table.name],
  }),
}));
```

## Read replicas support
```ts
const primaryDb = drizzle({ client });
const read1 = drizzle({ client });
const read2 = drizzle({ client });
const db = withReplicas(primaryDb, [read1, read2]);

db.$primary.select().from(usersTable); // read from primary
db.select().from(usersTable); // read from replica
db.delete(usersTable).where(eq(usersTable.id, 1)); // write to primary
```

Custom replica selection with weighted probability:
```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
  const weight = [0.7, 0.3];
  let cumulativeProbability = 0;
  const rand = Math.random();
  for (const [i, replica] of replicas.entries()) {
    cumulativeProbability += weight[i]!;
    if (rand < cumulativeProbability) return replica;
  }
  return replicas[0]!
});
```

## Set operators (UNION, UNION ALL, INTERSECT, INTERSECT ALL, EXCEPT, EXCEPT ALL)
```ts
// Import approach
import { union } from 'drizzle-orm/pg-core'
const result = await union(
  db.select().from(users),
  db.select().from(customers)
);

// Builder approach
const result = await db.select().from(users).union(db.select().from(customers));
```

## MySQL proxy driver
Implement HTTP endpoints for queries and migrations. Driver example:
```ts
import { drizzle } from 'drizzle-orm/mysql-proxy';
import { migrate } from 'drizzle-orm/mysql-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, { sql, params, method });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/migrate`, { queries });
}, { migrationsFolder: 'drizzle' });

await db.insert(cities).values({ id: 1, name: 'name' });
```

## PostgreSQL proxy driver
Same as MySQL proxy driver:
```ts
import { drizzle } from 'drizzle-orm/pg-proxy';
import { migrate } from 'drizzle-orm/pg-proxy/migrator';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post(`${process.env.REMOTE_DRIVER}/query`, { sql, params, method });
  return { rows: rows.data };
});

await migrate(db, async (queries) => {
  await axios.post(`${process.env.REMOTE_DRIVER}/query`, { queries });
}, { migrationsFolder: 'drizzle' });
```

## D1 Batch API support
```ts
const batchResponse = await db.batch([
  db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
  db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
  db.query.usersTable.findMany({}),
  db.select().from(usersTable).where(eq(usersTable.id, 1)),
  db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
]);

type BatchResponse = [
  { id: number }[],
  D1Result,
  { id: number; name: string; verified: number; invitedBy: number | null }[],
  { id: number; name: string; verified: number; invitedBy: number | null }[],
  { id: number; invitedBy: number | null }[],
];
```

Supported builders: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()...`, `db.update()...`, `db.delete()...`, `db.insert()...`

## Drizzle Kit 0.20.0
- `defineConfig` function for config definition
- Cloudflare D1 access in Drizzle Studio via wrangler.toml
- Drizzle Studio migrated to https://local.drizzle.studio/
- `bigint unsigned` support
- Custom names for `primaryKeys` and `foreignKeys`
- Automatic environment variable fetching
- Bug fixes and improvements

**Note:** v0.29.0 requires minimum Drizzle Kit v0.20.0 and vice versa.

### v0.29.1_release_notes
v0.29.1: Fixed withReplica args and selectDistinctOn; added aggregate helpers (count, sum, avg, max, min with Distinct variants); introduced ESLint plugin with enforce-delete-with-where and enforce-update-with-where rules.

## Fixes

- **withReplica**: Fixed argument forwarding when using the withReplica feature
- **selectDistinctOn**: Fixed issue where selectDistinctOn was not working with multiple columns

## New Features

### Detailed JSDoc for Query Builders
JSDoc documentation is now available for all query builders across all dialects, providing hints and documentation links directly in IDEs.

### Aggregate Function Helpers
New SQL helper functions for aggregation operations (typically used with GROUP BY):

```ts
// count
await db.select({ value: count() }).from(users);
await db.select({ value: count(users.id) }).from(users);

// countDistinct
await db.select({ value: countDistinct(users.id) }).from(users);

// avg / avgDistinct
await db.select({ value: avg(users.id) }).from(users);
await db.select({ value: avgDistinct(users.id) }).from(users);

// sum / sumDistinct
await db.select({ value: sum(users.id) }).from(users);
await db.select({ value: sumDistinct(users.id) }).from(users);

// max / min
await db.select({ value: max(users.id) }).from(users);
await db.select({ value: min(users.id) }).from(users);
```

These are equivalent to using `sql` template with `.mapWith()` for type mapping.

### ESLint Drizzle Plugin
New package `eslint-plugin-drizzle` for enforcing best practices where type checking is insufficient.

**Installation**:
```
npm install eslint eslint-plugin-drizzle
npm install @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Configuration** (`.eslintrc.yml`):
```yaml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

Or use the `all`/`recommended` config:
```yaml
extends:
  - "plugin:drizzle/all"
```

**Rules**:

1. **enforce-delete-with-where**: Requires `.where()` clause in `.delete()` statements to prevent accidental deletion of all rows. Optionally configure `drizzleObjectName` to target specific objects:
```json
"drizzle/enforce-delete-with-where": ["error", { "drizzleObjectName": ["db"] }]
```

2. **enforce-update-with-where**: Requires `.where()` clause in `.update()` statements to prevent accidental updates of all rows. Same `drizzleObjectName` option available.

### v0.29.2_release_notes
v0.29.2: Bug fixes (PgArray escaping, SQLite exists, AWS dates, Hermes), ESLint plugin v0.2.3 improvements, new Expo SQLite driver with migration support via babel/metro config and useMigrations hook.

## Bug Fixes
- Improved planescale relational tests
- Fixed string escaping for empty PgArrays
- Fixed incorrect syntax for SQLite exists function
- Fixed date handling in AWS Data API
- Fixed Hermes mixins constructor issue

## ESLint Plugin v0.2.3
- Added support for Drizzle objects retrieved from functions
- Improved error message context in suggestions

## New: Expo SQLite Driver

Install packages:
```bash
npm install drizzle-orm expo-sqlite@next
```

Basic usage:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

await db.select().from(...);
// or
db.select().from(...).then(...);
// or
db.select().from(...).all();
```

For migrations support, configure Babel and Metro:

**babel.config.js:**
```ts
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

**metro.config.js:**
```ts
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

**drizzle.config.ts:**
```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
```

Generate migrations:
```bash
npx drizzle-kit generate
```

Use migrations in **App.tsx:**
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <View><Text>Migration error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Migration is in progress...</Text></View>;
  }

  return ...your application component;
}
```

### v0.29.3_release
v0.29.3 made Expo peer dependencies optional, fixing dependency conflicts for non-Expo users.

## v0.29.3 Release

**Fix:** Expo peer dependencies are now optional.

This release addresses an issue where Expo peer dependencies were required, which could cause problems for users not using Expo. The fix makes these dependencies optional, allowing developers to use DrizzleORM with Expo SQLite without unnecessary dependency constraints.

Related: Expo documentation and Expo SQLite integration guide.

### v0.29.4_release_notes
v0.29.4 adds Neon HTTP batch queries and deprecates PlanetScale's connect() in favor of Client instances (breaking in v0.30.0).

## Neon HTTP Batch Support

Added support for batching multiple queries in a single request using Neon's HTTP driver:

```ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { usersTable } from './schema';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
const db = drizzle(sql);

const batchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.insert(usersTable).values({ id: 2, name: 'Dan' }),
	db.query.usersTable.findMany({}),
	db.query.usersTable.findFirst({}),
]);
```

The batch method returns a tuple with typed results for each query in the batch.

## PlanetScale Client Instance Update

Updated PlanetScale integration to use `Client` instance instead of `connect()` function:

```ts
import { Client } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';

const client = new Client({
	host: process.env['DATABASE_HOST'],
	username: process.env['DATABASE_USERNAME'],
	password: process.env['DATABASE_PASSWORD'],
});

const db = drizzle(client);
```

**Breaking change warning**: Version 0.30.0 will require `Client` instances and reject `connect()` results. A deprecation warning is shown in v0.29.4 when using `connect()`. Migrate now to avoid runtime errors.

### v0.29.5_release_notes
v0.29.5: WITH clauses for INSERT/UPDATE/DELETE, custom migrations table/schema, SQLite proxy batch and relational query support.

## WITH Statements for INSERT, UPDATE, DELETE

You can now use `WITH` (CTE) clauses with INSERT, UPDATE, and DELETE statements.

Example with DELETE:
```ts
const averageAmount = db.$with('average_amount').as(
	db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders),
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({ id: orders.id });
```

Generates:
```sql
with "average_amount" as (select avg("amount") as "value" from "orders") 
delete from "orders" 
where "orders"."amount" > (select * from "average_amount") 
returning "id";
```

## Custom Migrations Table and Schema

**Custom migrations table name** (all databases):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsTable: 'my_migrations',
});
```

By default migrations are stored in `__drizzle_migrations` table (in `drizzle` schema for PostgreSQL).

**Custom migrations schema** (PostgreSQL only):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsSchema: 'custom',
});
```

## SQLite Proxy Batch and Relational Queries

SQLite proxy driver now supports:
- Relational queries: `.query.findFirst()` and `.query.findMany()`
- Batch requests via `db.batch([])`

Batch callback setup:
```ts
import { drizzle } from 'drizzle-orm/sqlite-proxy';

type ResponseType = { rows: any[][] | any[] }[];

const db = drizzle(
	async (sql, params, method) => {
		// single query logic
	},
	async (queries: { sql: string; params: any[]; method: 'all' | 'run' | 'get' | 'values' }[]) => {
		const result: ResponseType = await axios.post('http://localhost:3000/batch', { queries });
		return result;
	},
);
```

Response must be an array of raw values in the same order as sent queries.

### v0.30.0_release_notes
v0.30.0 changes postgres.js to return date strings with Drizzle mode-based mapping; fixes 8 timestamp/date-related bugs including timezone and type inconsistencies.

## Breaking Changes: Postgres Timestamp Handling

The `postgres.js` driver instance has been modified to always return strings for dates. Drizzle then maps these to either strings or Date objects based on the selected `mode`. This is a breaking change that affects how timestamps are handled.

**Key Impact:**
- Timestamps with and without timezone now always use `.toISOString()` for mapping to the driver
- All `postgres.js` clients passed to Drizzle will have mutated behavior - dates will always be strings in responses
- If you were expecting specific timestamp responses, behavior has changed

**Parser Override for postgres.js:**
```ts
const transparentParser = (val: any) => val;

// Override postgres.js default date parsers
for (const type of ['1184', '1082', '1083', '1114']) {
	client.options.parsers[type as any] = transparentParser;
	client.options.serializers[type as any] = transparentParser;
}
```

The team notes this is not ideal since the driver client gets mutated. They're working with the `postgres.js` library creator to enable per-query mapping interceptors instead.

## Fixes

Multiple timestamp and date-related issues resolved:
- Timestamp with mode string returning Date object instead of string
- Inconsistent date/datetime handling across drivers
- Type mismatches (columns showing string type but returning Date objects)
- PostgreSQL timezone-related conversion issues
- Millisecond loss during timestamp inserts
- Invalid dates from relational queries

### v0.30.1_release_notes
v0.30.1: Added OP-SQLite driver support; fixed Expo driver migration hook

## OP-SQLite Driver Support

New driver added for OP-SQLite. Initialize with:

```ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);
await db.select().from(users);
```

## Fixes

- Migration hook fixed for Expo driver

### v0.30.10_release
v0.30.10: Added `.if()` for conditional WHERE clauses; fixed AWS DataAPI session method mappings

## New Features

### `.if()` function for WHERE expressions

Conditional WHERE clauses using `.if()` method:

```ts
await db
  .select()
  .from(posts)
  .where(gt(posts.views, views).if(views > 100));
```

The `.if()` function is available on all WHERE expressions and allows conditional filtering based on runtime values.

## Bug Fixes

- Fixed internal mappings for sessions `.all()`, `.values()`, `.execute()` functions in AWS DataAPI

### v0.30.2_release_notes
v0.30.2: LibSQL migrations use batch execution; bun:sqlite findFirst fix

## Improvements

LibSQL migrations now use batch execution instead of transactions. Batch operations execute multiple SQL statements sequentially within an implicit transaction - the backend commits all changes on success or rolls back completely on any failure.

## Fixes

- Fixed findFirst query for bun:sqlite

### v0.30.3_release_notes
v0.30.3: raw query batch support for Neon HTTP, fixed @neondatabase/serverless types, fixed sqlite-proxy .run() result

## New Features

- Added raw query support (`db.execute(...)`) to batch API in Neon HTTP driver

## Fixes

- Fixed `@neondatabase/serverless` HTTP driver types issue
- Fixed sqlite-proxy driver `.run()` result

### xata-http-driver-support
Drizzle ORM v0.30.4 adds native xata-http driver support for Xata Postgres platform; also supports pg/postgres.js drivers

## Xata HTTP Driver Support

Xata is a Postgres data platform focused on reliability, scalability, and developer experience. Drizzle ORM v0.30.4 adds native support for the Xata driver via the `drizzle-orm/xata` package. The Xata Postgres service is currently in beta.

### Installation

```
npm install drizzle-orm @xata.io/client
npm install -D drizzle-kit
```

### Usage with Xata Client

Use the Xata generated client obtained by running `xata init` CLI command:

```ts
import { drizzle } from 'drizzle-orm/xata-http';
import { getXataClient } from './xata';

const xata = getXataClient();
const db = drizzle(xata);
const result = await db.select().from(...);
```

### Alternative Drivers

You can also connect to Xata using standard `pg` or `postgres.js` drivers instead of the native Xata driver.

### v0.30.5_release_notes
v0.30.5: Added $onUpdate() for runtime column value computation on update (and insert if no default); fixed smallserial insertion behavior.

## `$onUpdate` functionality for PostgreSQL, MySQL and SQLite

Adds dynamic update values to columns. The `$onUpdate()` function is called when a row is updated, and its returned value is used as the column value if none is provided. If no `default` or `$defaultFn` is set, the function is also called on insert.

Note: This is runtime-only behavior in drizzle-orm and does not affect drizzle-kit.

Example:
```ts
const usersOnUpdate = pgTable('users_on_update', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  updateCounter: integer('update_counter').default(sql`1`).$onUpdateFn(() => sql`update_counter + 1`),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 }).$onUpdate(() => new Date()),
  alwaysNull: text('always_null').$type<string | null>().$onUpdate(() => null),
});
```

## Fixes

- Insertions on columns with smallserial datatype are now correctly non-optional (issue #1848)

### pglite_driver_support
v0.30.6 adds PGlite driver: WASM Postgres (2.6mb) for browser/Node.js/Bun with in-memory or file/indexedDB persistence, no VM required.

## PGlite Driver Support

PGlite is a WASM Postgres build packaged as a TypeScript client library that runs Postgres in the browser, Node.js, and Bun without additional dependencies. It's 2.6mb gzipped and can operate as an ephemeral in-memory database or with persistence to the file system (Node/Bun) or indexedDB (Browser). Unlike previous "Postgres in the browser" projects, PGlite uses pure Postgres in WASM without a Linux virtual machine.

**Usage:**
```ts
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { users } from './schema';

const client = new PGlite();
const db = drizzle(client);
await db.select().from(users);
```

### v0.30.7_release
v0.30.7 adds Vercel Postgres mappings and fixes Neon interval mapping

## Fixes

- Added mappings for `@vercel/postgres` package. Vercel Postgres is a serverless PostgreSQL database service. To get started with Drizzle and Vercel Postgres, refer to the PostgreSQL getting started documentation section on Vercel Postgres.

- Fixed interval mapping for `neon` drivers (issue #1542). Neon is a serverless PostgreSQL platform. To get started with Drizzle and Neon, refer to the PostgreSQL getting started documentation section on Neon.

### v0.30.8_release_notes
v0.30.8: Postgres enum schema support, D1 batch migrations, onConflict where clause split (setWhere/targetWhere), AWS Data API fixes

## New Features

**Custom schema support for Postgres enums:**
```ts
import { pgSchema } from 'drizzle-orm/pg-core';

const mySchema = pgSchema('mySchema');
const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
```

## Fixes

**D1 migrate() function:** Changed to use batch API for better performance.

**Postgres `.onConflictDoUpdate` method:** Split `where` clause into `setWhere` and `targetWhere` to support both where cases in on conflict clause.
```ts
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });
  
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

**Postgres `.onConflictDoNothing` method:** Fixed query generation for `where` clause placement.

**AWS Data API driver:** Fixed multiple issues including inserting and updating array values.

### v0.30.9_release
v0.30.9: SQLite onConflictDoUpdate split where into targetWhere/setWhere, added db._.fullSchema for schema introspection, fixed AWS Data API migrator

## New Features

**Enhanced `.onConflictDoUpdate()` in SQLite**: Added `setWhere` and `targetWhere` fields to replace the single `where` field, enabling more granular control over conflict resolution:

```ts
// Using targetWhere to filter which conflicts to handle
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });

// Using setWhere to conditionally apply updates
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

**Schema introspection**: Added `db._.fullSchema` to access schema information from Drizzle instances.

## Fixes

- Fixed migrator in AWS Data API

### v0.31.0_release_notes
v0.31.0 breaking change: PostgreSQL indexes API - ordering modifiers move to per-column/expression level, `.using()` specifies index type; new pg_vector, point, line, PostGIS geometry types; Kit v0.22.0 adds extensionsFilters, SSL options, fixes index expressions.

## Breaking Changes

**PostgreSQL indexes API was changed** to align with PostgreSQL documentation. The previous API didn't support SQL expressions in `.on()`, conflated `.using()` and `.on()`, and placed ordering modifiers on the index instead of per-column.

Previous API:
```ts
index('name')
  .on(table.column1, table.column2)
  .using(sql``)
  .asc() / .desc()
  .nullsFirst() / .nullsLast()
  .where(sql``)
```

New API:
```ts
// With .on()
index('name')
  .on(table.column1.asc(), table.column2.nullsFirst())
  .concurrently()
  .where(sql``)
  .with({ fillfactor: '70' })

// With .using()
index('name')
  .using('btree', table.column1.asc(), sql`lower(${table.column2})`, table.column1.op('text_ops'))
  .where(sql``)
  .with({ fillfactor: '70' })
```

Requires `drizzle-kit@0.22.0` or higher.

## New Features

### pg_vector extension support

Define vector indexes and use vector distance functions:

```ts
const table = pgTable('items', {
    embedding: vector('embedding', { dimensions: 3 })
}, (table) => ({
    l2: index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops')),
    ip: index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops')),
    cosine: index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
    l1: index('l1_index').using('hnsw', table.embedding.op('vector_l1_ops')),
    hamming: index('hamming_index').using('hnsw', table.embedding.op('bit_hamming_ops')),
    jaccard: index('jaccard_index').using('hnsw', table.embedding.op('bit_jaccard_ops'))
}))
```

Helper functions for queries:
```ts
import { l2Distance, l1Distance, innerProduct, cosineDistance, hammingDistance, jaccardDistance } from 'drizzle-orm'

l2Distance(table.column, [3, 1, 2]) // <->
l1Distance(table.column, [3, 1, 2]) // <+>
innerProduct(table.column, [3, 1, 2]) // <#>
cosineDistance(table.column, [3, 1, 2]) // <=>
hammingDistance(table.column, '101') // <~>
jaccardDistance(table.column, '101') // <%>
```

Query examples:
```ts
db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2]))
db.select({ distance: l2Distance(items.embedding, [3,1,2]) }).from(items)
const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1));
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5)
```

Custom distance functions can be created by replicating the pattern:
```ts
export function l2Distance(column: SQLWrapper | AnyColumn, value: number[] | string[] | TypedQueryBuilder<any> | string): SQL {
  if (is(value, TypedQueryBuilder<any>) || typeof value === 'string') {
    return sql`${column} <-> ${value}`;
  }
  return sql`${column} <-> ${JSON.stringify(value)}`;
}
```

### New PostgreSQL types: point and line

**point** type with two modes:
```ts
const items = pgTable('items', {
 point: point('point'), // tuple mode: [1,2]
 pointObj: point('point_xy', { mode: 'xy' }), // xy mode: { x: 1, y: 2 }
});
```

**line** type with two modes:
```ts
const items = pgTable('items', {
 line: line('line'), // tuple mode: [1,2,3]
 lineObj: line('line_abc', { mode: 'abc' }), // abc mode: { a: 1, b: 2, c: 3 }
});
```

### PostGIS extension support

**geometry** type from postgis:
```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point' }),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' }),
  geoSrid: geometry('geo_options', { type: 'point', mode: 'xy', srid: 4000 }),
});
```

Modes: `tuple` (default, maps to [x,y]) and `xy` (maps to { x, y }). Type defaults to `point` but accepts any string.

## Drizzle Kit v0.22.0 Updates

### New type support
- `point` and `line` from PostgreSQL
- `vector` from pg_vector extension
- `geometry` from PostGIS extension

### extensionsFilters config parameter

Skip tables created by extensions:
```ts
export default defineConfig({
  dialect: "postgresql",
  extensionsFilters: ["postgis"], // skips geography_columns, geometry_columns, spatial_ref_sys
})
```

### SSL configuration improvements

Full SSL parameter support:
```ts
// PostgreSQL
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    ssl: true, // or "require" | "allow" | "prefer" | "verify-full" | node:tls options
  }
})

// MySQL
export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    ssl: "", // string | mysql2 SslOptions
  }
})
```

### Normalized SQLite URLs

libsql and better-sqlite3 drivers now accept both file path patterns and normalize them correctly.

### MySQL and SQLite index-as-expression behavior

Expressions are no longer escaped in strings, columns are properly handled:
```ts
export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    email: text('email').notNull(),
}, (table) => ({
    emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
}));

// Before: CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (`lower("users"."email")`);
// Now: CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower("email"));
```

### Index limitations

Must specify index name manually if using expressions:
```ts
index().on(table.id, table.email) // auto-named, works
index('my_name').on(table.id, table.email) // works
index().on(sql`lower(${table.email})`) // error
index('my_name').on(sql`lower(${table.email})`) // works
```

Push won't generate statements if these fields change in existing indexes: expressions in `.on()`/`.using()`, `.where()` statements, or `.op()` operator classes. For changes, comment out the index, push, uncomment and modify, then push again. Generate command has no such limitations.

### Bug fixes
- Multiple constraints not added (only first generated)
- Drizzle Studio connection termination errors
- SQLite local migrations execution
- Unknown '--config' option errors

### live-queries
v0.31.1 adds useLiveQuery React Hook for Expo SQLite that auto-reruns queries and rerenders on data changes, returning {data, error, updatedAt}

## Live Queries for Expo SQLite

Drizzle ORM v0.31.1 introduces native support for Expo SQLite Live Queries via the `useLiveQuery` React Hook. This hook automatically observes database changes and re-runs queries when data changes.

**Setup:**
```tsx
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);
```

**Usage:**
The hook works with both SQL-like and Drizzle queries:
```tsx
const { data, error, updatedAt } = useLiveQuery(db.select().from(users));
// or
const { data, error, updatedAt } = useLiveQuery(db.query.users.findFirst());
const { data, error, updatedAt } = useLiveQuery(db.query.users.findMany());
```

The hook returns an object with `data`, `error`, and `updatedAt` fields for explicit error handling. Components automatically re-render when the observed data changes.

**Design decisions:**
- The ORM API itself remains unchanged; the hook follows conventional React Hook patterns rather than adding methods like `.useLive()` to queries
- Result structure follows practices from React Query and Electric SQL

### v0.31.2_tidb_cloud_serverless_support
v0.31.2 adds TiDB Cloud Serverless driver support via `drizzle-orm/tidb-serverless` module with standard connection pattern.

## TiDB Cloud Serverless Driver Support

Added support for TiDB Cloud Serverless driver in v0.31.2.

**Usage:**

```ts
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';

const client = connect({ url: '...' });
const db = drizzle(client);
await db.select().from(...);
```

Initialize a TiDB Cloud Serverless client with a connection URL, pass it to `drizzle()` from the `tidb-serverless` module, then use standard Drizzle ORM queries.

### v0.31.3_release
v0.31.3: Fixed RQB schema handling and RDS Data API types; added Prisma extension for native Drizzle query integration via `$extends(drizzle())`

## Bug Fixes

- Fixed RQB behavior for tables with same names in different schemas
- Fixed mismatched type hints when using RDS Data API (#2097)

## Prisma-Drizzle Extension

New extension allows using Drizzle queries within Prisma Client:

```ts
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';
import { User } from './drizzle';

const prisma = new PrismaClient().$extends(drizzle());
const users = await prisma.$drizzle.select().from(User);
```

The extension is initialized via `$extends(drizzle())` and provides `$drizzle` property for executing Drizzle queries. See Prisma integration docs for more details.

### v0.31.4_release
v0.31.4: prisma clients package now optional

DrizzleORM v0.31.4 marks the prisma clients package as optional, reducing unnecessary dependencies for users who don't use Prisma integration.

### v0.32.0_release_notes
MySQL $returningId() for inserted IDs; PostgreSQL sequences, identity columns, and generated columns; MySQL/SQLite generated columns with stored/virtual modes; Drizzle Kit migrations support and --force flag; customizable migration file prefixes.

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

### v0.32.1_release_notes
v0.32.1: index typing fixes for 3+ columns, limit 0 support, empty array handling for inArray/notInArray, doc fixes

## Bug Fixes and Improvements

**Index Typings and Multi-Column Support**
- Fixed typings for indexes
- Now supports creating indexes on 3+ columns with mixed columns and expressions

**Limit 0 Support**
- Added support for "limit 0" across all dialects (resolves issue #2011)

**Array Operations**
- `inArray` and `notInArray` now accept empty lists (resolves issue #1295)

**Documentation Fixes**
- Fixed typo in `lt` typedoc
- Corrected wrong example in README.md

### v0.32.2_release
v0.32.2 release: AWS Data API type hints fix, MySQL transactions fix, useLiveQuery dependency forwarding, additional SQLite type exports

## Bug Fixes and Improvements

**AWS Data API Type Hints**
- Fixed type hints bugs in RQB (Query Builder) for AWS Data API

**MySQL Transactions**
- Fixed set transactions bug in MySQL

**useLiveQuery Hook**
- Added forwarding dependencies within useLiveQuery, resolving issue #2651

**SQLite Exports**
- Added export of additional types from SQLite package, including `AnySQLiteUpdate`

