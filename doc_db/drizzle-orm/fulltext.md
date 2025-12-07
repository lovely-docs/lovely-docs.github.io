
## Directories

### column_types
Column type definitions and modifiers for MySQL, PostgreSQL, SingleStore, and SQLite databases with examples.

## Column Types Reference

Complete reference for defining columns across all supported databases (MySQL, PostgreSQL, SingleStore, SQLite).

### MySQL Column Types
- **Numeric**: `int()`, `tinyint()`, `smallint()`, `mediumint()`, `bigint({ mode: 'number' | 'bigint', unsigned: true })`, `real()`, `decimal()`, `double()`, `float()`, `serial()`
- **Binary**: `binary()`, `varbinary({ length: 2 })`
- **String**: `char()`, `varchar({ length: 2, enum: ["v1", "v2"] })`, `text({ enum: [...] })`
- **Boolean/DateTime**: `boolean()`, `date()`, `datetime({ mode: 'date' | 'string', fsp: 0..6 })`, `time({ fsp: 0..6 })`, `year()`, `timestamp({ mode: 'date' | 'string', fsp: 0..6 })`
- **JSON/Enum**: `json().$type<T>()`, `mysqlEnum(['val1', 'val2'])`

### PostgreSQL Column Types
- **Integer**: `integer()`, `smallint()`, `bigint({ mode: 'number' | 'bigint' })`
- **Auto-increment**: `serial()`, `smallserial()`, `bigserial({ mode: 'number' })`
- **Text**: `text({ enum: [...] })`, `varchar({ length: 256, enum: [...] })`, `char({ length: 256, enum: [...] })`
- **Numeric**: `numeric({ precision: 100, scale: 20, mode: 'number' | 'bigint' })`, `real()`, `doublePrecision()`
- **JSON**: `json().$type<T>()`, `jsonb().$type<T>()`
- **DateTime**: `time({ withTimezone: true, precision: 6 })`, `timestamp({ precision: 6, withTimezone: true, mode: 'date' | 'string' }).defaultNow()`, `date({ mode: 'date' | 'string' })`, `interval({ fields: 'day', precision: 6 })`
- **Geometric**: `point({ mode: 'tuple' | 'xy' })`, `line({ mode: 'tuple' | 'abc' })`
- **Enum**: `pgEnum('mood', ['sad', 'ok', 'happy'])`
- **Identity**: `integer().primaryKey().generatedAlwaysAsIdentity({ startWith: 1000 })` or `.generatedByDefaultAsIdentity()`

### SingleStore Column Types
- **Numeric**: `int()`, `tinyint()`, `smallint()`, `mediumint()`, `bigint({ mode: 'number', unsigned: true })`, `real({ precision: 1, scale: 1 })`, `decimal({ precision: 1, scale: 1, mode: 'number' | 'bigint' })`, `double({ precision: 1, scale: 1 })`, `float()`, `serial()`
- **Binary**: `binary()`, `varbinary({ length: 2 })`
- **String**: `char()`, `varchar({ length: 2, enum: [...] })`, `text({ enum: [...] })`
- **Boolean/DateTime**: `boolean()`, `date()`, `datetime({ mode: 'date' | 'string' })`, `time()`, `year()`, `timestamp({ mode: 'date' | 'string' }).defaultNow()`
- **JSON/Enum**: `json().$type<T>()`, `singlestoreEnum(['val1', 'val2'])`

### SQLite Column Types
- **Integer**: `integer({ mode: 'number' | 'boolean' | 'timestamp_ms' | 'timestamp' }).primaryKey({ autoIncrement: true })`
- **Real**: `real()`
- **Text**: `text()`, `text({ enum: [...] })`, `text({ mode: 'json' }).$type<T>()`
- **Blob**: `blob()`, `blob({ mode: 'buffer' | 'bigint' | 'json' }).$type<T>()`
- **Numeric**: `numeric({ mode: 'number' | 'bigint' })`

### Column Modifiers (All Databases)

**Type customization**:
```typescript
type UserId = number & { __brand: 'user_id' };
int().$type<UserId>()  // branded types
json().$type<{ foo: string }>()  // type inference
```

**Constraints**:
- `.notNull()` - NOT NULL constraint
- `.primaryKey()` - PRIMARY KEY constraint (SQLite: `.primaryKey({ autoIncrement: true })`)
- `.autoincrement()` - AUTO_INCREMENT (MySQL/SingleStore)

**Defaults**:
- `.default(value)` - static default value
- `.default(sql`expression`)` - SQL expression default
- `.defaultNow()` - current timestamp (PostgreSQL/MySQL/SingleStore)
- `.$defaultFn(() => createId())` - runtime default function (insert only, doesn't affect drizzle-kit)
- `.$onUpdate(() => value)` / `.$onUpdateFn()` - runtime update function (called on update, or insert if no default)

**Example**:
```typescript
const table = pgTable('users', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  data: json().$type<{ foo: string }>(),
  status: text({ enum: ['active', 'inactive'] })
});
```

**Notes**:
- Column names generated from TypeScript keys; use database aliases or `casing` parameter for custom mapping
- Enum in `varchar`/`text` provides type inference only, no runtime validation
- PostgreSQL `timestamp with timezone` stored in UTC, converted based on instance timezone
- SQLite has no native boolean/bigint; use `integer({ mode: 'boolean' })` or `blob({ mode: 'bigint' })`
- Use `text({ mode: 'json' })` instead of `blob({ mode: 'json' })` for JSON function support in SQLite

### database_setup_guides
Database integration setup for 30+ platforms with standardized workflow and examples

## Database Setup Guides

Comprehensive setup instructions for integrating Drizzle ORM with 30+ databases and platforms.

### Supported Databases

**SQL Databases:**
- PostgreSQL (node-postgres, postgres.js)
- MySQL (mysql2)
- SQLite (libsql, better-sqlite3, bun:sqlite, expo-sqlite, op-sqlite)
- SingleStore (mysql2)

**Serverless/Cloud Platforms:**
- Neon (serverless Postgres via HTTP/WebSocket)
- Supabase (managed PostgreSQL)
- Vercel Postgres (serverless Postgres)
- PlanetScale (serverless MySQL via HTTP)
- TiDB Serverless (distributed SQL via HTTP)
- Turso (SQLite for production via libsql)
- SQLite Cloud (cloud SQLite)
- Xata (PostgreSQL)
- Nile (multi-tenant PostgreSQL)

**Edge/Specialized:**
- Cloudflare D1 (serverless SQLite)
- Cloudflare Workers with SQLite Durable Objects
- Bun SQL (native PostgreSQL bindings)
- Bun SQLite (native SQLite bindings)
- Expo SQLite (React Native)
- OP-SQLite (React Native)
- PGLite (in-process PostgreSQL)
- Gel (database)

### Common Setup Pattern

Each guide follows this workflow:

1. **Install packages** - Database driver + drizzle-orm + drizzle-kit
2. **Environment variables** - DATABASE_URL or equivalent connection string
3. **Drizzle config** - `drizzle.config.ts` with dialect and credentials
4. **Schema** - Define tables using Drizzle schema API or introspect existing database
5. **Migrations** - Generate and apply with `drizzle-kit generate/push`
6. **Connection** - Initialize Drizzle client with appropriate driver
7. **Queries** - Execute CRUD operations

### Example: PostgreSQL Setup

```typescript
// Install: npm install pg drizzle-orm
// npm install -D drizzle-kit @types/pg

// .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  schema: './src/schema.ts',
});

// src/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const db = drizzle(client);

// src/schema.ts
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  age: integer(),
  email: text().notNull().unique(),
});

// Usage
await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
const allUsers = await db.select().from(users);
await db.update(users).set({ age: 31 }).where(eq(users.email, 'john@example.com'));
await db.delete(users).where(eq(users.email, 'john@example.com'));
```

### Example: SQLite Setup

```typescript
// Install: npm install @libsql/client drizzle-orm
// npm install -D drizzle-kit

// .env
DB_FILE_NAME=file:local.db

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: { url: process.env.DB_FILE_NAME! },
  schema: './src/schema.ts',
});

// src/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: process.env.DB_FILE_NAME! });
const db = drizzle(client);

// src/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: integer(),
  email: text().notNull().unique(),
});
```

### Introspection for Existing Databases

For existing databases, use introspection to auto-generate schema:
```bash
npx drizzle-kit introspect:pg  # PostgreSQL
npx drizzle-kit introspect:mysql  # MySQL
npx drizzle-kit introspect:sqlite  # SQLite
```

### Known Issues

- **Bun v1.2.0**: Concurrent statement execution issues with Bun SQL (track oven-sh/bun#16774)
- **Cloudflare D1**: Migrations must be applied from within Workers, not locally; use `ctx.blockConcurrencyWhile()` for Durable Objects
- **Turso/Neon**: HTTP drivers faster for single queries; WebSocket drivers support sessions and transactions

### Multi-Tenant Patterns

Nile guides show tenant-aware schema patterns with `tenant_id` columns and built-in tenants table for multi-tenant applications.

### React Native Support

Expo SQLite and OP-SQLite guides include metro/babel configuration and `useMigrations` hook for applying migrations in React Native apps.

### common_patterns_&_recipes
Comprehensive patterns for querying, filtering, pagination, updates, full-text search, geospatial queries, defaults, seeding, and database setup.

## Querying & Filtering

**Conditional Filters**: Apply filters conditionally with `.where()` and combine with `and()`/`or()`. Build filters dynamically in arrays. Create custom operators using `sql` template expressions.

```ts
import { and, ilike, inArray, gt, sql } from 'drizzle-orm';

// Conditional
await db.select().from(posts)
  .where(term ? ilike(posts.title, term) : undefined);

// Combined
await db.select().from(posts).where(
  and(
    term ? ilike(posts.title, term) : undefined,
    categories.length > 0 ? inArray(posts.category, categories) : undefined,
  )
);

// Dynamic array
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
await db.select().from(posts).where(and(...filters));

// Custom operator
const lenlt = (column: AnyColumn, value: number) => 
  sql`length(${column}) < ${value}`;
```

**Counting Rows**: Use `count()` function. PostgreSQL/MySQL return bigint (cast to integer). SQLite returns integer natively. Supports filtering, joins, and grouping.

```ts
import { count } from 'drizzle-orm';

// Basic
await db.select({ count: count() }).from(products);

// Non-null values in column
await db.select({ count: count(products.discount) }).from(products);

// PostgreSQL/MySQL casting
const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};

// With conditions
await db.select({ count: count() }).from(products)
  .where(gt(products.price, 100));

// With joins/grouping
await db.select({
  country: countries.name,
  citiesCount: count(cities.id),
}).from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id);
```

**Column Selection**: Use `.select()` with field objects, `getTableColumns()` utility for spread/destructuring, relational queries with `columns`/`extras`/`with` options, or conditional spread operators.

```ts
import { getTableColumns } from 'drizzle-orm';

// All columns
await db.select().from(posts);

// Specific columns
await db.select({ title: posts.title }).from(posts);

// Using getTableColumns
await db.select({ ...getTableColumns(posts) }).from(posts);

// Exclude columns
const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);

// Add computed columns
await db.select({ 
  ...getTableColumns(posts), 
  titleLength: sql<number>`length(${posts.title})` 
}).from(posts);

// Relational queries
db.query.posts.findMany({ columns: { title: true } });
db.query.posts.findMany({ columns: { content: false } });
db.query.posts.findMany({ 
  extras: { titleLength: sql<number>`length(${posts.title})`.as('title_length') } 
});

// Conditional selection
const searchPosts = async (withTitle = false) => {
  await db.select({
    id: posts.id,
    ...(withTitle && { title: posts.title }),
  }).from(posts);
};
```

**Parent Rows with Related Children**: Use `innerJoin()` to get parent-child pairs, or `exists()` subquery to get parent rows only.

```ts
import { eq, exists, sql } from 'drizzle-orm';

// With child data
await db.select({ user: users, post: posts })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.userId));

// Parent only (has at least one child)
const sq = db.select({ id: sql`1` })
  .from(posts)
  .where(eq(posts.userId, users.id));
await db.select().from(users).where(exists(sq));
```

## Pagination

**Limit/Offset**: Skip `(page-1)*size` rows, return `size` rows. Requires unique column ordering. Simple but degrades with large offsets and inconsistent with concurrent data changes. Use deferred join optimization for large tables.

```ts
import { asc } from 'drizzle-orm';

// Basic
await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(4)
  .offset(4);

// Non-unique columns: append unique column
await db.select().from(users)
  .orderBy(asc(users.firstName), asc(users.id))
  .limit(pageSize)
  .offset((page - 1) * pageSize);

// Relational API
db.query.users.findMany({
  orderBy: (users, { asc }) => asc(users.id),
  limit: pageSize,
  offset: (page - 1) * pageSize,
});

// Deferred join optimization for large tables
const sq = db.select({ id: users.id })
  .from(users)
  .orderBy(users.id)
  .limit(pageSize)
  .offset((page - 1) * pageSize)
  .as('subquery');
await db.select().from(users)
  .innerJoin(sq, eq(users.id, sq.id))
  .orderBy(users.id);
```

**Cursor-Based**: Use cursor (pointer to last row) with `gt`/`lt` comparisons and `orderBy`. Supports multi-column cursors for non-unique columns, non-sequential PKs, dynamic ordering, and relational queries. Requires indexing cursor columns.

```ts
import { asc, desc, gt, lt, and, eq, or } from 'drizzle-orm';

// Basic
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};

// Dynamic order direction
const nextUserPage = async (order: 'asc' | 'desc' = 'asc', cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? (order === 'asc' ? gt(users.id, cursor) : lt(users.id, cursor)) : undefined)
    .limit(pageSize)
    .orderBy(order === 'asc' ? asc(users.id) : desc(users.id));
};

// Multi-column cursor (non-unique columns)
const nextUserPage = async (cursor?: { id: number; firstName: string }, pageSize = 3) => {
  await db.select().from(users)
    .where(
      cursor ? or(
        gt(users.firstName, cursor.firstName),
        and(eq(users.firstName, cursor.firstName), gt(users.id, cursor.id)),
      ) : undefined
    )
    .limit(pageSize)
    .orderBy(asc(users.firstName), asc(users.id));
};

// Non-sequential PKs (UUIDv4) with sequential column
const nextUserPage = async (cursor?: { id: string; createdAt: Date }, pageSize = 3) => {
  await db.select().from(users)
    .where(
      cursor ? or(
        gt(users.createdAt, cursor.createdAt),
        and(eq(users.createdAt, cursor.createdAt), gt(users.id, cursor.id)),
      ) : undefined
    )
    .limit(pageSize)
    .orderBy(asc(users.createdAt), asc(users.id));
};

// Relational API
db.query.users.findMany({
  where: (users, { gt }) => (cursor ? gt(users.id, cursor) : undefined),
  orderBy: (users, { asc }) => asc(users.id),
  limit: pageSize,
});

// Create indices on cursor columns
import { index } from 'drizzle-orm/pg-core';
export const users = pgTable('users', { /* columns */ }, (t) => [
  index('first_name_index').on(t.firstName).asc(),
  index('first_name_and_id_index').on(t.firstName, t.id).asc(),
]);
```

## Updates & Mutations

**Incrementing/Decrementing**: Use `update().set(sql`${column} + value`)` or `update().set(sql`${column} - value`)`. Create custom helper functions. Supported on PostgreSQL, MySQL, SQLite.

```ts
import { eq, sql } from 'drizzle-orm';

// Increment
await db.update(table).set({
  counter: sql`${table.counter} + 1`,
}).where(eq(table.id, 1));

// Decrement
await db.update(table).set({
  counter: sql`${table.counter} - 1`,
}).where(eq(table.id, 1));

// Custom helpers
const increment = (column: AnyColumn, value = 1) => sql`${column} + ${value}`;
const decrement = (column: AnyColumn, value = 1) => sql`${column} - ${value}`;

await db.update(table).set({
  counter1: increment(table.counter1),
  counter2: decrement(table.counter2, 10),
}).where(eq(table.id, 1));
```

**Toggle Boolean**: Use `not()` operator in `update().set()`. Supported on PostgreSQL, MySQL, SQLite.

```ts
import { eq, not } from 'drizzle-orm';

await db.update(table).set({
  isActive: not(table.isActive),
}).where(eq(table.id, 1));
```

**Bulk Update with Different Values**: Use dynamic SQL `case` statement with `sql` operator and `inArray` filter.

```ts
import { SQL, inArray, sql } from 'drizzle-orm';

const inputs = [
  { id: 1, city: 'New York' },
  { id: 2, city: 'Los Angeles' },
  { id: 3, city: 'Chicago' },
];

const sqlChunks: SQL[] = [];
const ids: number[] = [];
sqlChunks.push(sql`(case`);

for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}

sqlChunks.push(sql`end)`);
const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));

await db.update(users).set({ city: finalSql }).where(inArray(users.id, ids));
// Generates: update users set "city" = (case when id = 1 then 'New York' ... end) where id in (1, 2, 3)
```

**Upsert**: PostgreSQL/SQLite use `.onConflictDoUpdate(target, set, setWhere)` with `excluded` keyword. MySQL uses `.onDuplicateKeyUpdate(set)` with `values()` function.

```ts
import { sql, getTableColumns } from 'drizzle-orm';

// PostgreSQL/SQLite - single row
await db.insert(users).values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });

// PostgreSQL/SQLite - multiple rows with excluded
const values = [
  { id: 1, lastLogin: new Date() },
  { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
];
await db.insert(users).values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
  });

// PostgreSQL/SQLite - composite key
await db.insert(inventory).values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId],
    set: { quantity: sql`${inventory.quantity} + 100` },
  });

// PostgreSQL/SQLite - conditional update
await db.insert(products).values(data)
  .onConflictDoUpdate({
    target: products.id,
    set: { price: sql.raw(`excluded.${products.price.name}`), stock: sql.raw(`excluded.${products.stock.name}`) },
    setWhere: sql`${products.stock} != excluded.${products.stock.name}`,
  });

// PostgreSQL/SQLite - preserve columns
await db.insert(users).values(data)
  .onConflictDoUpdate({
    target: users.id,
    set: { ...data, email: sql`${users.email}` }, // email unchanged
  });

// MySQL
await db.insert(users).values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });

// MySQL - multiple rows
await db.insert(users).values(values)
  .onDuplicateKeyUpdate({
    set: { lastLogin: sql`values(${users.lastLogin})` },
  });
```

## Advanced Features

**Full-Text Search - PostgreSQL**: Use `to_tsvector()`/`to_tsquery()` with `@@` operator. Query variants: `plainto_tsquery()` (AND), `phraseto_tsquery()` (phrase), `websearch_to_tsquery()` (web syntax). Multi-column search with `setweight()`. Rank results with `ts_rank`/`ts_rank_cd`. Create GIN indexes.

```ts
import { sql, index, desc, getTableColumns } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

// Basic search
const title = 'trip';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);

// Query variants
const title = 'Europe | Asia'; // OR
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);

const title = 'discover Italy'; // AND
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ plainto_tsquery('english', ${title})`);

const title = 'family trip'; // phrase
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ phraseto_tsquery('english', ${title})`);

const title = 'family or first trip Europe or Asia'; // web syntax
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ websearch_to_tsquery('english', ${title})`);

// Multi-column with weights and ranking
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
}, (table) => [
  index('search_index').using('gin', 
    sql`(setweight(to_tsvector('english', ${table.title}), 'A') || 
         setweight(to_tsvector('english', ${table.description}), 'B'))`
  ),
]);

const search = 'culture | Europe | Italy | adventure';
const matchQuery = sql`(
  setweight(to_tsvector('english', ${posts.title}), 'A') ||
  setweight(to_tsvector('english', ${posts.description}), 'B')), to_tsquery('english', ${search})`;

await db.select({
  ...getTableColumns(posts),
  rank: sql`ts_rank(${matchQuery})`,
  rankCd: sql`ts_rank_cd(${matchQuery})`,
}).from(posts)
  .where(sql`(
    setweight(to_tsvector('english', ${posts.title}), 'A') ||
    setweight(to_tsvector('english', ${posts.description}), 'B')
    ) @@ to_tsquery('english', ${search})`)
  .orderBy((t) => desc(t.rank));
```

**Full-Text Search with Generated Columns - PostgreSQL**: Define custom `tsvector` type, create generated column with `to_tsvector()`, index with GIN. Supports weighted multi-column search with `setweight()`.

```ts
import { SQL, sql, customType, index, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const tsvector = customType<{ data: string }>({
  dataType() { return `tsvector`; },
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  bodySearch: tsvector('body_search')
    .notNull()
    .generatedAlwaysAs((): SQL => sql`to_tsvector('english', ${posts.body})`),
}, (t) => [
  index('idx_body_search').using('gin', t.bodySearch),
]);

// Query
const searchParam = "bring";
await db.select().from(posts)
  .where(sql`${posts.bodySearch} @@ to_tsquery('english', ${searchParam})`);

// Weighted multi-column
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  search: tsvector('search')
    .notNull()
    .generatedAlwaysAs((): SQL =>
      sql`setweight(to_tsvector('english', ${posts.title}), 'A')
          ||
          setweight(to_tsvector('english', ${posts.body}), 'B')`
    ),
}, (t) => [
  index('idx_search').using('gin', t.search),
]);
```

**Vector Similarity Search - PostgreSQL**: Use pgvector extension with vector embeddings, HNSW indexing, and `cosineDistance` queries for semantic search.

```ts
import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import OpenAI from 'openai';

// Setup pgvector extension (manual migration)
// CREATE EXTENSION vector;

export const guides = pgTable('guides', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  url: text('url').notNull(),
  embedding: vector('embedding', { dimensions: 1536 }),
}, (table) => [
  index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
]);

// Generate embeddings
const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });
const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  });
  return data[0].embedding;
};

// Similarity search
const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;
  
  return await db.select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
};
```

**Geospatial Queries - PostgreSQL**:

*Point datatype*: Define with `point()` column, insert as `{x,y}` or `[x,y]`, compute distance with `<->` operator, filter by rectangular boundary with `<@` operator.

```ts
import { pgTable, point, serial, text, getTableColumns, sql } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: point('location', { mode: 'xy' }).notNull(),
});

// Insert
await db.insert(stores).values({
  name: 'Test',
  location: { x: -90.9, y: 18.7 }, // mode: 'xy'
});
await db.insert(stores).values({
  name: 'Test',
  location: [-90.9, 18.7], // mode: 'tuple'
});

// Distance query
const point = { x: -73.935_242, y: 40.730_61 };
const sqlDistance = sql`location <-> point(${point.x}, ${point.y})`;
await db.select({
  ...getTableColumns(stores),
  distance: sql`round((${sqlDistance})::numeric, 2)`,
}).from(stores)
  .orderBy(sqlDistance)
  .limit(1);

// Rectangular boundary
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };
await db.select().from(stores)
  .where(sql`${stores.location} <@ box(point(${point.x1}, ${point.y1}), point(${point.x2}, ${point.y2}))`);
```

*PostGIS geometry*: Create extension, define geometry columns with GIST indexes, insert via xy/tuple/SQL modes, query nearest with `<->` operator and `ST_Distance()`, filter within bounds with `ST_Within`/`ST_MakeEnvelope`.

```ts
import { geometry, index, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { getTableColumns, sql } from 'drizzle-orm';

// Manual migration: CREATE EXTENSION postgis;

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
}, (t) => [
  index('spatial_index').using('gist', t.location),
]);

// Insert
await db.insert(stores).values({
  name: 'Test',
  location: { x: -90.9, y: 18.7 }, // mode: 'xy'
});
await db.insert(stores).values({
  name: 'Test',
  location: [-90.9, 18.7], // mode: 'tuple'
});

// Nearest location
const point = { x: -73.935_242, y: 40.730_61 };
const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;
await db.select({
  ...getTableColumns(stores),
  distance: sql`ST_Distance(${stores.location}, ${sqlPoint})`,
}).from(stores)
  .orderBy(sql`${stores.location} <-> ${sqlPoint}`)
  .limit(1);

// Within rectangular area
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };
await db.select().from(stores)
  .where(sql`ST_Within(${stores.location}, ST_MakeEnvelope(${point.x1}, ${point.y1}, ${point.x2}, ${point.y2}, 4326))`);
```

## Schema & Defaults

**Timestamp Defaults**: PostgreSQL: `defaultNow()` or `sql`now()`; MySQL: `defaultNow()` or `sql`now()`; SQLite: `sql`current_timestamp``. Use `mode: 'string'` for string representation. Unix timestamps: PostgreSQL `extract(epoch from now())`, MySQL `unix_timestamp()`, SQLite `unixepoch()`.

```ts
import { sql, timestamp, integer, pgTable, serial } from 'drizzle-orm/pg-core';

// PostgreSQL
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' }).notNull().default(sql`now()`),
  unixTimestamp: integer('unix_timestamp').notNull().default(sql`extract(epoch from now())`),
});

// MySQL
import { mysqlTable } from 'drizzle-orm/mysql-core';
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' }).notNull().default(sql`now()`),
  timestamp3: timestamp('timestamp3', { fsp: 3 }).notNull().default(sql`now(3)`),
  unixTimestamp: int('unix_timestamp').notNull().default(sql`(unix_timestamp())`),
});

// SQLite
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp: text('timestamp').notNull().default(sql`(current_timestamp)`),
  unixTimestamp1: integer('unix_timestamp1', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  unixTimestamp2: integer('unix_timestamp2', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
});
```

**Empty Array Defaults**: PostgreSQL: `sql`'{}'::text[]`` or `sql`ARRAY[]::text[]``. MySQL: `json` type with `default([])` or `sql`(JSON_ARRAY())`` or `sql`('[]')``; use `.$type<T>()` for type inference. SQLite: `text` with `mode: 'json'` and `sql`(json_array())`` or `sql`'[]'``; use `.$type<T>()`.

```ts
import { sql, pgTable, mysqlTable, sqliteTable, serial, text, json, integer } from 'drizzle-orm/pg-core';

// PostgreSQL
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tags1: text('tags1').array().notNull().default(sql`'{}'::text[]`),
  tags2: text('tags2').array().notNull().default(sql`ARRAY[]::text[]`),
});

// MySQL
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  tags1: json('tags1').$type<string[]>().notNull().default([]),
  tags2: json('tags2').$type<string[]>().notNull().default(sql`('[]')`),
  tags3: json('tags3').$type<string[]>().notNull().default(sql`(JSON_ARRAY())`),
});

// SQLite
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  tags1: text('tags1', { mode: 'json' }).notNull().$type<string[]>().default(sql`(json_array())`),
  tags2: text('tags2', { mode: 'json' }).notNull().$type<string[]>().default(sql`'[]'`),
});
```

**Case-Insensitive Unique Email**: Create unique index on `lower()` function. PostgreSQL/SQLite: `uniqueIndex().on(lower(column))`. MySQL: `uniqueIndex().on(lower(column))` with parentheses, requires MySQL 8.0.13+. Query with `eq(lower(column), lowercased_value)`.

```ts
import { SQL, sql, eq } from 'drizzle-orm';
import { pgTable, serial, text, uniqueIndex, AnyPgColumn } from 'drizzle-orm/pg-core';

// PostgreSQL
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
}, (table) => [
  uniqueIndex('emailUniqueIndex').on(lower(table.email)),
]);

// Query
const findUserByEmail = async (email: string) => {
  return await db.select().from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};

// MySQL (with parentheses)
import { AnyMySqlColumn, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`;
}

// SQLite
import { AnySQLiteColumn, sqliteTable } from 'drizzle-orm/sqlite-core';
export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}
```

## Seeding

**Seeding with `with` Option**: Generate related child records in one-to-many relationships. Requires foreign key or explicit relations definition.

```ts
import { relations } from 'drizzle-orm';

// Option 1: Foreign key
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id').notNull().references(() => users.id),
});

// Option 2: Explicit relations
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

// Seed with `with`
await seed(db, { users, posts, postsRelations }).refine(() => ({
  users: {
    count: 2,
    with: {
      posts: 3, // 2 users, each with 3 posts
    },
  },
}));
```

**Seeding with Partially Exposed Schema**: Handle foreign key constraints when seeding tables with unexposed referenced tables. Solutions: expose the table, remove not-null constraint, or refine column generator with specific values.

```ts
import { seed } from 'drizzle-orm/seed';

// Problem: bloodPressure has not-null userId referencing unexposed users table
export const bloodPressure = pgTable('bloodPressure', {
  bloodPressureId: serial().primaryKey(),
  pressure: doublePrecision(),
  userId: integer().references(() => users.id).notNull(),
});

// Solution 1: Expose referenced table
await seed(db, { bloodPressure, users });

// Solution 2: Remove not-null constraint
userId: integer().references(() => users.id),

// Solution 3: Refine column generator (requires users data in DB)
await seed(db, { bloodPressure }).refine((funcs) => ({
  bloodPressure: {
    columns: {
      userId: funcs.valuesFromArray({ values: [1, 2] })
    }
  }
}));
```

## Local Setup

**PostgreSQL with Docker**: Pull image, run container with password and port mapping, connect via `postgres://postgres:password@localhost:5432/postgres`.

```bash
docker pull postgres:15
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
docker ps
```

**MySQL with Docker**: Pull image, run container with password and port mapping, connect via `mysql://root:password@localhost:3306/database`.

```bash
docker pull mysql:8.2
docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql
docker ps
```

## Configuration

**Cloudflare D1 HTTP API**: Configure `drizzle.config.ts` with `dialect: 'sqlite'`, `driver: 'd1-http'`, and D1 credentials (accountId, databaseId, token from Cloudflare dashboard). Supports migrate, push, introspect, studio commands.

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

**Gel Auth Extension**: Define User type with `ext::auth::Identity` in ESDL, apply migrations, configure `drizzle.config.ts` with `dialect: 'gel'` and `schemaFilter: ['ext::auth', 'public']`, then pull schema with drizzle-kit.

```esdl
using extension auth;

module default {
  type User {
    required identity: ext::auth::Identity;
    required username: str;
    required email: str;
  }
}
```

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
  schemaFilter: ['ext::auth', 'public']
});
```


### release_notes
Chronological release notes documenting ORM evolution from basic PostgreSQL support to comprehensive multi-database system with advanced features, multiple drivers, and ecosystem integrations.

## Release History: v0.11.0 through v0.32.2

### Early Releases (v0.11.0 - v0.16.2)
Initial TypeScript ORM with PostgreSQL support. v0.11.0 introduced core features: typed schema definition via classes, filtering/selection, joins, many-to-many relationships, and automatic migration generation. v0.16.2 added PostgreSQL schemas, MySQL database/schema support, database introspection, postgres.js driver support, and custom types.

### Schema & Constraints (v0.27.2 - v0.28.6)
v0.27.2 added UNIQUE constraints across PostgreSQL, MySQL, SQLite with column-level `.unique()` or table-level `unique().on()` methods. v0.28.0 removed nested relation filtering, added mysql2 mode config, achieved 430% IntelliSense speedup via lateral joins rewrite, added insert with all defaults. v0.28.1-v0.28.6 fixed array bugs, timestamp milliseconds, SQLite typing, added Typebox support, column runtime defaults via `.$defaultFn()`, table type inference via `.$inferSelect/$inferInsert`, LibSQL batch API, SQLite JSON text mode, relational query `.toSQL()`, PostgreSQL array operators (`arrayContains`, `arrayContained`, `arrayOverlaps`).

### Query Building & Drivers (v0.29.0 - v0.29.5)
v0.29.0 added MySQL unsigned bigint, dynamic query building with `.$dynamic()`, custom constraint names, read replicas via `withReplicas()`, set operators (UNION/INTERSECT/EXCEPT), MySQL/PostgreSQL proxy drivers, D1 batch API. v0.29.1 added aggregate helpers (`count`, `sum`, `avg`, `max`, `min` with Distinct variants), ESLint plugin with `enforce-delete-with-where` and `enforce-update-with-where` rules. v0.29.2 added Expo SQLite driver with migration support via babel/metro config and `useMigrations` hook. v0.29.3 made Expo peer dependencies optional. v0.29.4 added Neon HTTP batch queries, deprecated PlanetScale `connect()` in favor of Client instances. v0.29.5 added WITH clauses for INSERT/UPDATE/DELETE, custom migrations table/schema, SQLite proxy batch and relational query support.

### Timestamp Handling & New Drivers (v0.30.0 - v0.30.10)
v0.30.0 changed postgres.js to return date strings with Drizzle mode-based mapping, fixed 8 timestamp/date bugs. v0.30.1 added OP-SQLite driver. v0.30.2 made LibSQL migrations use batch execution. v0.30.3 added raw query batch support for Neon HTTP. v0.30.4 added native xata-http driver for Xata Postgres. v0.30.5 added `$onUpdate()` for runtime column value computation on update. v0.30.6 added PGlite driver (WASM Postgres, 2.6mb, browser/Node.js/Bun). v0.30.7 added Vercel Postgres mappings, fixed Neon interval mapping. v0.30.8 added PostgreSQL enum schema support, D1 batch migrations, split `onConflict` where clause into `setWhere`/`targetWhere`. v0.30.9 added SQLite `onConflictDoUpdate` split where, `db._.fullSchema` for schema introspection. v0.30.10 added `.if()` for conditional WHERE clauses.

### Advanced Features (v0.31.0 - v0.32.2)
v0.31.0 breaking change: PostgreSQL indexes API - ordering modifiers move to per-column level, `.using()` specifies index type. Added pg_vector support with distance functions (`l2Distance`, `l1Distance`, `innerProduct`, `cosineDistance`, `hammingDistance`, `jaccardDistance`), PostgreSQL point/line types, PostGIS geometry type. v0.31.1 added `useLiveQuery` React Hook for Expo SQLite with auto-rerun on data changes. v0.31.2 added TiDB Cloud Serverless driver. v0.31.3 fixed RQB schema handling, added Prisma extension for native Drizzle query integration via `$extends(drizzle())`. v0.31.4 marked prisma clients package as optional. v0.32.0 added MySQL `$returningId()` for inserted IDs, PostgreSQL sequences/identity columns/generated columns, MySQL/SQLite generated columns with stored/virtual modes, Drizzle Kit migrations support and `--force` flag, customizable migration file prefixes. v0.32.1 fixed index typings for 3+ columns, added limit 0 support, empty array handling for `inArray`/`notInArray`. v0.32.2 fixed AWS Data API type hints, MySQL transactions, `useLiveQuery` dependency forwarding.

### Key Patterns
- Schema definition: `pgTable('name', { columns })` with typed columns
- Queries: `db.select().from(table).where(eq(table.id, 1))`
- Inserts: `db.insert(table).values({...})`
- Migrations: auto-generated via drizzle-kit
- Type inference: `typeof table.$inferSelect`, `typeof table.$inferInsert`
- Relational queries: `db.query.table.findMany({ with: { relation: true } })`
- Batch operations: `db.batch([query1, query2, ...])`

### migration_guides
Step-by-step migration guides from Prisma, Sequelize, and TypeORM to Drizzle ORM with setup instructions and query pattern replacements for all common operations.

## Migration from Other ORMs to Drizzle ORM

Complete step-by-step guides for migrating from Prisma, Sequelize, and TypeORM to Drizzle ORM.

### Common Migration Steps (all guides)
1. Install Drizzle ORM & Drizzle Kit: `npm install drizzle-orm pg` and `npm install -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with database credentials and schema paths
3. Run `npx drizzle-kit introspect` to auto-generate schema from existing database
4. Create `src/drizzle/db.ts` to initialize database connection with `drizzle()` and `Client`
5. Update `src/index.ts` to run migrations on startup using `migrate(db, { migrationsFolder })`
6. Replace ORM-specific queries with Drizzle equivalents

### Drizzle Config Template
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/drizzle',
  schema: './src/drizzle/schema.ts',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  verbose: true,
  strict: true,
});
```

### Database Connection Template
```typescript
// src/drizzle/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

export const client = new Client({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

export const db = drizzle({ client, schema });
```

### Schema Relations
After introspection generates tables, add relations for relational queries:
```typescript
import { relations } from 'drizzle-orm';

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  orderDetails: many(orderDetails),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  orderDetails: many(orderDetails),
}));

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders, { fields: [orderDetails.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderDetails.productId], references: [products.id] }),
}));
```

### Query Migration Examples

**Insert:**
```typescript
// Prisma: await prisma.supplier.createMany({ data: [...] })
// Sequelize: await Supplier.bulkCreate([...])
// TypeORM: await repository.save(repository.create([...]))

// Drizzle:
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
]);
```

**Select single row with join:**
```typescript
// Prisma: await prisma.product.findUnique({ where: { id }, include: { supplier: true } })
// Sequelize: await Product.findByPk(id, { include: Supplier })
// TypeORM: await repository.findOne({ where: { id }, relations: ['supplier'] })

// Drizzle (core query):
import { eq } from 'drizzle-orm';
const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));

// Drizzle (relational query - higher-level API):
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select multiple with filtering and pagination:**
```typescript
// Prisma: await prisma.product.findMany({ where: { name: { contains: 'test', mode: 'insensitive' } }, take: 10, skip: 0 })
// Sequelize: await Product.findAndCountAll({ where: { name: { [Op.iLike]: '%test%' } }, limit: 10, offset: 0 })
// TypeORM: await repository.findAndCount({ where: { name: ILike('%test%') }, take: 10, skip: 0 })

// Drizzle (core query):
import { ilike, sql } from 'drizzle-orm';
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db.select({ id: products.id, name: products.name, unitPrice: products.unitPrice, unitsInStock: products.unitsInStock })
    .from(products)
    .where(whereOptions)
    .offset(0)
    .limit(10),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` }).from(products).where(whereOptions),
]);

// Drizzle (relational query):
const [response, count] = await Promise.all([
  db.query.products.findMany({
    where: whereOptions,
    columns: { id: true, name: true, unitPrice: true, unitsInStock: true },
    offset: 0,
    limit: 10,
  }),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` }).from(products).where(whereOptions),
]);
```

**Select with aggregations and joins:**
```typescript
// Prisma: await prisma.orderDetail.aggregate({ where: { orderId: id }, _sum: { quantity: true }, _count: { orderId: true } })
// Sequelize: await sequelize.query('SELECT SUM(...) FROM order_details WHERE orderId = :id', { replacements: { id } })
// TypeORM: await orderRepository.createQueryBuilder('order').select(['SUM(detail.quantity) as totalQuantity']).getRawOne()

// Drizzle (core query - type-safe):
import { eq, sql } from 'drizzle-orm';
const response = await db
  .select({
    id: orders.id,
    shipCountry: orders.shipCountry,
    orderDate: orders.orderDate,
    totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
    totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
    totalProducts: sql<number>`cast(count(${orderDetails.productId}) as int)`,
  })
  .from(orders)
  .where(eq(orders.id, id))
  .groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));

// Note: Aggregations not yet supported in relational queries; use core queries instead.
```

**Update:**
```typescript
// Prisma: await prisma.supplier.update({ where: { id }, data: { city: 'TestCity1Updated' } })
// Sequelize: supplier.set({ city: 'TestCity1Updated' }); await supplier.save()
// TypeORM: supplier.city = 'TestCity1Updated'; await repository.save(supplier)

// Drizzle:
import { eq } from 'drizzle-orm';
await db.update(suppliers).set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' }).where(eq(suppliers.id, id));
```

**Delete with transaction:**
```typescript
// Prisma: await prisma.$transaction([prisma.orderDetail.deleteMany(...), prisma.order.deleteMany(...)])
// Sequelize: await sequelize.transaction(async (t) => { await OrderDetail.destroy(..., { transaction: t }); await order.destroy(...) })
// TypeORM: await queryRunner.manager.delete(OrderDetail, ...); await queryRunner.manager.delete(Order, ...)

// Drizzle:
import { eq } from 'drizzle-orm';
try {
  await db.transaction(async (tx) => {
    await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
    await tx.delete(orders).where(eq(orders.id, id));
  });
} catch (e) {
  console.error(e);
}
```

### Important Notes
- Numeric fields like `unitPrice` are strings in Drizzle (handles more precision than JavaScript numbers)
- Relational queries provide a higher-level API similar to Prisma's `include` and TypeORM's `relations`
- Core queries offer more control and support aggregations
- Both approaches are fully type-safe
- Response types are strictly typed based on selected fields

### getting_started
Setup guides and working examples for integrating Drizzle ORM with edge function platforms and database providers, plus a complete Next.js todo app tutorial.

## Edge Functions Integration

Tutorials for integrating Drizzle ORM with serverless edge function platforms.

**Netlify Edge Functions:**
- With Neon: Install drizzle-orm, drizzle-kit, dotenv. Create `import_map.json` with ESM imports. Configure `netlify.toml` with deno_import_map. Define schema in `netlify/edge-functions/common/schema.ts` using pgTable. Create `drizzle.config.ts` with postgresql dialect. Run `npx drizzle-kit push`. Connect via: `const sql = neon(Netlify.env.get("DATABASE_URL")!); const db = drizzle({ client: sql });`. Deploy with `netlify init`, `netlify env:import .env`, `netlify deploy --prod`.
- With Supabase: Use postgres-js client instead. Connect via: `const queryClient = postgres(Netlify.env.get("DATABASE_URL")!); const db = drizzle({ client: queryClient });`.

**Supabase Edge Functions:**
- Prerequisites: Supabase CLI, Docker Desktop. Schema in `src/schema.ts` using pgTable. Initialize: `supabase init`, `npx drizzle-kit generate`, `supabase start`, `supabase migration up`. Create function: `supabase functions new function-name`. Add `deno.json` with imports. Connect via: `const client = postgres(Deno.env.get("SUPABASE_DB_URL")!); const db = drizzle({ client });`. Use `{ prepare: false }` for Transaction pool mode. Local test: `supabase functions serve --no-verify-jwt`. Deploy: `supabase link --project-ref=<ID>`, `supabase db push`, `supabase secrets set DATABASE_URL=<URL>`, `supabase functions deploy function-name --no-verify-jwt`.

**Vercel Edge Functions:**
Requires edge-compatible drivers (no TCP). Choose driver by database:
- Neon/Vercel Postgres: @neondatabase/serverless/@vercel/postgres
- PlanetScale MySQL: @planetscale/database
- Turso SQLite: @libsql/client

Neon/Vercel Postgres: Schema in `src/db/schema.ts` using pgTable. Generate migrations: `npx drizzle-kit generate`, `npx drizzle-kit migrate` (or `push` for prototyping). Connect in `src/db/index.ts`: `import { drizzle } from 'drizzle-orm/neon-serverless'; export const db = drizzle(process.env.POSTGRES_URL!)`. For Vercel Postgres: `import { drizzle } from 'drizzle-orm/vercel-postgres'; export const db = drizzle()`. API route in `src/app/api/route.ts` with `export const runtime = 'edge'` and `export const dynamic = 'force-dynamic'`. Deploy: `vercel`, `vercel env add POSTGRES_URL`, `vercel`.

PlanetScale MySQL: Schema using mysqlTable. Connect: `import { drizzle } from "drizzle-orm/planetscale-serverless"; export const db = drizzle(process.env.MYSQL_URL!)`.

Turso SQLite: Schema using sqliteTable. Connect: `import { drizzle } from 'drizzle-orm/libsql'; export const db = drizzle({ connection: { url: process.env.TURSO_CONNECTION_URL!, authToken: process.env.TURSO_AUTH_TOKEN! }})`.

## Database Integrations

Complete setup guides for various database providers.

**Neon Postgres (neon-http):**
Install drizzle-orm, drizzle-kit, @neondatabase/serverless, dotenv. Create `.env` with `DATABASE_URL`. Create `src/db.ts`:
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

Define schema in `src/schema.ts` with pgTable, serial, text, integer, timestamp. Use `.references()` for foreign keys with `onDelete: 'cascade'`. Use `.$onUpdate(() => new Date())` for auto-updating timestamps. Infer types with `$inferInsert` and `$inferSelect`. Create `drizzle.config.ts` with dialect postgresql. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push` for prototyping.

Query examples: `db.insert(table).values(data)`, `db.select().from(table).where(eq(table.id, id))`, `db.update(table).set(data).where(eq(...))`, `db.delete(table).where(eq(...))`. Use `leftJoin()`, `groupBy()`, `count()`, `getTableColumns()` for aggregations and joins. Use `between()` and `sql` for date filtering.

**Nile Database (Multi-tenant):**
Install drizzle-orm, drizzle-kit, dotenv, node-postgres, express. Get connection string from Nile dashboard, add to `.env` as `NILEDB_URL`.

Create `src/db/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from "drizzle-orm";
import { AsyncLocalStorage } from "async_hooks";

export const db = drizzle(process.env.NILEDB_URL);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

Run `npx drizzle-kit pull` to introspect Nile's built-in tenants table. In Express, use middleware to extract tenant ID from URL and store in tenantContext: `app.use('/api/tenants/:tenantId/*', (req, res, next) => { tenantContext.run(req.params.tenantId, next); })`. Wrap all queries with `tenantDB()` to automatically set nile.tenant_id in transaction context—no explicit WHERE tenant_id needed. Nile handles data isolation at database level.

**Supabase (postgres-js):**
Install drizzle-orm, drizzle-kit, dotenv, postgres. Create Supabase project, get connection string with pooling enabled, add to `.env` as `DATABASE_URL`.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Schema and migrations same as Neon. Create `drizzle.config.ts` with dialect postgresql. Generate migrations with `npx drizzle-kit generate`, run with `npx drizzle-kit migrate`, or use Supabase CLI: `supabase init`, `supabase link`, `supabase db push`. Queries identical to Neon examples.

**Turso (SQLite via libSQL):**
Install drizzle-orm, drizzle-kit, dotenv, @libsql/client. Signup with `turso auth signup`, create database with `turso db create drizzle-turso-db`, create token with `turso db tokens create drizzle-turso-db`. Add to `.env`:
```
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=
```

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { config } from 'dotenv';

config({ path: '.env' });
export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```

Define schema with sqliteTable instead of pgTable. Use `integer('id').primaryKey()` instead of serial(). Use `text('created_at').default(sql`(CURRENT_TIMESTAMP)`)` for timestamps. Use `integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date())` for auto-update. Create `drizzle.config.ts` with dialect turso. For date filtering, use `gt(postsTable.createdAt, sql`(datetime('now','-24 hour'))`)` instead of between().

**Vercel Postgres:**
Install drizzle-orm, drizzle-kit, dotenv, @vercel/postgres. Add `POSTGRES_URL` to `.env.local` from Vercel dashboard.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });
export const db = drizzle();
```

Schema and migrations same as Neon/Supabase. Queries identical.

**Xata (PostgreSQL):**
Install drizzle-orm, drizzle-kit, dotenv, postgres. Create Xata database, get PostgreSQL connection string from dashboard, add to `.env` as `DATABASE_URL`.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Schema and migrations same as Supabase. Xata features: branch-based development for isolated environments, zero-downtime schema changes, data anonymization, AI-powered performance monitoring.

## Todo App with Neon Postgres

Complete Next.js todo app tutorial.

Install dependencies: drizzle-orm, drizzle-kit, @neondatabase/serverless, dotenv. Create `.env.local` with Neon connection string.

Create `src/db/drizzle.ts`:
```typescript
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: ".env" });
export const db = drizzle(process.env.DATABASE_URL!);
```

Create `src/db/schema.ts`:
```typescript
import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});
```

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Generate and run migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push`.

Create `src/actions/todoAction.ts` with "use server" directive:
```typescript
"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { todo } from "@/db/schema";

export const getData = async () => {
  const data = await db.select().from(todo);
  return data;
};

export const addTodo = async (id: number, text: string) => {
  await db.insert(todo).values({ id, text });
};

export const deleteTodo = async (id: number) => {
  await db.delete(todo).where(eq(todo.id, id));
  revalidatePath("/");
};

export const toggleTodo = async (id: number) => {
  await db.update(todo).set({ done: not(todo.done) }).where(eq(todo.id, id));
  revalidatePath("/");
};

export const editTodo = async (id: number, text: string) => {
  await db.update(todo).set({ text }).where(eq(todo.id, id));
  revalidatePath("/");
};
```

Create `src/types/todoType.ts`:
```typescript
export type todoType = {
  id: number;
  text: string;
  done: boolean;
};
```

Create `src/components/todo.tsx` (client component with edit/delete/toggle functionality):
```typescript
"use client";
import { ChangeEvent, FC, useState } from "react";
import { todoType } from "@/types/todoType";

interface Props {
  todo: todoType;
  changeTodoText: (id: number, text: string) => void;
  toggleIsTodoDone: (id: number, done: boolean) => void;
  deleteTodoItem: (id: number) => void;
}

const Todo: FC<Props> = ({
  todo,
  changeTodoText,
  toggleIsTodoDone,
  deleteTodoItem,
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [isDone, setIsDone] = useState(todo.done);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleIsDone = async () => {
    toggleIsTodoDone(todo.id, !isDone);
    setIsDone((prev) => !prev);
  };

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    changeTodoText(todo.id, text);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setText(todo.text);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodoItem(todo.id);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-gray-200 border-solid border rounded-lg">
      <input
        type="checkbox"
        className="text-blue-200 rounded-sm h-4 w-4"
        checked={isDone}
        onChange={handleIsDone}
      />
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        readOnly={!editing}
        className={`${
          todo.done ? "line-through" : ""
        } outline-none read-only:border-transparent focus:border border-gray-200 rounded px-2 py-1 w-full`}
      />
      <div className="flex gap-1 ml-auto">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-green-50 rounded px-2 w-14 py-1"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-400 text-blue-50 rounded w-14 px-2 py-1"
          >
            Edit
          </button>
        )}
        {editing ? (
          <button
            onClick={handleCancel}
            className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
          >
            Close
          </button>
        ) : (
          <button
            onClick={handleDelete}
            className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Todo;
```

Create `src/components/addTodo.tsx`:
```typescript
"use client";
import { ChangeEvent, FC, useState } from "react";

interface Props {
  createTodo: (value: string) => void;
}

const AddTodo: FC<Props> = ({ createTodo }) => {
  const [input, setInput] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAdd = async () => {
    createTodo(input);
    setInput("");
  };

  return (
    <div className="w-full flex gap-1 mt-2">
      <input
        type="text"
        className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
        onChange={handleInput}
        value={input}
      />
      <button
        className="flex items-center justify-center bg-green-600 text-green-50 rounded px-2 h-9 w-14 py-1"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

export default AddTodo;
```

Create `src/components/todos.tsx`:
```typescript
"use client";
import { FC, useState } from "react";
import { todoType } from "@/types/todoType";
import Todo from "./todo";
import AddTodo from "./addTodo";
import { addTodo, deleteTodo, editTodo, toggleTodo } from "@/actions/todoAction";

interface Props {
  todos: todoType[];
}

const Todos: FC<Props> = ({ todos }) => {
  const [todoItems, setTodoItems] = useState<todoType[]>(todos);

  const createTodo = (text: string) => {
    const id = (todoItems.at(-1)?.id || 0) + 1;
    addTodo(id, text);
    setTodoItems((prev) => [...prev, { id, text, done: false }]);
  };

  const changeTodoText = (id: number, text: string) => {
    setTodoItems((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
    editTodo(id, text);
  };

  const toggleIsTodoDone = (id: number) => {
    setTodoItems((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
    toggleTodo(id);
  };

  const deleteTodoItem = (id: number) => {
    setTodoItems((prev) => prev.filter((todo) => todo.id !== id));
    deleteTodo(id);
  };

  return (
    <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
      <div className="text-5xl font-medium">To-do app</div>
      <div className="w-full flex flex-col mt-8 gap-2">
        {todoItems.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            changeTodoText={changeTodoText}
            toggleIsTodoDone={toggleIsTodoDone}
            deleteTodoItem={deleteTodoItem}
          />
        ))}
      </div>
      <AddTodo createTodo={createTodo} />
    </main>
  );
};

export default Todos;
```

Update `src/app/page.tsx`:
```typescript
import { getData } from "@/actions/todoAction";
import Todos from "@/components/todos";

export default async function Home() {
  const data = await getData();
  return <Todos todos={data} />;
}
```



## Pages

### postgresql_extensions
PostgreSQL extensions: pg_vector for vector similarity search (vector columns, HNSW indexes, distance helper functions l2Distance/l1Distance/innerProduct/cosineDistance/hammingDistance/jaccardDistance); PostGIS for geospatial data (geometry columns with point type, tuple/xy modes, GIST indexes).

## pg_vector

Vector similarity search extension for PostgreSQL. Store vectors alongside relational data with support for exact and approximate nearest neighbor search, multiple vector types (single-precision, half-precision, binary, sparse), and distance metrics (L2, inner product, cosine, L1, Hamming, Jaccard).

**Column Types:**
```ts
const table = pgTable('table', {
    embedding: vector({ dimensions: 3 })
})
```

**Indexes:**
```ts
const table = pgTable('items', {
    embedding: vector({ dimensions: 3 })
}, (table) => [
  index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops')),
  index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops')),
  index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
  index('l1_index').using('hnsw', table.embedding.op('vector_l1_ops')),
  index('hamming_index').using('hnsw', table.embedding.op('bit_hamming_ops')),
  index('jaccard_index').using('hnsw', table.embedding.op('bit_jaccard_ops'))
])
```

**Helper Functions:**
```ts
import { l2Distance, l1Distance, innerProduct, cosineDistance, hammingDistance, jaccardDistance } from 'drizzle-orm'

l2Distance(table.column, [3, 1, 2]) // <->
l1Distance(table.column, [3, 1, 2]) // <+>
innerProduct(table.column, [3, 1, 2]) // <#>
cosineDistance(table.column, [3, 1, 2]) // <=>
hammingDistance(table.column, '101') // <~>
jaccardDistance(table.column, '101') // <%>
```

Custom distance functions can be created by replicating the pattern:
```ts
export function l2Distance(
  column: SQLWrapper | AnyColumn,
  value: number[] | string[] | TypedQueryBuilder<any> | string,
): SQL {
  if (is(value, TypedQueryBuilder<any>) || typeof value === 'string') {
    return sql`${column} <-> ${value}`;
  }
  return sql`${column} <-> ${JSON.stringify(value)}`;
}
```

**Query Examples:**
```ts
// Nearest neighbors
db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2])).limit(5)

// Distance calculation
db.select({ distance: l2Distance(items.embedding, [3,1,2]) }).from(items)

// Subquery distance
const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1));
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5)

// Computed distance
db.select({ innerProduct: sql`(${innerProduct(items.embedding, [3,1,2])}) * -1` }).from(items)
```

## PostGIS

Geospatial extension for PostgreSQL. Adds support for storing, indexing, and querying geographic data.

**Column Types:**
```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point' }),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' }),
  geoSrid: geometry('geo_options', { type: 'point', mode: 'xy', srid: 4000 }),
});
```

**Mode:** `tuple` (default, maps to [x,y]) or `xy` (maps to {x, y} object)

**Type:** Predefined `point` type available; any string can be used for other PostGIS types

**Indexes:**
```ts
const table = pgTable('table', {
  geo: geometry({ type: 'point' }),
}, (table) => [
  index('custom_idx').using('gist', table.geo)
])
```

Note: Use `extensionsFilters` in drizzle config to exclude PostGIS tables from introspect/push commands.

### arktype
Generate Arktype validation schemas from Drizzle ORM tables/views/enums with createSelectSchema, createInsertSchema, createUpdateSchema; supports refinements to extend/overwrite field schemas; comprehensive type mappings for all database types with range constraints.

## drizzle-arktype Plugin

Plugin for Drizzle ORM that generates Arktype schemas from Drizzle ORM schemas. Requires Drizzle ORM v0.36.0+, Arktype v2.0.0+.

### Select Schema
Validates data queried from the database (API responses).

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-arktype';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema(rows[0]); // validates all fields are present
```

Supports views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

### Insert Schema
Validates data to be inserted into the database (API requests).

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema(user); // validates required fields
await db.insert(users).values(parsed);
```

### Update Schema
Validates data to be updated in the database (API requests). Generated columns cannot be updated.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = userUpdateSchema(user); // all fields optional, generated columns rejected
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

### Refinements
Each create schema function accepts optional refinements parameter to extend, modify, or overwrite field schemas:

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // extends schema
  bio: (schema) => pipe(schema, maxLength(1000)), // extends before nullability
  preferences: object({ theme: string() }) // overwrites field including nullability
});
```

### Data Type Reference

Boolean: `pg.boolean()`, `mysql.boolean()`, `sqlite.integer({ mode: 'boolean' })` → `type.boolean`

Date: `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })`, `mysql.date({ mode: 'date' })`, `mysql.datetime({ mode: 'date' })`, `mysql.timestamp({ mode: 'date' })`, `sqlite.integer({ mode: 'timestamp' })`, `sqlite.integer({ mode: 'timestamp_ms' })` → `type.Date`

String: `pg.date({ mode: 'string' })`, `pg.timestamp({ mode: 'string' })`, `pg.cidr()`, `pg.inet()`, `pg.interval()`, `pg.macaddr()`, `pg.macaddr8()`, `pg.numeric()`, `pg.text()`, `pg.sparsevec()`, `pg.time()`, `mysql.binary()`, `mysql.date({ mode: 'string' })`, `mysql.datetime({ mode: 'string' })`, `mysql.decimal()`, `mysql.time()`, `mysql.timestamp({ mode: 'string' })`, `mysql.varbinary()`, `sqlite.numeric()`, `sqlite.text({ mode: 'text' })` → `type.string`

Bit: `pg.bit({ dimensions: ... })` → `type(/^[01]{${column.dimensions}}$/)`

UUID: `pg.uuid()` → `type(/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/iu)`

Char: `pg.char({ length: ... })`, `mysql.char({ length: ... })` → `type.string.exactlyLength(length)`

Varchar: `pg.varchar({ length: ... })`, `mysql.varchar({ length: ... })`, `sqlite.text({ mode: 'text', length: ... })` → `type.string.atMostLength(length)`

MySQL text variants: `mysql.tinytext()` → `type.string.atMostLength(255)`, `mysql.text()` → `type.string.atMostLength(65_535)`, `mysql.mediumtext()` → `type.string.atMostLength(16_777_215)`, `mysql.longtext()` → `type.string.atMostLength(4_294_967_295)`

Enum: `pg.text({ enum: ... })`, `pg.char({ enum: ... })`, `pg.varchar({ enum: ... })`, `mysql.tinytext({ enum: ... })`, `mysql.mediumtext({ enum: ... })`, `mysql.text({ enum: ... })`, `mysql.longtext({ enum: ... })`, `mysql.char({ enum: ... })`, `mysql.varchar({ enum: ... })`, `mysql.mysqlEnum(...)`, `sqlite.text({ mode: 'text', enum: ... })` → `type.enumerated(...enum)`

Integer types with ranges:
- `mysql.tinyint()` → `type.keywords.number.integer.atLeast(-128).atMost(127)`
- `mysql.tinyint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(255)`
- `pg.smallint()`, `pg.smallserial()`, `mysql.smallint()` → `type.keywords.number.integer.atLeast(-32_768).atMost(32_767)`
- `mysql.smallint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(65_535)`
- `pg.real()`, `mysql.float()` → `type.number.atLeast(-8_388_608).atMost(8_388_607)`
- `mysql.mediumint()` → `type.keywords.number.integer.atLeast(-8_388_608).atMost(8_388_607)`
- `mysql.float({ unsigned: true })` → `type.number.atLeast(0).atMost(16_777_215)`
- `mysql.mediumint({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(16_777_215)`
- `pg.integer()`, `pg.serial()`, `mysql.int()` → `type.keywords.number.integer.atLeast(-2_147_483_648).atMost(2_147_483_647)`
- `mysql.int({ unsigned: true })` → `type.keywords.number.integer.atLeast(0).atMost(4_294_967_295)`
- `pg.doublePrecision()`, `mysql.double()`, `mysql.real()`, `sqlite.real()` → `type.number.atLeast(-140_737_488_355_328).atMost(140_737_488_355_327)`
- `mysql.double({ unsigned: true })` → `type.number.atLeast(0).atMost(281_474_976_710_655)`
- `pg.bigint({ mode: 'number' })`, `pg.bigserial({ mode: 'number' })`, `mysql.bigint({ mode: 'number' })`, `mysql.bigserial({ mode: 'number' })`, `sqlite.integer({ mode: 'number' })` → `type.keywords.number.integer.atLeast(-9_007_199_254_740_991).atMost(9_007_199_254_740_991)`
- `mysql.serial()` → `type.keywords.number.integer.atLeast(0).atMost(9_007_199_254_740_991)`
- `pg.bigint({ mode: 'bigint' })`, `pg.bigserial({ mode: 'bigint' })`, `mysql.bigint({ mode: 'bigint' })`, `sqlite.blob({ mode: 'bigint' })` → `type.bigint.narrow(...)` with 64-bit limits
- `mysql.bigint({ mode: 'bigint', unsigned: true })` → `type.bigint.narrow(...)` with unsigned 64-bit limits

Year: `mysql.year()` → `type.keywords.number.integer.atLeast(1_901).atMost(2_155)`

Geometry point: `pg.geometry({ type: 'point', mode: 'tuple' })`, `pg.point({ mode: 'tuple' })` → `type([type.number, type.number])` or `pg.geometry({ type: 'point', mode: 'xy' })`, `pg.point({ mode: 'xy' })` → `type({ x: type.number, y: type.number })`

Vectors: `pg.halfvec({ dimensions: ... })`, `pg.vector({ dimensions: ... })` → `type.number.array().exactlyLength(dimensions)`

Line: `pg.line({ mode: 'abc' })` → `type({ a: type.number, b: type.number, c: type.number })` or `pg.line({ mode: 'tuple' })` → `type([type.number, type.number, type.number])`

JSON: `pg.json()`, `pg.jsonb()`, `mysql.json()`, `sqlite.blob({ mode: 'json' })`, `sqlite.text({ mode: 'json' })` → `type('string | number | boolean | null').or(type('unknown.any[] | Record<string, unknown.any>'))`

Buffer: `sqlite.blob({ mode: 'buffer' })` → `type.instanceOf(Buffer)`

Arrays: `pg.dataType().array(...)` → `baseDataTypeSchema.array().exactlyLength(size)`

### batch-api
Execute multiple SQL statements in a single transaction (all-or-nothing) for LibSQL, Neon, D1; returns tuple of results matching each statement.

## Batch API

Execute multiple SQL statements in a single database call with implicit transaction handling.

### Overview

Batch APIs are supported for LibSQL, Neon, and D1 drivers. A batch executes one or more SQL statements in order within an implicit transaction. If all statements succeed, the transaction commits. If any statement fails, the entire transaction rolls back.

**LibSQL**: Batch is an implicit transaction controlled by the backend.

**D1**: Batching reduces network latency by sending multiple statements in one call. Operates in auto-commit mode. Statements execute sequentially and non-concurrently. If any statement fails, the sequence aborts and rolls back.

### Usage

```ts
const batchResponse: BatchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
	db.query.usersTable.findMany({}),
	db.select().from(usersTable).where(eq(usersTable.id, 1)),
	db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
]);
```

The response is a tuple where each element corresponds to the result of each statement in the batch. Return types vary by driver:
- **libSQL**: `ResultSet` for mutations
- **Neon**: `NeonHttpQueryResult` for mutations
- **D1**: `D1Result` for mutations

### Supported Builders

All query builders can be used in `db.batch()`:
- `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.execute()`
- `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`
- `db.select()`, `db.update()`, `db.delete()`, `db.insert()`

### cache
Opt-in query caching with Upstash Redis or custom implementation; explicit strategy by default, global caching optional; manual invalidation by tables or tags; doesn't support raw queries, batch, transactions, relational queries, or certain drivers.

## Overview
Drizzle sends every query to the database by default with no automatic caching. Caching is opt-in using an `explicit` strategy (`global: false`) by default, or can be enabled globally with `global: true`.

## Upstash Integration

Quick setup with automatic environment variable configuration:
```ts
import { upstashCache } from "drizzle-orm/cache/upstash";
const db = drizzle(process.env.DB_URL!, { cache: upstashCache() });
```

With explicit credentials and options:
```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({
    url: '<UPSTASH_URL>',
    token: '<UPSTASH_TOKEN>',
    global: true,  // cache all queries by default
    config: { ex: 60 }  // 60 second TTL
  })
});
```

## Cache Config
```ts
type CacheConfig = {
  ex?: number;  // expiration in seconds
  hexOptions?: "NX" | "nx" | "XX" | "xx" | "GT" | "gt" | "LT" | "lt";  // HEXPIRE options
};
```

## Usage Examples

**With `global: false` (default, opt-in):**
```ts
const db = drizzle(process.env.DB_URL!, { cache: upstashCache({ url: "", token: "" }) });

// Won't use cache
const res = await db.select().from(users);

// Use cache with .$withCache()
const res = await db.select().from(users).$withCache();

// Options for .$withCache()
.$withCache({ config: { ex: 60 } })  // custom TTL
.$withCache({ tag: 'custom_key' })  // custom cache key
.$withCache({ autoInvalidate: false })  // disable auto-invalidation for eventual consistency

// Mutations still trigger cache invalidation
await db.insert(users).value({ email: "test@example.com" });
```

**With `global: true`:**
```ts
const db = drizzle(process.env.DB_URL!, { cache: upstashCache({ url: "", token: "", global: true }) });

// All queries use cache by default
const res = await db.select().from(users);

// Disable cache for specific query
const res = await db.select().from(users).$withCache(false);

// Manual invalidation
await db.$cache.invalidate({ tables: users });
await db.$cache.invalidate({ tables: [users, posts] });
await db.$cache.invalidate({ tables: "usersTable" });
await db.$cache.invalidate({ tags: "custom_key" });
```

## Custom Cache Implementation

Extend the `Cache` class with `strategy()`, `get()`, `put()`, and `onMutate()` methods:
```ts
import Keyv from "keyv";

export class TestGlobalCache extends Cache {
  private globalTtl: number = 1000;
  private usedTablesPerKey: Record<string, string[]> = {};

  constructor(private kv: Keyv = new Keyv()) {
    super();
  }

  override strategy(): "explicit" | "all" {
    return "all";  // or "explicit"
  }

  override async get(key: string): Promise<any[] | undefined> {
    return (await this.kv.get(key)) ?? undefined;
  }

  override async put(
    key: string,
    response: any,
    tables: string[],
    config?: CacheConfig,
  ): Promise<void> {
    const ttl = config?.px ?? (config?.ex ? config.ex * 1000 : this.globalTtl);
    await this.kv.set(key, response, ttl);
    for (const table of tables) {
      const keys = this.usedTablesPerKey[table];
      if (keys === undefined) {
        this.usedTablesPerKey[table] = [key];
      } else {
        keys.push(key);
      }
    }
  }

  override async onMutate(params: {
    tags: string | string[];
    tables: string | string[] | Table<any> | Table<any>[];
  }): Promise<void> {
    const tagsArray = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tablesArray = Array.isArray(params.tables) ? params.tables : params.tables ? [params.tables] : [];
    const keysToDelete = new Set<string>();

    for (const table of tablesArray) {
      const tableName = is(table, Table) ? getTableName(table) : (table as string);
      const keys = this.usedTablesPerKey[tableName] ?? [];
      for (const key of keys) keysToDelete.add(key);
    }

    for (const tag of tagsArray) {
      await this.kv.delete(tag);
    }
    for (const key of keysToDelete) {
      await this.kv.delete(key);
    }
  }
}

const db = drizzle(process.env.DB_URL!, { cache: new TestGlobalCache() });
```

## Limitations

**Not supported:**
- Raw queries: `db.execute(sql\`select 1\`)`
- Batch operations in d1 and libsql
- Transactions
- Relational queries: `db.query.users.findMany()`
- better-sqlite3, Durable Objects, expo sqlite
- AWS Data API drivers
- Views

### connect-aws-data-api-pg
Connect Drizzle to AWS RDS Aurora PostgreSQL via Data API using database, secretArn, and resourceArn credentials.

## AWS Data API Postgres Connection

Connect Drizzle ORM to AWS RDS Aurora PostgreSQL using AWS Data API.

**Prerequisites:**
- Database connection basics with Drizzle
- AWS Data API (Aurora RDS)
- AWS SDK v3

**Installation:**
```
npm install drizzle-orm @aws-sdk/client-rds-data
npm install -D drizzle-kit
```

**Setup - Option 1 (Auto-create client):**
```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';

const db = drizzle({ 
  connection: {
    database: process.env['DATABASE']!,
    secretArn: process.env['SECRET_ARN']!,
    resourceArn: process.env['RESOURCE_ARN']!,
  }
});

await db.select().from(...);
```

**Setup - Option 2 (Provide existing RDSDataClient):**
```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { RDSDataClient } from '@aws-sdk/client-rds-data';

const rdsClient = new RDSDataClient({ region: 'us-east-1' });

const db = drizzle(rdsClient, {
  database: process.env['DATABASE']!,
  secretArn: process.env['SECRET_ARN']!,
  resourceArn: process.env['RESOURCE_ARN']!,
});

await db.select().from(...);
```

Three required connection properties: `database`, `secretArn`, `resourceArn`. Additional RDSDataClient properties can be specified in the connection object.

### connect-bun-sql
Drizzle ORM integration with Bun SQL for PostgreSQL: install drizzle-orm, initialize with DATABASE_URL or existing SQL client, use standard Drizzle query API.

## Bun SQL Integration

Drizzle ORM natively supports Bun's SQL module for PostgreSQL database connections.

**Prerequisites:**
- Database connection basics with Drizzle
- Bun runtime (fast all-in-one JavaScript runtime)
- Bun SQL - native PostgreSQL bindings

**Installation:**
```
npm install drizzle-orm
npm install -D drizzle-kit
```

**Basic usage - auto-initialize driver:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';

const db = drizzle(process.env.DATABASE_URL);
const result = await db.select().from(...);
```

**With existing driver:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });
```

Bun SQL integration is noted as "crazy fast".

### connect-bun-sqlite
Native bun:sqlite support with both async and sync APIs; initialize with drizzle() and optionally pass Database client; sync methods mirror SQLite: all, get, values, run.

## Bun SQLite Integration

Drizzle ORM natively supports the `bun:sqlite` module with both async and sync APIs.

### Installation
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Basic Setup
Initialize with default driver:
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
const db = drizzle();
const result = await db.select().from(...);
```

Or provide an existing Bun SQLite driver:
```typescript
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
```

### Async API
```typescript
const result = await db.select().from(users);
```

### Sync API
For synchronous operations, use the following methods:
```typescript
const result = db.select().from(users).all();
const result = db.select().from(users).get();
const result = db.select().from(users).values();
const result = db.select().from(users).run();
```

The sync API mirrors popular SQLite methods: `all`, `get`, `values`, and `run`.

### connect-cloudflare-d1
Connect Drizzle ORM to Cloudflare D1: install packages, configure wrangler.json with D1 binding (database_name, database_id, migrations_dir), initialize with drizzle(env.BINDING_NAME), use standard Drizzle queries.

## Cloudflare D1 Integration

D1 is Cloudflare's queryable relational database. Drizzle ORM fully supports D1 and Cloudflare Workers environment with SQLite-like query methods (`all`, `get`, `values`, `run`).

### Installation
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Configuration
Create `wrangler.json` or `wrangler.toml` with D1 database binding:

**wrangler.json:**
```json
{
    "name": "YOUR_PROJECT_NAME",
    "main": "src/index.ts",
    "compatibility_date": "2024-09-26",
    "compatibility_flags": ["nodejs_compat"],
    "d1_databases": [{
        "binding": "BINDING_NAME",
        "database_name": "YOUR_DB_NAME",
        "database_id": "YOUR_DB_ID",
        "migrations_dir": "drizzle/migrations"
    }]
}
```

**wrangler.toml:**
```toml
name = "YOUR_PROJECT_NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "BINDING_NAME"
database_name = "YOUR_DB_NAME"
database_id = "YOUR_DB_ID"
migrations_dir = "drizzle/migrations"
```

### Usage
```typescript
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
    const result = await db.select().from(users).all();
    return Response.json(result);
  },
};
```

Initialize driver with `drizzle(env.<BINDING_NAME>)` and use standard Drizzle query syntax.

### connect-cloudflare-do
Setup Drizzle with Cloudflare Durable Objects SQLite: configure wrangler.toml bindings/migrations, initialize db with drizzle(storage) in DurableObject constructor, run migrations before accepting queries, bundle operations for performance.

## Cloudflare Durable Objects SQLite Setup

Drizzle ORM fully supports Cloudflare Durable Objects SQLite databases in Cloudflare Workers environment.

### Prerequisites
- Database connection basics with Drizzle
- Cloudflare SQLite Durable Objects - SQLite database embedded within a Durable Object

### Installation
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Configuration

Create `wrangler.toml` with Durable Object bindings and migrations:
```toml
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

[[durable_objects.bindings]]
name = "MY_DURABLE_OBJECT"
class_name = "MyDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyDurableObject"]

[[rules]] 
type = "Text"
globs = ["**/*.sql"]
fallthrough = true
```

### Usage

Initialize driver and create Durable Object class:
```typescript
import { drizzle, DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { usersTable } from './db/schema';

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase<any>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });

		ctx.blockConcurrencyWhile(async () => {
			await migrate(this.db, migrations);
		});
	}

	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
		return this.db.select().from(usersTable);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const id = env.MY_DURABLE_OBJECT.idFromName('durable-object');
		const stub = env.MY_DURABLE_OBJECT.get(id);

		const users = await stub.insertAndList({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});
		return Response.json(users);
	}
}
```

### Performance Notes
- Bundle all database interactions within a single Durable Object call for maximum performance
- Each individual query call is a round-trip to the Durable Object instance
- Run migrations during initialization with `blockConcurrencyWhile()` to prevent concurrent access before migrations complete

### http-proxy-driver
HTTP proxy driver for Drizzle: async callback sends SQL queries to HTTP server, server executes on database and returns raw rows; supports PostgreSQL, MySQL, SQLite with batch support.

## HTTP Proxy Driver

Drizzle Proxy allows implementing custom driver communication with databases. The HTTP proxy pattern sends queries from Drizzle ORM to an HTTP server, which executes them on the database and returns raw data for Drizzle to map.

### How It Works

1. Drizzle ORM builds a query
2. HTTP Proxy Driver sends the built query to an HTTP server
3. Server executes the query on the database
4. Server returns raw results back to the proxy
5. Drizzle maps the data and returns results

### Callback Function Pattern

Drizzle supports an async callback function for executing SQL:

```typescript
import { drizzle } from 'drizzle-orm/pg-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

**Parameters:**
- `sql`: Query string with placeholders
- `params`: Array of parameters
- `method`: One of `run`, `all`, `values`, or `get` depending on the SQL statement

**Return value:** Must be `{rows: string[][]}` or `{rows: string[]}` (use `string[]` when method is `get`)

### Server Implementation Example (PostgreSQL)

```ts
import { Client } from 'pg';
import express from 'express';

const app = express();
app.use(express.json());
const client = new Client('postgres://postgres:postgres@localhost:5432/postgres');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, ''); // prevent multiple queries

  try {
    const result = await client.query({
      text: sqlBody,
      values: params,
      rowMode: method === 'all' ? 'array': undefined,
    });
    res.send(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### MySQL Implementation

```ts
import * as mysql from 'mysql2/promise';
import express from 'express';

const app = express();
app.use(express.json());
const connection = await mysql.createConnection('mysql://root:mysql@127.0.0.1:5432/drizzle');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result = await connection.query({
      sql: sqlBody,
      values: params,
      rowsAsArray: method === 'all',
      typeCast: function(field: any, next: any) {
        if (field.type === 'TIMESTAMP' || field.type === 'DATETIME' || field.type === 'DATE') {
          return field.string();
        }
        return next();
      },
    });
    if (method === 'all') {
      res.send(result[0]);
    } else if (method === 'execute') {
      res.send(result);
    }
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### SQLite with Batch Support

```typescript
import { drizzle } from 'drizzle-orm/sqlite-proxy';

type ResponseType = { rows: any[][] | any[] }[];

const db = drizzle(
  async (sql, params, method) => {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  },
  async (queries: { sql: string, params: any[], method: 'all' | 'run' | 'get' | 'values'}[]) => {
    const result: ResponseType = await axios.post('http://localhost:3000/batch', { queries });
    return result;
  }
);
```

Batch response must be an array of raw values in the same order as sent queries.

### Table Declaration Example

```typescript
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

const users = sqliteTable('users', {
  id: text('id'),
  textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
  intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
});
```

### expo-sqlite
Native Expo SQLite driver with live queries, Drizzle Kit migrations, and Studio support; requires babel plugin for SQL bundling and useMigrations hook for app startup.

## Expo SQLite Integration

Drizzle ORM provides native support for Expo SQLite with:
- Native ORM driver for Expo SQLite
- Drizzle Kit support for migration generation and bundling
- Drizzle Studio dev tools plugin for on-device database browsing
- Live Queries support

### Installation
```
npm install drizzle-orm expo-sqlite@next
npm install -D drizzle-kit
```

### Basic Usage
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
await db.select().from(users);
```

### Live Queries
Use `useLiveQuery` hook to make queries reactive with automatic re-renders on data changes:
```ts
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);

const App = () => {
  const { data } = useLiveQuery(db.select().from(schema.users));
  return <Text>{JSON.stringify(data)}</Text>;
};
```

### Migrations Setup
1. Install babel plugin for bundling SQL files:
```
npm install babel-plugin-inline-import
```

2. Update configuration files:
```js
// babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

```js
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo'
});
```

3. Generate migrations:
```bash
npx drizzle-kit generate
```

4. Run migrations in app:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  
  return ...your application component;
}
```

### connect-neon
Connect to Neon serverless Postgres via neon-http (single queries) or neon-websockets (sessions); supports node-postgres and postgres.js drivers for serverful Node.js.

## Neon Postgres Connection

Drizzle has native support for Neon serverless database connections using `neon-http` and `neon-websockets` drivers, which wrap the neon-serverless driver. HTTP is faster for single non-interactive transactions; WebSockets support session and interactive transactions.

### Installation
```
drizzle-orm @neondatabase/serverless
-D drizzle-kit
```

### Neon HTTP
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

Or with existing driver:
```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });
```

### Neon WebSockets
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
const db = drizzle(process.env.DATABASE_URL);
```

For Node.js (requires `ws` and `bufferutil` packages):
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
const db = drizzle({ connection: process.env.DATABASE_URL, ws: ws });
```

Or with existing Pool:
```typescript
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

For Node.js with Pool:
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### node-postgres
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### postgres.js
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
```

For serverful Node.js environments, use PostgresJS driver as described in Neon's official Node.js docs. For Cloudflare Workers example, see Drizzle's Neon Cloudflare Worker example.

### connect-nile
Setup Drizzle with Nile (multi-tenant PostgreSQL) using node-postgres driver; isolate tenant queries via transaction-scoped `nile.tenant_id` context variable or AsyncLocalStorage middleware.

## Nile Integration

Nile is PostgreSQL re-engineered for multi-tenant apps. Use any Drizzle PostgreSQL driver (e.g., node-postgres).

### Installation
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Basic Setup
```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
const db = drizzle(process.env.NILEDB_URL);
const response = await db.select().from(...);
```

Or with existing driver:
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Virtual Tenant Databases

Nile provides virtual tenant databases. Set tenant context via transaction to isolate queries to that tenant:

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';

const db = drizzle(process.env.NILEDB_URL);

function tenantDB<T>(tenantId: string, cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}

const tenantId = '01943e56-16df-754f-a7b6-6234c368b400'
const response = await tenantDB(tenantId, async (tx) => {
    return await tx.select().from(todosTable);
});
```

### AsyncLocalStorage Pattern

For web frameworks supporting AsyncLocalStorage, populate tenant ID via middleware:

```typescript
import { AsyncLocalStorage } from "async_hooks";

export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

Middleware setup:
```typescript
app.use("/api/tenants/:tenantId/*", async (c, next) => {
  const tenantId = c.req.param("tenantId");
  return tenantContext.run(tenantId, () => next());
});

app.get("/api/tenants/:tenantId/todos", async (c) => {
    const todos = await tenantDB(async (tx) => {
      return await tx.select({...}).from(todoSchema);
    });
    return c.json(todos);
});
```

### op-sqlite-setup
OP SQLite integration: install packages, open database, create drizzle instance; for Expo/React Native requires babel plugin, config updates, and useMigrations hook for bundled SQL migrations.

## OP SQLite Integration

OP-SQLite embeds the latest SQLite version and provides a low-level API for SQL queries.

### Installation
```
npm install drizzle-orm @op-engineering/op-sqlite -D drizzle-kit
```

### Basic Usage
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);
await db.select().from(users);
```

### Migrations Setup (Expo/React Native)

OP SQLite requires SQL migrations bundled into the app. Use Drizzle Kit for generation.

1. **Install babel plugin** to inline SQL files:
```
npm install babel-plugin-inline-import
```

2. **Update config files**:
```js
// babel.config.js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [['inline-import', { extensions: ['.sql'] }]],
};
```

```js
// metro.config.js
const { getDefaultConfig } = require('@react-native/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
});
```

3. **Generate migrations**:
```bash
npx drizzle-kit generate
```

4. **Run migrations in app**:
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const opsqliteDb = open({ name: 'myDB' });
const db = drizzle(opsqliteDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  
  return ...your application component;
}
```

### database-connection-overview
Drizzle connects to databases via drivers; instantiate with drizzle(connectionString) or drizzle({client}); supports PostgreSQL, MySQL, SQLite across multiple providers and serverless runtimes.

## Database Connection with Drizzle

Drizzle ORM executes SQL queries through database drivers. The ORM creates a database instance that translates high-level queries into SQL and communicates with the database via the driver.

### Basic Connection

```ts
import { drizzle } from "drizzle-orm/node-postgres"
import { users } from "./schema"

const db = drizzle(process.env.DATABASE_URL);
const usersCount = await db.$count(users);
```

The query `db.$count(users)` translates to `select count(*) from users` and is executed through the node-postgres driver, returning `[{ count: 0 }]`.

### Accessing the Driver Client

Drizzle creates a driver instance internally, accessible via `db.$client`:

```ts
const db = drizzle(process.env.DATABASE_URL);
const pool = db.$client;

// Equivalent to manually creating:
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### Edge and Serverless Runtimes

Drizzle supports multiple serverless database drivers:

```ts
// Neon HTTP
import { drizzle } from "drizzle-orm/neon-http";
const db = drizzle(process.env.DATABASE_URL);

// Neon with websockets
import { drizzle } from "drizzle-orm/neon-serverless";
const db = drizzle(process.env.DATABASE_URL);

// Vercel Postgres
import { drizzle } from "drizzle-orm/vercel-postgres";
const db = drizzle();

// PlanetScale HTTP
import { drizzle } from "drizzle-orm/planetscale";
const db = drizzle(process.env.DATABASE_URL);

// Cloudflare D1
import { drizzle } from "drizzle-orm/d1";
const db = drizzle({ connection: env.DB });
```

### Runtime-Specific Drivers

```ts
// Bun SQLite
import { drizzle } from "drizzle-orm/bun-sqlite"
const db = drizzle(); // in-memory
const db = drizzle("./sqlite.db");

// Expo SQLite
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
const expo = openDatabaseSync("db.db");
const db = drizzle(expo);
```

### Database Connection URL Format

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
             └──┘ └───────┘ └─────────────────────────────────────────────┘ └────┘
              ʌ    ʌ          ʌ                                              ʌ
        role -│    │          │- hostname                                    │- database
                   │
                   │- password
```

### Available Drivers

PostgreSQL: PostgreSQL, Neon, Vercel Postgres, Supabase, Xata, PGLite
MySQL: MySQL, PlanetScale, TiDB
SQLite: SQLite, Turso Cloud, Turso Database, Cloudflare D1, Bun SQLite, SQLite Cloud
Native SQLite: Expo SQLite, OP SQLite, React Native SQLite
Others: Drizzle Proxy

### connect-pglite
PGlite: WASM Postgres for browser/Node.js/Bun (2.6mb), supports in-memory or persistent storage; initialize with drizzle() for in-memory, drizzle('path') for file persistence, or drizzle({ connection: { dataDir } }) for advanced config.

## PGlite Integration

PGlite is a WASM Postgres build packaged as a TypeScript client library that runs Postgres in the browser, Node.js, and Bun without external dependencies. It's 2.6mb gzipped and uses native WASM instead of a Linux VM. Supports ephemeral in-memory databases or persistence to the file system (Node/Bun) or indexedDB (Browser).

### Installation

```
npm install drizzle-orm @electric-sql/pglite
npm install -D drizzle-kit
```

### Usage

In-memory database:
```typescript
import { drizzle } from 'drizzle-orm/pglite';
const db = drizzle();
await db.select().from(...);
```

With file system persistence:
```typescript
const db = drizzle('path-to-dir');
```

With advanced configuration:
```typescript
const db = drizzle({ connection: { dataDir: 'path-to-dir' }});
```

Using an existing PGlite client:
```typescript
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';

const client = new PGlite();
const db = drizzle({ client });
await db.select().from(users);
```

### connect-planetscale
HTTP access to PlanetScale serverless MySQL via drizzle-orm/planetscale-serverless; initialize with credentials or existing Client instance.

## PlanetScale Integration

PlanetScale is a serverless MySQL platform. Drizzle ORM provides HTTP access to PlanetScale via the `drizzle-orm/planetscale-serverless` package (using PlanetScale's `database-js` driver), suitable for both serverless and traditional environments. TCP access via `mysql2` driver is also available.

### Installation
```
npm install drizzle-orm @planetscale/database
npm install -D drizzle-kit
```

### Basic Usage
Initialize with connection credentials:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";

const db = drizzle({ connection: {
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
}});

const response = await db.select().from(...)
```

Or provide an existing PlanetScale client:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle({ client });
```

### connect-prisma-postgres
Connect Drizzle to Prisma Postgres serverless database using node-postgres or postgres.js driver with connection string.

## Connecting to Prisma Postgres

Prisma Postgres is a serverless PostgreSQL database built on unikernels with a large free tier, operation-based pricing, and no cold starts.

### Installation

Choose between two PostgreSQL drivers:

**node-postgres (pg):**
```bash
npm install drizzle-orm pg
npm install -D drizzle-kit
```

**postgres.js:**
```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Setup and Query

**Using node-postgres:**
```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle({ client: pool });
const result = await db.execute('select 1');
```

**Using postgres.js:**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
const result = await db.execute('select 1');
```

### Notes

- Prisma Postgres also offers a serverless driver that will be supported in Drizzle ORM in the future
- Prerequisites: familiarity with database connection basics, Prisma Postgres account, and PostgreSQL drivers documentation

### react-native-sqlite-setup
Use Expo SQLite for React Native; react-native-sqlite-storage lacks Hermes support.

To use Drizzle ORM with React Native, use Expo SQLite. The popular react-native-sqlite-storage library does not support the Hermes JavaScript runtime, which is now the standard runtime for React Native and Expo out of the box.

### connect-sqlite-cloud
Connect to SQLite Cloud: install packages, initialize drizzle with connection string or Database client, execute queries.

## SQLite Cloud Integration

SQLite Cloud is a managed, distributed relational database system built on SQLite.

### Installation
```
drizzle-orm@beta @sqlitecloud/drivers
-D drizzle-kit@beta
```

### Basic Usage
Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/sqlite-cloud';
const db = drizzle(process.env.SQLITE_CLOUD_CONNECTION_STRING);
const result = await db.execute('select 1');
```

Or provide your own driver instance:
```typescript
import { Database } from '@sqlitecloud/drivers';
import { drizzle } from 'drizzle-orm/sqlite-cloud';

const client = new Database(process.env.SQLITE_CLOUD_CONNECTION_STRING!);
const db = drizzle({ client });
const result = await db.execute('select 1');
```

Two initialization patterns: pass connection string directly to `drizzle()`, or instantiate `Database` client first and pass it via `{ client }` option.

### connect-supabase
Connect Drizzle to Supabase Postgres: install drizzle-orm/postgres, initialize with DATABASE_URL or existing client, disable prepare statements for transaction pool mode.

## Supabase Integration

Supabase is an open source Firebase alternative for building secure and performant Postgres backends with minimal configuration.

### Installation

```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Basic Setup

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

### With Existing Driver

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

### Connection Pooling Configuration

When using Supabase's connection pooler in "Transaction" pool mode, disable prepared statements:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL, { prepare: false })
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

Use the Connection Pooler for serverless environments and Direct Connection for long-running servers.

### connect-tidb-serverless
Connect to TiDB Serverless using drizzle-orm/tidb-serverless package with HTTP driver; initialize with URL or custom client instance.

## TiDB Serverless Integration

TiDB Serverless is a fully-managed, autonomous DBaaS with split-second cluster provisioning and consumption-based pricing. It's compatible with MySQL and provides an HTTP driver for edge environments, natively supported by Drizzle ORM.

### Installation

```
npm install drizzle-orm @tidbcloud/serverless
npm install -D drizzle-kit
```

### Basic Setup

Initialize with connection URL:
```typescript
import { drizzle } from 'drizzle-orm/tidb-serverless';

const db = drizzle({ connection: { url: process.env.TIDB_URL }});
const response = await db.select().from(...);
```

Or provide your own driver instance:
```typescript
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';

const client = connect({ url: process.env.TIDB_URL });
const db = drizzle({ client });
```

### Prerequisites
- Database connection basics with Drizzle
- TiDB database account
- TiDB HTTP Driver
- Drizzle MySQL drivers knowledge

### connect-turso-database
Connect Turso database to Drizzle ORM via direct path or existing driver instance.

## Turso Database Integration

Turso is a small database designed for the AI age. To connect Drizzle ORM to Turso:

**Installation:**
```
npm install drizzle-orm@beta @tursodatabase/database
npm install -D drizzle-kit@beta
```

**Basic usage - direct connection:**
```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
const db = drizzle('sqlite.db');
const result = await db.execute('select 1');
```

**Using existing driver instance:**
```typescript
import { Database } from '@tursodatabase/drivers';
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const client = new Database('sqlite.db');
const db = drizzle({ client });
const result = await db.execute('select 1');
```

Prerequisites: familiarity with database connection basics in Drizzle, and knowledge of Turso Database and its JavaScript driver.

### connect-turso
Connect Drizzle to Turso Cloud (libSQL edge SQLite) via @libsql/client driver with URL and auth token.

## Turso Cloud Integration

Turso is a libSQL-powered edge SQLite database as a service. Drizzle ORM natively supports the libSQL driver.

### Installation
```
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

### Driver Initialization
Drizzle supports all `@libsql/client` driver variations. Initialize with:

**Node.js:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

**Web:**
```typescript
import { drizzle } from 'drizzle-orm/libsql/web';
import { createClient } from '@libsql/client/web';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

Alternatively, pass connection config directly:
```typescript
const db = drizzle({ connection: {
  url: process.env.DATABASE_URL, 
  authToken: process.env.DATABASE_AUTH_TOKEN 
}});
```

### Querying
```typescript
import * as s from 'drizzle-orm/sqlite-core';

const users = s.sqliteTable("users", {
  id: s.integer(),
  name: s.text(),
});

const result = await db.select().from(users);
```

Drizzle mirrors SQLite query methods: `all()`, `get()`, `values()`, `run()`.

### connect-vercel-postgres
Connect Drizzle to Vercel Postgres using @vercel/postgres driver (serverless-compatible) or postgres/pg drivers (serverful); initialize with drizzle() and execute queries.

## Vercel Postgres Integration

Vercel Postgres is a serverless SQL database designed to integrate with Vercel Functions. Drizzle ORM natively supports both the `@vercel/postgres` serverless driver and standard PostgreSQL drivers (`postgres` or `pg`) for accessing Vercel Postgres.

### Installation

```
drizzle-orm @vercel/postgres
-D drizzle-kit
```

### Setup

1. Set up a Vercel Postgres project according to official Vercel docs
2. Initialize the driver and execute queries

### Usage

With default client:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
const result = await db.execute('select 1');
```

With existing driver:
```typescript
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle({ client: sql });
const result = await db.execute('select 1');
```

### Key Features

- `@vercel/postgres` works in both serverful and serverless environments (including Cloudflare Workers) via websockets
- For serverful environments, can use `@vercel/postgres` or direct `postgresql://` connection with `postgres` or `pg` drivers

### connect-xata
PostgreSQL platform integration: install drizzle-orm postgres, initialize with DATABASE_URL or existing postgres client via drizzle-orm/postgres-js.

## Xata Integration

Xata is a PostgreSQL database platform with features like instant copy-on-write branches, zero-downtime schema changes, data anonymization, and AI-powered performance monitoring.

### Setup

Install packages:
```
drizzle-orm postgres
-D drizzle-kit
```

Initialize driver and query:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

Or with existing postgres driver:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

### custom-types
Define custom database column types with `customType<{data, driverData?, config?}>({dataType, toDriver?, fromDriver?})` for type-safe database abstraction with value mapping.

## Defining Custom Types

Custom types in Drizzle ORM are created using the `customType` function, which allows you to define database-specific data types with TypeScript type safety.

### Core Concept

The `customType` function accepts a generic type parameter with the following properties:
- `data`: The TypeScript type for the column (e.g., `string`, `number`, `Date`)
- `driverData`: (optional) The type the database driver uses internally
- `config`: (optional) Configuration object type for the data type definition
- `notNull`: (optional) Whether the type is not null by default
- `default`: (optional) Whether the type has a default value

### CustomTypeParams Interface

The function receives a configuration object with:
- `dataType(config?)`: Returns the SQL data type string (e.g., `'text'`, `'serial'`, `'varchar(256)'`)
- `toDriver(value)`: (optional) Maps TypeScript value to driver format
- `fromDriver(value)`: (optional) Maps driver value back to TypeScript format

### Postgres Examples

**Serial**
```typescript
import { customType } from 'drizzle-orm/pg-core';

const customSerial = customType<{ data: number; notNull: true; default: true }>({
  dataType() { return 'serial'; },
});
```

**Text**
```typescript
const customText = customType<{ data: string }>({
  dataType() { return 'text'; },
});
```

**Boolean**
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; },
});
```

**JSONB with generic type**
```typescript
const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'jsonb'; },
    toDriver(value: TData): string { return JSON.stringify(value); },
  })(name);
```

**Timestamp with config**
```typescript
const customTimestamp = customType<{
  data: Date;
  driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision = typeof config.precision !== 'undefined' ? ` (${config.precision})` : '';
    return `timestamp${precision}${config.withTimezone ? ' with time zone' : ''}`;
  },
  fromDriver(value: string): Date { return new Date(value); },
});
```

### MySQL Examples

**Int**
```typescript
import { customType } from 'drizzle-orm/mysql-core';

const customInt = customType<{ data: number; notNull: false; default: false }>({
  dataType() { return 'int'; },
});
```

**Text** (same as Postgres)

**Boolean with driver mapping**
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; },
  fromDriver(value) { return typeof value === 'boolean' ? value : value === 1; },
});
```

**JSON with generic type**
```typescript
const customJson = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'json'; },
    toDriver(value: TData): string { return JSON.stringify(value); },
  })(name);
```

**Timestamp with fsp config**
```typescript
const customTimestamp = customType<{
  data: Date;
  driverData: string;
  config: { fsp: number };
}>({
  dataType(config) {
    const precision = typeof config.fsp !== 'undefined' ? ` (${config.fsp})` : '';
    return `timestamp${precision}`;
  },
  fromDriver(value: string): Date { return new Date(value); },
});
```

### Usage in Table Definition

```typescript
// Postgres
const usersTable = pgTable('users', {
  id: customSerial('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJsonb<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
});

// MySQL
const usersTable = mysqlTable('userstest', {
  id: customInt('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJson<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { fsp: 2 }).notNull().default(sql`now()`),
});
```

Custom types are used identically to built-in Drizzle ORM types once defined.

### queries-and-crud
Two query approaches: SQL-like syntax (select/insert/update/delete mirroring SQL) and Relational Queries API (nested data fetching); both support advanced composition with independent filters and subqueries.

## SQL-like Syntax

Drizzle provides SQL-like query syntax that mirrors standard SQL, minimizing learning curve. You write queries that look like SQL and know exactly what SQL will be generated.

**Select with joins:**
```typescript
await db
  .select()
  .from(posts)
  .leftJoin(comments, eq(posts.id, comments.post_id))
  .where(eq(posts.id, 10))
```

**Insert:**
```typescript
await db.insert(users).values({ email: 'user@gmail.com' })
```

**Update:**
```typescript
await db.update(users)
  .set({ email: 'user@gmail.com' })
  .where(eq(users.id, 1))
```

**Delete:**
```typescript
await db.delete(users).where(eq(users.id, 1))
```

Supports select, insert, update, delete, aliases, WITH clauses, subqueries, and prepared statements.

## Relational Queries API

For common scenarios with nested/relational data, use the Queries API for more convenient and performant fetching without manual joins or data mapping. Always outputs exactly one SQL query, safe for serverless databases.

```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Advanced Composition

Queries can be composed and partitioned flexibly:

**Compose WHERE filters independently:**
```typescript
async function getProductsBy({ name, category, maxPrice }) {
  const filters: SQL[] = [];
  if (name) filters.push(ilike(products.name, name));
  if (category) filters.push(eq(products.category, category));
  if (maxPrice) filters.push(lte(products.price, maxPrice));
  return db.select().from(products).where(and(...filters));
}
```

**Separate subqueries into variables:**
```typescript
const subquery = db
  .select()
  .from(internalStaff)
  .leftJoin(customUser, eq(internalStaff.userId, customUser.id))
  .as('internal_staff');

const mainQuery = await db
  .select()
  .from(ticket)
  .leftJoin(subquery, eq(subquery.internal_staff.userId, ticket.staffId));
```

### delete
SQL DELETE with where, limit (MySQL/SQLite/SingleStore), orderBy, returning (PostgreSQL/SQLite), and WITH clause support.

## Delete Operations

Delete all rows:
```typescript
await db.delete(users);
```

Delete with conditions:
```typescript
await db.delete(users).where(eq(users.name, 'Dan'));
```

### Limit
Supported in MySQL, SQLite, SingleStore (not PostgreSQL).
```typescript
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```

### Order By
Sort results before deletion:
```typescript
import { asc, desc } from 'drizzle-orm';

await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name, users.name2);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(asc(users.name), desc(users.name2));
```

### Delete with Return
Supported in PostgreSQL and SQLite (not MySQL, SingleStore). Returns deleted rows:
```typescript
const deletedUser = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning();

// partial return
const deletedUserIds: { deletedId: number }[] = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning({ deletedId: users.id });
```

### WITH DELETE Clause
Use CTEs to simplify complex delete queries:
```typescript
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders)
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({
		id: orders.id
	});
```

### drizzle-config-file
Drizzle Kit configuration file options: dialect, schema paths, output folder, database credentials (URL or connection params), migrations table config, introspection casing, table/schema/extension filters, role management with provider support, strict mode, verbose output, and statement breakpoints.

## Configuration File Setup

Drizzle Kit uses TypeScript or JavaScript configuration files (`drizzle.config.ts` or `drizzle.config.js`) to declare options. Use `defineConfig()` from `drizzle-kit`.

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

## Core Configuration Options

### `dialect`
Database type: `postgresql`, `mysql`, `sqlite`, `turso`, `singlestore`
```ts
export default defineConfig({
  dialect: "mysql",
});
```

### `schema`
Glob-based path to schema file(s) or folder(s). Type: `string | string[]`
```ts
export default defineConfig({
  schema: "./src/schema.ts",
  // or
  schema: "./src/schema/*",
});
```

### `out`
Output folder for SQL migrations, JSON snapshots, and generated schema. Default: `drizzle`. Type: `string | string[]`
```ts
export default defineConfig({
  out: "./drizzle",
});
```

### `driver`
Explicitly pick database driver for vendor-specific databases. Drizzle Kit auto-detects from `dialect` by default. Type: varies by database (e.g., `pglite`, `d1-http`, `aws-data-api`)

### `dbCredentials`
Database connection credentials. Format varies by driver:

**PostgreSQL:**
```ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://user:password@host:port/db",
    // or
    host: "host", port: 5432, user: "user", password: "password", 
    database: "dbname", ssl: true,
  }
});
```

**MySQL:**
```ts
export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    url: "mysql://user:password@host:port/db",
    // or
    host: "host", port: 5432, user: "user", password: "password", 
    database: "dbname", ssl: "...",
  }
});
```

**SQLite:**
```ts
export default defineConfig({
  dialect: "sqlite",
  dbCredentials: {
    url: ":memory:", // or "sqlite.db" or "file:sqlite.db"
  }
});
```

**Turso:**
```ts
export default defineConfig({
  dialect: "turso",
  dbCredentials: {
    url: "libsql://acme.turso.io",
    authToken: "...",
  }
});
```

**Cloudflare D1:**
```ts
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: { accountId: "", databaseId: "", token: "" }
});
```

**AWS Data API:**
```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: { database: "database", resourceArn: "resourceArn", secretArn: "secretArn" }
});
```

**PGLite:**
```ts
export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: { url: "./database/" }
});
```

### `migrations`
Configure migrations log table and schema (PostgreSQL only). Default: `{ table: "__drizzle_migrations", schema: "drizzle" }`
```ts
export default defineConfig({
  migrations: {
    table: 'my-migrations-table',
    schema: 'public',
  },
});
```

### `introspect`
Configuration for `drizzle-kit pull` command. `casing` controls column key casing: `"preserve"` or `"camel"` (default).
```ts
export default defineConfig({
  introspect: {
    casing: "camel",
  },
});
```

With `camel`: `first-name` column becomes `firstName` key. With `preserve`: keeps original casing.

### `tablesFilter`
Glob-based filter for table names. Type: `string | string[]`. Used by `push` and `pull` commands.
```ts
export default defineConfig({
  tablesFilter: ["users", "posts", "project1_*"],
});
```

### `schemaFilter`
List of schemas to manage. Default: `["public"]`. PostgreSQL only.
```ts
export default defineConfig({
  schemaFilter: ["public", "schema1", "schema2"],
});
```

### `extensionsFilters`
List of database extensions to ignore (e.g., `postgis` creates its own tables). Default: `[]`
```ts
export default defineConfig({
  extensionsFilters: ["postgis"],
});
```

### `entities.roles`
Manage database roles. Type: `boolean | { provider: "neon" | "supabase", include: string[], exclude: string[] }`. Default: `false`

Enable role management:
```ts
export default defineConfig({
  entities: { roles: true }
});
```

Exclude specific roles:
```ts
export default defineConfig({
  entities: { roles: { exclude: ['admin'] } }
});
```

Include specific roles:
```ts
export default defineConfig({
  entities: { roles: { include: ['admin'] } }
});
```

Use provider presets (excludes provider-managed roles):
```ts
export default defineConfig({
  entities: { roles: { provider: 'neon' } }
});
```

Combine options:
```ts
export default defineConfig({
  entities: { roles: { provider: 'supabase', exclude: ['new_supabase_role'] } }
});
```

### `strict`
Prompt confirmation before running SQL statements in `push` command. Default: `false`. Type: `boolean`
```ts
export default defineConfig({
  strict: true,
});
```

### `verbose`
Print all SQL statements during `push` and `pull` commands. Default: `true`. Type: `boolean`
```ts
export default defineConfig({
  verbose: false,
});
```

### `breakpoints`
Embed `--> statement-breakpoint` in generated migrations (required for MySQL and SQLite which don't support multiple DDL statements in one transaction). Default: `true`. Type: `boolean`
```ts
export default defineConfig({
  breakpoints: false,
});
```

## Multiple Configuration Files

Use `--config` flag to specify different config files for different database stages:
```
drizzle-kit generate --config=drizzle-dev.config.ts
drizzle-kit generate --config=drizzle-prod.config.ts
```

## Migration Folder Structure

The `out` folder contains `.sql` migration files and `_meta` folder (used by drizzle-kit):
```
📦 project
 ├ 📂 drizzle
 │ ├ 📂 _meta
 │ ├ 📜 migration1.sql
 │ └ 📜 migration2.sql
 ├ 📂 src
 ├ 📜 drizzle.config.ts
 └ 📜 package.json
```

### check-migrations
Command to validate SQL migrations history consistency; requires dialect and connection config via drizzle.config.ts or CLI flags (--dialect, --out, --config).

## Purpose
`drizzle-kit check` validates consistency of generated SQL migrations history. Essential for teams with multiple developers working on different branches altering the database schema.

## Configuration
Requires `dialect` and database connection credentials via `drizzle.config.ts` or CLI options.

**With config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit check
```

**As CLI options:**
```shell
npx drizzle-kit check --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in one project for different database stages:
```plaintext
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```
```shell
npx drizzle-kit check --config=drizzle-dev.config.ts
npx drizzle-kit check --config=drizzle-prod.config.ts
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | no | Migrations folder, default: `./drizzle` |
| `config` | no | Config file path, default: `drizzle.config.ts` |

**Examples:**
```shell
npx drizzle-kit check --dialect=postgresql
npx drizzle-kit check --dialect=postgresql --out=./migrations-folder
```

### export
CLI command to output SQL DDL representation of Drizzle schema; requires dialect and schema path via config or CLI options; supports glob patterns for multiple schema files and multiple config files.

## Purpose
`drizzle-kit export` generates and outputs SQL DDL representation of a Drizzle schema to the console. It's designed for the codebase-first approach to migrations and allows external tools like Atlas to handle migrations.

## How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Generates SQL DDL statements based on the schema
3. Outputs SQL DDL to console

## Configuration
Requires `dialect` and `schema` options via config file or CLI:

**Config file approach:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```
```shell
npx drizzle-kit export
```

**CLI approach:**
```shell
npx drizzle-kit export --dialect=postgresql --schema=./src/schema.ts
```

## Schema paths
- Can use single or multiple schema files
- Specify paths using glob patterns via `schema` option
- Example: `"./src/schema/**/*.ts"` matches all TypeScript files in schema directory

## Multiple config files
Support for multiple config files in one project for different database stages:
```shell
npx drizzle-kit export --config=drizzle-dev.config.ts
npx drizzle-kit export --config=drizzle-prod.config.ts
```

## CLI options
- `--sql`: Generate SQL representation (default output format)
- `--config`: Path to config file (default: `drizzle.config.ts`)

## Required parameters
| Option | Type | Description |
|--------|------|-------------|
| `dialect` | required | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | required | Path to schema file(s) or folder with glob patterns |
| `config` | optional | Config file path |

## Example
Schema file at `./src/schema.ts`:
```ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: text('email').notNull(),
	name: text('name')
});
```

Config at `./configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Run:
```shell
npx drizzle-kit export --config=./configs/drizzle.config.ts
```

Output:
```sql
CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "name" text
);
```

### generate
Generate SQL migrations from Drizzle schema by comparing against previous snapshots; supports custom names, empty migrations for manual SQL, multiple configs, and glob patterns for schema files.

## Purpose
`drizzle-kit generate` creates SQL migrations from your Drizzle schema definitions. It compares your current schema against previous migration snapshots and generates the necessary SQL to transform the database.

## How it works
1. Reads Drizzle schema file(s) and creates a JSON snapshot
2. Compares snapshot against the most recent migration snapshot
3. Generates SQL migration file based on differences
4. Saves `migration.sql` and `snapshot.json` with a timestamp

Example schema:
```typescript
import * as p from "./drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(), 
});
```

Generates:
```sql
CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

## Configuration
Requires `dialect` and `schema` path options via config file or CLI:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

```shell
npx drizzle-kit generate
```

Or via CLI:
```shell
npx drizzle-kit generate --dialect=postgresql --schema=./src/schema.ts
```

## Schema files
Can use single or multiple schema files with glob patterns:
```ts
schema: "./src/schema.ts"
schema: "./src/**/*.ts"
```

## Custom migration names
```shell
npx drizzle-kit generate --name=init
```
Creates: `0000_init.sql`

## Multiple config files
For different database stages or databases:
```shell
npx drizzle-kit generate --config=drizzle-dev.config.ts
npx drizzle-kit generate --config=drizzle-prod.config.ts
```

## Custom migrations
Generate empty migration files for unsupported DDL or data seeding:
```shell
drizzle-kit generate --custom --name=seed-users
```

Creates empty `0001_seed-users.sql` for manual SQL:
```sql
INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
```

## CLI options
| Option | Type | Description |
|--------|------|-------------|
| `dialect` | required | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | required | Path to schema file(s) or folder with glob patterns |
| `out` | optional | Migrations output folder, default `./drizzle` |
| `config` | optional | Config file path, default `drizzle.config.ts` |
| `breakpoints` | optional | SQL statement breakpoints, default `true` |
| `custom` | optional | Generate empty SQL for custom migration |
| `name` | optional | Custom migration file name |

## Complete example
Config at `./configs/drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
});
```

Command:
```shell
npx drizzle-kit generate --config=./configs/drizzle.config.ts --name=seed-users --custom
```

Creates: `./migrations/0001_seed-users.sql`

## Integration
Generated migrations can be applied via:
- `drizzle-kit migrate`
- drizzle-orm's `migrate()` function
- External tools like bytebase
- Direct database execution

### migrate
Apply generated SQL migrations to database, tracking applied migrations in `__drizzle_migrations` table; configure via config file or CLI with dialect and credentials.

## Purpose
`drizzle-kit migrate` applies SQL migrations generated by `drizzle-kit generate`. It implements the code-first approach to managing migrations.

## How it works
1. Reads all `.sql` migration files from the migrations folder
2. Connects to database and fetches entries from the drizzle migrations log table (`__drizzle_migrations`)
3. Determines which migrations haven't been applied yet
4. Runs new SQL migrations and logs them to the migrations table

## Configuration
Requires `dialect` and database connection credentials via `drizzle.config.ts` or CLI options:

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
  migrations: {
    table: '__drizzle_migrations', // customizable
    schema: 'drizzle', // PostgreSQL only
  },
});
```

```shell
npx drizzle-kit migrate
# or with CLI options
npx drizzle-kit migrate --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## Multiple configurations
Support multiple config files for different database stages:
```shell
npx drizzle-kit migrate --config=drizzle-dev.config.ts
npx drizzle-kit migrate --config=drizzle-prod.config.ts
```

## Example workflow
1. Define schema in `src/schema.ts`:
```ts
import * as p from "drizzle-orm/pg-core";
export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```

2. Generate migration: `npx drizzle-kit generate --name=init` creates `0000_init.sql`
3. Apply migration: `npx drizzle-kit migrate` runs the SQL and logs it to database

### pull
Introspect existing database schema and generate TypeScript Drizzle schema file; supports multiple configs, special drivers (AWS Data API, PGLite, D1 HTTP), and filtering by tables/schemas/extensions.

## Purpose
`drizzle-kit pull` introspects an existing database schema and generates a TypeScript Drizzle schema file (`schema.ts`). It's designed for database-first migration approaches where the database schema is managed outside the TypeScript project.

## How It Works
1. Pulls database schema (DDL) from an existing database
2. Generates `schema.ts` file with Drizzle schema definitions
3. Saves output to the `out` folder (default: `./drizzle`)

Example flow:
```
Database: CREATE TABLE "users" ("id" SERIAL PRIMARY KEY, "name" TEXT, "email" TEXT UNIQUE);
↓
Generated schema.ts:
import * as p from "drizzle-orm/pg-core";
export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

## Configuration
Requires `dialect` and database connection info via config file or CLI:

**Config file approach:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```
```shell
npx drizzle-kit pull
```

**CLI approach:**
```shell
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
```

## Multiple Config Files
Support for multiple configuration files in one project for different database stages:
```shell
npx drizzle-kit pull --config=drizzle-dev.config.ts
npx drizzle-kit pull --config=drizzle-prod.config.ts
```

## Database Driver Specification
Drizzle Kit automatically picks the database driver based on `dialect`. For exceptions like AWS Data API, PGLite, and Cloudflare D1 HTTP, explicitly specify the `driver` param:

```ts
// AWS Data API
export default defineConfig({
  dialect: "postgresql",
  driver: "aws-data-api",
  dbCredentials: {
    database: "database",
    resourceArn: "resourceArn",
    secretArn: "secretArn",
  },
});

// PGLite
export default defineConfig({
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    url: ":memory:" // or "./database/"
  },
});

// Cloudflare D1 HTTP
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: "accountId",
    databaseId: "databaseId",
    token: "token",
  },
});
```

Note: Expo SQLite and OP SQLite cannot be used with `pull` as they are on-device databases.

## Filtering Tables, Schemas, and Extensions
Configure which tables, schemas, and extensions to manage:

```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
```

| Option | Description |
|--------|-------------|
| `tablesFilter` | Glob-based table names filter, e.g. `["users", "user_info"]` or `"user*"`. Default: `"*"` |
| `schemaFilter` | Schema names filter, e.g. `["public", "drizzle"]`. Default: `["public"]` |
| `extensionsFilters` | List of installed database extensions, e.g. `["postgis"]`. Default: `[]` |

## CLI Options
```shell
npx drizzle-kit pull --dialect=postgresql --url=postgresql://user:password@host:port/dbname
npx drizzle-kit pull --dialect=postgresql --driver=pglite --url=database/
npx drizzle-kit pull --dialect=postgresql --tablesFilter='user*' --extensionsFilters=postgis --url=postgresql://user:password@host:port/dbname
```

| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | Yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `driver` | No | Driver exceptions (aws-data-api, pglite, d1-http) |
| `out` | No | Migrations output folder path, default: `./drizzle` |
| `url` | No | Database connection string |
| `user` | No | Database user |
| `password` | No | Database password |
| `host` | No | Host |
| `port` | No | Port |
| `database` | No | Database name |
| `config` | No | Configuration file path, default: `drizzle.config.ts` |
| `introspect-casing` | No | Strategy for JS keys creation: `preserve` or `camel` |
| `tablesFilter` | No | Table name filter |
| `schemaFilter` | No | Schema name filter, default: `["public"]` |
| `extensionsFilters` | No | Database extensions internal database filters |

### push
Push schema changes directly to database without SQL files; code-first migrations with config via drizzle.config.ts or CLI (dialect, schema path, db connection required); supports filtering tables/schemas/extensions, multiple configs, and CLI options (verbose, strict, force).

## Overview
`drizzle-kit push` applies schema changes directly to the database without generating SQL files. It implements a code-first migration approach by reading your Drizzle schema, comparing it to the database schema, generating SQL migrations, and applying them automatically.

## How It Works
1. Read Drizzle schema file(s) and create a JSON snapshot
2. Introspect current database schema
3. Generate SQL migrations based on differences
4. Apply migrations to the database

## Configuration
Configure via `drizzle.config.ts` or CLI options. Required: `dialect`, `schema` path, and database connection (`url` or `user:password@host:port/db`).

```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname",
  },
});
```

```shell
npx drizzle-kit push
```

Or via CLI:
```shell
npx drizzle-kit push --dialect=postgresql --schema=./src/schema.ts --url=postgresql://user:password@host:port/dbname
```

## Schema Files
Use glob patterns for single or multiple schema files:
```ts
schema: "./src/schema.ts"           // single file
schema: "./src/**/*.schema.ts"       // multiple files
```

## Multiple Config Files
Support different database stages or databases:
```shell
npx drizzle-kit push --config=drizzle-dev.config.ts
npx drizzle-kit push --config=drizzle-prod.config.ts
```

## Database Drivers
Drizzle Kit automatically picks the driver based on `dialect`. For exceptions like `aws-data-api`, `pglight`, and `d1-http`, explicitly specify the `driver` parameter.

Note: Expo SQLite and OP SQLite (on-device databases) don't support `push`; use embedded migrations instead.

## Filtering Tables, Schemas, and Extensions
```ts
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: { url: "..." },
  tablesFilter: ["*"],              // glob-based table filter, default "*"
  schemaFilter: ["public"],          // schema names, default ["public"]
  extensionsFilters: ["postgis"],    // installed extensions to ignore
});
```

## CLI-Only Options
- `--verbose`: Print all SQL statements before execution
- `--strict`: Ask for approval before executing SQL
- `--force`: Auto-accept data-loss statements

```shell
npx drizzle-kit push --strict --verbose --force
```

## All Configuration Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect (postgresql, mysql, sqlite, etc.) |
| `schema` | yes | Path to schema file(s) or folder |
| `driver` | | Driver exception (aws-data-api, pglight, d1-http) |
| `tablesFilter` | | Table name filter |
| `schemaFilter` | | Schema names, default `["public"]` |
| `extensionsFilters` | | Database extensions to ignore |
| `url` | | Database connection string |
| `user` | | Database user |
| `password` | | Database password |
| `host` | | Host |
| `port` | | Port |
| `database` | | Database name |
| `config` | | Config file path, default `drizzle.config.ts` |

## Example
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

```ts
// src/schema.ts
import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
})
```

```shell
npx drizzle-kit push
```

Generates and applies:
```sql
CREATE TABLE "users"(
  id serial primary key,
  name text
)
```

## Use Cases
Best for rapid prototyping and production applications. Pairs well with blue/green deployments and serverless databases (Planetscale, Neon, Turso).

### studio
Local database browser server with configurable host/port, verbose logging, Safari/Brave support via mkcert, embeddable B2B component, and Chrome extension for serverless databases; local-only, not open source.

## Overview
`drizzle-kit studio` command starts a local Drizzle Studio server (database browser) on `127.0.0.1:4983` by default, accessible at `local.drizzle.studio`. Requires database credentials in `drizzle.config.ts`.

## Configuration
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

### Host and Port
```shell
drizzle-kit studio --port=3000
drizzle-kit studio --host=0.0.0.0
drizzle-kit studio --host=0.0.0.0 --port=3000
```

### Logging
Enable SQL statement logging with `--verbose` flag:
```shell
drizzle-kit studio --verbose
```

### Safari and Brave Support
These browsers block localhost by default. Install mkcert and generate self-signed certificate:
1. Install mkcert
2. Run `mkcert -install`
3. Restart `drizzle-kit studio`

## Embeddable Version
Drizzle Studio component is a framework-agnostic web component for embedding in React, Vue, Svelte, VanillaJS, etc. Available as B2B offering for SaaS platforms. Used by Turso, Neon, Hydra, Nuxt Hub, and Deco.cx.

## Chrome Extension
Drizzle Studio chrome extension allows browsing PlanetScale, Cloudflare D1, and Vercel Postgres serverless databases directly in vendor admin panels.

## Limitations
- Hosted version is for local development only, not for remote/VPS deployment
- Alpha version of Drizzle Studio Gateway available for VPS deployment (contact via Twitter/Discord)

## Open Source Status
Drizzle ORM and Kit are open source; Studio is not. Local development version is free forever to enrich the ecosystem, but closed-source to enable B2B offerings and monetization.

### drizzle-kit-up
Command to upgrade schema snapshots to newer versions; requires dialect and optional config/out/database credentials via drizzle.config.ts or CLI flags.

## Purpose
`drizzle-kit up` upgrades drizzle schema snapshots to a newer version when breaking changes are introduced to JSON snapshots and internal versions change.

## Configuration
The command requires `dialect` and database connection credentials, provided via `drizzle.config.ts` or CLI options.

**With config file:**
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
});
```
```shell
npx drizzle-kit up
```

**As CLI options:**
```shell
npx drizzle-kit up --dialect=postgresql
```

## Multiple Configuration Files
Support for multiple config files in one project for different database stages:
```shell
npx drizzle-kit up --config=drizzle-dev.config.ts
npx drizzle-kit up --config=drizzle-prod.config.ts
```

## CLI Options
| Option | Required | Description |
|--------|----------|-------------|
| `dialect` | yes | Database dialect: `postgresql`, `mysql`, or `sqlite` |
| `out` | no | Migrations folder, default: `./drizzle` |
| `config` | no | Config file path, default: `drizzle.config.ts` |

**Examples:**
```shell
npx drizzle-kit up --dialect=postgresql
npx drizzle-kit up --dialect=postgresql --out=./migrations-folder
```

### dynamic-query-building
Enable dynamic mode with `.$dynamic()` to allow multiple invocations of query builder methods; use dialect-specific generic types (PgSelect, MySqlSelect, SQLiteSelect, etc.) for functions that enhance query builders dynamically.

## Dynamic Query Building

By default, Drizzle query builders enforce SQL semantics where most methods can only be invoked once. For example, you cannot call `.where()` multiple times on a SELECT statement:

```ts
const query = db
	.select()
	.from(users)
	.where(eq(users.id, 1))
	.where(eq(users.name, 'John')); // ❌ Type error
```

This restriction is useful for conventional query building but problematic for dynamic query construction, such as when a shared function needs to enhance a query builder passed to it.

### Enabling Dynamic Mode

Call `.$dynamic()` on a query builder to enable dynamic mode, which removes the single-invocation restriction:

```ts
function withPagination<T extends PgSelect>(
	qb: T,
	page: number = 1,
	pageSize: number = 10,
) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1));
withPagination(query, 1); // ❌ Type error - not in dynamic mode

const dynamicQuery = query.$dynamic();
withPagination(dynamicQuery, 1); // ✅ OK
```

### Generic Types for Dynamic Query Building

Dynamic query builders use generic types that allow functions to modify the query builder's result type (e.g., adding joins):

```ts
function withFriends<T extends PgSelect>(qb: T) {
	return qb.leftJoin(friends, eq(friends.userId, users.id));
}

let query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
query = withFriends(query);
```

Available types by dialect:

| Dialect | Select | Insert | Update | Delete |
|---------|--------|--------|--------|--------|
| Postgres | `PgSelect`, `PgSelectQueryBuilder` | `PgInsert` | `PgUpdate` | `PgDelete` |
| MySQL | `MySqlSelect`, `MySqlSelectQueryBuilder` | `MySqlInsert` | `MySqlUpdate` | `MySqlDelete` |
| SQLite | `SQLiteSelect`, `SQLiteSelectQueryBuilder` | `SQLiteInsert` | `SQLiteUpdate` | `SQLiteDelete` |

The `...QueryBuilder` types are for standalone query builder instances. DB query builders are subclasses of them, so both can be used:

```ts
import { QueryBuilder } from 'drizzle-orm/pg-core';

function withFriends<T extends PgSelectQueryBuilder>(qb: T) {
	return qb.leftJoin(friends, eq(friends.userId, users.id));
}

const qb = new QueryBuilder();
let query = qb.select().from(users).where(eq(users.id, 1)).$dynamic();
query = withFriends(query);
```

### eslint-plugin
ESLint plugin with enforce-delete-with-where and enforce-update-with-where rules; both support drizzleObjectName config to filter by object name.

## ESLint Plugin for Drizzle

An ESLint plugin that provides rules for catching common mistakes during development that are difficult to type-check.

### Installation

```
npm install eslint-plugin-drizzle @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Configuration

Basic setup in `.eslintrc.yml`:
```yml
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

Use `extends: ["plugin:drizzle/recommended"]` or `extends: ["plugin:drizzle/all"]` (currently equivalent) to enable all rules at once.

### Rules

**enforce-delete-with-where**

Requires `.where()` clause on `.delete()` statements to prevent accidental deletion of all rows.

Optional `drizzleObjectName` config (string or string[]) restricts the rule to specific object names, useful when other classes have delete methods:

```yml
rules:
  'drizzle/enforce-delete-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public delete() { return {} }
}
const myClassObj = new MyClass();
myClassObj.delete() // OK - not triggered
const db = drizzle(...)
db.delete() // ERROR - triggered
db.delete().where(...) // OK
```

**enforce-update-with-where**

Requires `.where()` clause on `.update()` statements to prevent accidental updates to all rows.

Same `drizzleObjectName` configuration option as enforce-delete-with-where:

```yml
rules:
  'drizzle/enforce-update-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public update() { return {} }
}
const myClassObj = new MyClass();
myClassObj.update() // OK - not triggered
const db = drizzle(...)
db.update() // ERROR - triggered
db.update().where(...) // OK
```

### faq
generate creates migration files; push syncs schema directly; PostgreSQL indexes with expressions need manual names; push can't detect expression/where/op changes in existing indexes.

## generate vs push

`generate` creates SQL migration files with metadata for drizzle-kit or other migration tools. The generated migrations are not automatically applied—you must apply them separately.

`push` syncs your schema directly with the database without generating migration files. Use only for local development and local databases.

## PostgreSQL indexes limitations

### For both push and generate:
When using indexes with expressions, you must specify a name manually:

```ts
index().on(table.id, table.email) // auto-named, works
index('my_name').on(table.id, table.email) // works

index().on(sql`lower(${table.email})`) // error - must name it
index('my_name').on(sql`lower(${table.email})`) // works
```

### For push only:
Push won't generate statements if these index properties change in existing indexes:
- expressions in `.on()` and `.using()`
- `.where()` statements
- operator classes in `.op()`

Workaround: comment out the index, push, uncomment and modify, then push again.

The `generate` command has no such limitations—it detects any index property changes.

### generated-columns
Generated columns: auto-computed database columns using `.generatedAlwaysAs(string|sql|callback)` with Virtual/Stored modes; PostgreSQL STORED-only, MySQL/SQLite both; limitations on expression changes via push.

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

### gel-setup
Setup Gel database driver: install drizzle-orm + gel, initialize with connection string/options or existing client, execute queries.

## Gel Integration Setup

Drizzle has native support for Gel connections via the `gel-js` client.

**Installation:**
```
npm install drizzle-orm gel
npm install -D drizzle-kit
```

**Basic initialization with connection string:**
```typescript
import { drizzle } from 'drizzle-orm/gel';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

**With connection options:**
```typescript
import { drizzle } from "drizzle-orm/gel";
const db = drizzle({
  connection: {
    dsn: process.env.DATABASE_URL,
    tlsSecurity: "default",
  },
});
const result = await db.execute("select 1");
```

**With existing Gel client:**
```typescript
import { drizzle } from "drizzle-orm/gel";
import { createClient } from "gel";
const gelClient = createClient();
const db = drizzle({ client: gelClient });
const result = await db.execute('select 1');
```

### mysql-setup
Setup Drizzle with MySQL via mysql2 driver: install packages, initialize with URL or existing connection (client for migrations, pool for queries).

## MySQL Setup with mysql2 Driver

Drizzle ORM natively supports MySQL through the `mysql2` driver, a high-performance MySQL client for Node.js.

### Installation
```
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Basic Setup
Initialize the driver with a database URL:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle(process.env.DATABASE_URL);
const response = await db.select().from(...);
```

Or with explicit connection config:
```typescript
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
```

### Using Existing Driver Connections

**Client connection** (single connection):
```typescript
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "host",
  user: "user",
  database: "database",
});
const db = drizzle({ client: connection });
```

**Pool connection** (connection pool):
```typescript
const poolConnection = mysql.createPool({
  host: "host",
  user: "user",
  database: "database",
});
const db = drizzle({ client: poolConnection });
```

### Important Notes
- For DDL migrations using the built-in `migrate` function, use a single client connection
- For querying, you can use either client or pool based on your needs

### postgresql-setup
PostgreSQL driver setup for node-postgres and postgres.js with connection string, config, or existing client initialization patterns.

## PostgreSQL Setup

Drizzle supports PostgreSQL via two drivers: `node-postgres` (pg) and `postgres.js`.

### Driver Differences
- **node-postgres**: Can install `pg-native` for ~10% speed boost; supports per-query type parsers without global patching
- **postgres.js**: Uses prepared statements by default (may need to opt out in AWS environments)

### node-postgres Setup

Install packages:
```
drizzle-orm pg
-D drizzle-kit @types/pg
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config options:
```typescript
const db = drizzle({ 
  connection: { 
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});
```

With existing Pool:
```typescript
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

### postgres.js Setup

Install packages:
```
drizzle-orm postgres
-D drizzle-kit
```

Initialize with connection string:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config options:
```typescript
const db = drizzle({ 
  connection: { 
    url: process.env.DATABASE_URL, 
    ssl: true 
  }
});
```

With existing client:
```typescript
import postgres from 'postgres';
const queryClient = postgres(process.env.DATABASE_URL);
const db = drizzle({ client: queryClient });
```

### singlestore-setup
Setup Drizzle with SingleStore using mysql2 driver; supports URI, config, or existing client/pool connections; has limitations including no foreign keys, nested transactions, relational API, or ORDER BY+LIMIT chaining.

## SingleStore Integration

Drizzle ORM supports SingleStore databases through the `mysql2` driver via the `drizzle-orm/singlestore` package.

### Installation
```
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Driver Initialization

**Direct URI connection:**
```typescript
import { drizzle } from "drizzle-orm/singlestore";
const db = drizzle(process.env.DATABASE_URL);
```

**With connection config:**
```typescript
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
```

**With existing mysql2 client connection:**
```typescript
import mysql from "mysql2/promise";
const connection = await mysql.createConnection({
  host: "host",
  user: "user",
  database: "database"
});
const db = drizzle({ client: connection });
```

**With existing mysql2 pool connection:**
```typescript
const poolConnection = mysql.createPool({
  host: "host",
  user: "user",
  database: "database"
});
const db = drizzle({ client: poolConnection });
```

Use single client connection for migrations with the built-in `migrate` function. Use either client or pool for queries based on requirements.

### Limitations

- Serial columns only ensure uniqueness, not auto-increment behavior
- `ORDER BY` and `LIMIT` cannot be chained
- Foreign keys not supported
- `INTERSECT ALL` and `EXCEPT ALL` operations not supported
- Nested transactions not supported
- Only one isolation level supported
- FSP option in `DATE`, `TIMESTAMP`, `DATETIME` not supported
- Relational API not supported (pending SingleStore API development)
- Additional MySQL incompatibilities may exist

### sqlite-setup
Setup SQLite with libsql (files + Turso) or better-sqlite3 (local); libsql has more schema management features and encryption support.

## SQLite Setup

Drizzle supports SQLite via two drivers: `libsql` and `better-sqlite3`.

### libsql vs better-sqlite3

**libsql** advantages:
- Connects to both SQLite files and Turso remote databases
- More ALTER statements for schema management
- Native encryption at rest configuration
- Broader SQLite extension support

### libsql Setup

Install packages:
```
drizzle-orm @libsql/client
-D drizzle-kit
```

Initialize driver (async):
```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config:
```typescript
const db = drizzle({ connection: { url: '', authToken: '' } });
```

With explicit client:
```typescript
import { createClient } from '@libsql/client';
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);
```

### better-sqlite3 Setup

Install packages:
```
drizzle-orm better-sqlite3
-D drizzle-kit @types/better-sqlite3
```

Initialize driver:
```typescript
import { drizzle } from 'drizzle-orm/better-sqlite3';
const db = drizzle(process.env.DATABASE_URL);
const result = await db.execute('select 1');
```

With config:
```typescript
const db = drizzle({ connection: { source: process.env.DATABASE_URL } });
```

With existing driver:
```typescript
import Database from 'better-sqlite3';
const sqlite = new Database('sqlite.db');
const db = drizzle({ client: sqlite });
```

### type-helpers-and-utilities
Type helpers, logging configuration, multi-project schema namespacing, SQL generation/printing, raw query execution, standalone query builder, table introspection utilities, and mock driver for testing.

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

### graphql
Auto-generate GraphQL servers from Drizzle schemas; customize via entities object to select/override queries, mutations, and resolvers.

## drizzle-graphql

Generate a GraphQL server from a Drizzle schema with `buildSchema()`.

### Quick Start

Install: `drizzle-graphql @apollo/server graphql` or `drizzle-graphql graphql-yoga graphql`

**Apollo Server:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dbSchema from './schema';

const db = drizzle({ client, schema: dbSchema });
const { schema } = buildSchema(db);
const server = new ApolloServer({ schema });
const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
```

**GraphQL Yoga:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import * as dbSchema from './schema';

const db = drizzle({ schema: dbSchema });
const { schema } = buildSchema(db);
const yoga = createYoga({ schema });
const server = createServer(yoga);
server.listen(4000, () => console.info('Server is running on http://localhost:4000/graphql'));
```

**Schema example:**
```ts
import { integer, serial, text, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

### Customizing Schema

`buildSchema()` returns `{ schema, entities }`. Use `entities` to build a custom schema with selected queries/mutations and custom resolvers:

```ts
import { buildSchema } from 'drizzle-graphql';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const db = drizzle({ schema: dbSchema });
const { entities } = buildSchema(db);

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: entities.queries.users,
      customer: entities.queries.customersSingle,
      customUsers: {
        type: new GraphQLList(new GraphQLNonNull(entities.types.UsersItem)),
        args: {
          where: { type: entities.inputs.UsersFilters }
        },
        resolve: async (source, args, context, info) => {
          // Custom logic
          return await db.select(schema.users).where()...
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: entities.mutations,
  }),
  types: [...Object.values(entities.types), ...Object.values(entities.inputs)],
});

const yoga = createYoga({ schema });
const server = createServer(yoga);
server.listen(4000, () => console.info('Server is running on http://localhost:4000/graphql'));
```

The output is standard GraphQL SDK compatible with any library supporting it. Reuse generated types and inputs in custom fields.

### indexes-constraints
SQL constraints (DEFAULT, NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY) and indexes (index, uniqueIndex) with database-specific options.

## Constraints

**DEFAULT**: Specifies default value for a column if no value provided on INSERT. Can be a constant, expression, or NULL.
```typescript
integer('col').default(42)
integer('col').default(sql`'42'::integer`)
uuid('col').defaultRandom()
```

**NOT NULL**: Enforces column to not accept NULL values.
```typescript
integer('col').notNull()
```

**UNIQUE**: Ensures all values in column are different. Can be single or composite (multiple columns). Supports custom names and NULLS NOT DISTINCT (PostgreSQL 15+).
```typescript
integer('id').unique()
integer('id').unique('custom_name')
// Composite
pgTable('table', { id: integer('id'), name: text('name') }, (t) => [
  unique().on(t.id, t.name),
  unique('custom_name').on(t.id, t.name),
  unique().on(t.id).nullsNotDistinct() // PG 15+
])
```

**CHECK**: Limits value range for a column or based on multiple columns.
```typescript
pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  username: text().notNull(),
  age: integer(),
}, (table) => [
  check('age_check1', sql`${table.age} > 21`)
])
```

**PRIMARY KEY**: Uniquely identifies each record. Must be UNIQUE and NOT NULL. Only one per table, can be single or composite column.
```typescript
serial('id').primaryKey()
text('cuid').primaryKey()
// Composite
pgTable('books_to_authors', {
  authorId: integer('author_id'),
  bookId: integer('book_id'),
}, (table) => [
  primaryKey({ columns: [table.bookId, table.authorId] }),
  primaryKey({ name: 'custom_name', columns: [table.bookId, table.authorId] })
])
```

**FOREIGN KEY**: References PRIMARY KEY in another table. Prevents actions that destroy links between tables. Can be declared inline or standalone.
```typescript
// Inline
integer('author_id').references(() => user.id)

// Self-reference (requires explicit return type)
integer('parent_id').references((): AnyPgColumn => user.id)

// Standalone
pgTable('user', {
  id: serial('id'),
  name: text('name'),
  parentId: integer('parent_id'),
}, (table) => [
  foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: 'custom_fk'
  })
])

// Multicolumn
pgTable('profile', {
  id: serial('id'),
  userFirstName: text('user_first_name'),
  userLastName: text('user_last_name'),
}, (table) => [
  foreignKey({
    columns: [table.userFirstName, table.userLastName],
    foreignColumns: [user.firstName, user.lastName],
    name: 'custom_fk'
  })
])
```

## Indexes

Drizzle ORM supports `index()` and `uniqueIndex()` declarations.

**Basic usage**:
```typescript
pgTable('user', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
}, (table) => [
  index('name_idx').on(table.name),
  uniqueIndex('email_idx').on(table.email)
])
```

**PostgreSQL (0.31.0+)** supports advanced index API:
```typescript
// With .on()
index('name')
  .on(table.column1.asc(), table.column2.nullsFirst())
  .concurrently()
  .where(sql`condition`)
  .with({ fillfactor: '70' })

// With .using()
index('name')
  .using('btree', table.column1.asc(), sql`lower(${table.column2})`)
  .where(sql`condition`)
  .with({ fillfactor: '70' })
```

**MySQL** supports:
```typescript
index('name')
  .on(table.name)
  .algorythm('default' | 'copy' | 'inplace')
  .using('btree' | 'hash')
  .lock('none' | 'default' | 'exclusive' | 'shared')
```

**SQLite** supports:
```typescript
index('name')
  .on(table.name)
  .where(sql`condition`)
```

Supported across PostgreSQL, MySQL, SQLite, and SingleStore (with varying feature support).

### insert.mdx
INSERT operations: single/multiple rows, type inference, RETURNING (PostgreSQL/SQLite), $returningId (MySQL/SingleStore), conflict resolution (onConflictDoNothing/onConflictDoUpdate/onDuplicateKeyUpdate with targetWhere/setWhere), WITH clauses, INSERT...SELECT from query builder/callback/SQL.

## Insert one row
```typescript
await db.insert(users).values({ name: 'Andrew' });
```
Type inference: `type NewUser = typeof users.$inferInsert;`

## Insert returning
Supported in PostgreSQL and SQLite:
```typescript
await db.insert(users).values({ name: "Dan" }).returning();
await db.insert(users).values({ name: "Partial Dan" }).returning({ insertedId: users.id });
```

## Insert $returningId
MySQL and SingleStore alternative (no native RETURNING support). Returns inserted IDs for autoincrement primary keys:
```typescript
const result = await db.insert(usersTable).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// ^? { id: number }[]
```
Also works with custom primary keys using `$defaultFn`:
```typescript
const usersTableDefFn = mysqlTable('users_default_fn', {
  customId: varchar('id', { length: 256 }).primaryKey().$defaultFn(createId),
  name: text('name').notNull(),
});
const result = await db.insert(usersTableDefFn).values([{ name: 'John' }, { name: 'John1' }]).$returningId();
// ^? { customId: string }[]
```
If no primary keys exist, type is `{}[]`.

## Insert multiple rows
```typescript
await db.insert(users).values([{ name: 'Andrew' }, { name: 'Dan' }]);
```

## On conflict do nothing
PostgreSQL and SQLite:
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing();
await db.insert(users).values({ id: 1, name: 'John' }).onConflictDoNothing({ target: users.id });
```

## On conflict do update
PostgreSQL and SQLite:
```typescript
await db.insert(users).values({ id: 1, name: 'Dan' }).onConflictDoUpdate({ target: users.id, set: { name: 'John' } });
```

With `where` clauses using `targetWhere` (partial indexes) and `setWhere` (update conditions):
```typescript
await db.insert(employees).values({ employeeId: 123, name: 'John Doe' }).onConflictDoUpdate({
  target: employees.employeeId,
  targetWhere: sql`name <> 'John Doe'`,
  set: { name: sql`excluded.name` }
});

await db.insert(employees).values({ employeeId: 123, name: 'John Doe' }).onConflictDoUpdate({
  target: employees.employeeId,
  set: { name: 'John Doe' },
  setWhere: sql`name <> 'John Doe'`
});
```

Composite indexes/primary keys:
```typescript
await db.insert(users).values({ firstName: 'John', lastName: 'Doe' }).onConflictDoUpdate({
  target: [users.firstName, users.lastName],
  set: { firstName: 'John1' }
});
```

## On duplicate key update
MySQL and SingleStore (automatically determines conflict target from primary key and unique indexes):
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onDuplicateKeyUpdate({ set: { name: 'John' } });
```

No-op on conflict by setting a column to itself:
```typescript
await db.insert(users).values({ id: 1, name: 'John' }).onDuplicateKeyUpdate({ set: { id: sql`id` } });
```

## WITH clause
```typescript
const userCount = db.$with('user_count').as(
  db.select({ value: sql`count(*)`.as('value') }).from(users)
);

const result = await db.with(userCount).insert(users).values([
  { username: 'user1', admin: sql`((select * from ${userCount}) = 0)` }
]).returning({ admin: users.admin });
```

## Insert into ... select
Three approaches:

Query builder:
```typescript
const insertedEmployees = await db.insert(employees).select(
  db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
).returning({ id: employees.id, name: employees.name });
```

Callback:
```typescript
await db.insert(employees).select(
  () => db.select({ name: users.name }).from(users).where(eq(users.role, 'employee'))
);
```

SQL template tag:
```typescript
await db.insert(employees).select(
  sql`select "users"."name" as "name" from "users" where "users"."role" = 'employee'`
);
```

Note: For upsert clauses, SELECT must include WHERE clause (even `WHERE true`) to avoid parsing ambiguity.

### joins
SQL join operations with type-safe syntax: leftJoin, rightJoin, innerJoin, fullJoin, crossJoin (with Lateral variants); partial select with field-level or object-level nullability control; table aliases for self-joins; result aggregation patterns for many-to-one and many-to-many relationships.

## Join Types

Drizzle ORM supports: `INNER JOIN [LATERAL]`, `FULL JOIN`, `LEFT JOIN [LATERAL]`, `RIGHT JOIN`, `CROSS JOIN [LATERAL]`.

### Left Join
```typescript
const result = await db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...}, pets: {...} | null }[]
```

### Left Join Lateral
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).leftJoinLateral(subquery, sql`true`)
// Result: { user: {...}, userPets: {...} | null }[]
```

### Right Join
```typescript
const result = await db.select().from(users).rightJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...} | null, pets: {...} }[]
```

### Inner Join
```typescript
const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...}, pets: {...} }[]
```

### Inner Join Lateral
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).innerJoinLateral(subquery, sql`true`)
// Result: { user: {...}, userPets: {...} }[]
```

### Full Join
```typescript
const result = await db.select().from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...} | null, pets: {...} | null }[]
```

### Cross Join
```typescript
const result = await db.select().from(users).crossJoin(pets)
// Result: { user: {...}, pets: {...} }[]
```

### Cross Join Lateral
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).crossJoinLateral(subquery)
// Result: { user: {...}, userPets: {...} }[]
```

## Partial Select

Select specific fields to flatten response type:
```typescript
await db.select({
  userId: users.id,
  petId: pets.id,
}).from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number, petId: number | null }[]
```

When using `sql` operator with joins, explicitly type nullable fields:
```typescript
const result = await db.select({
  userId: users.id,
  petId: pets.id,
  petName1: sql`upper(${pets.name})`,
  petName2: sql<string | null>`upper(${pets.name})`,
}).from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number, petId: number | null, petName1: unknown, petName2: string | null }[]
```

Use nested select object syntax to make entire object nullable instead of individual fields:
```typescript
await db.select({
  userId: users.id,
  userName: users.name,
  pet: {
    id: pets.id,
    name: pets.name,
    upperName: sql<string>`upper(${pets.name})`
  }
}).from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number | null, userName: string | null, pet: {...} | null }[]
```

## Aliases & Self-joins

Use `alias()` for self-joins:
```typescript
import { alias } from 'drizzle-orm';
const parent = alias(user, "parent");
const result = db.select().from(user).leftJoin(parent, eq(parent.id, user.parentId))
// Result: { user: {...}, parent: {...} | null }[]
```

## Aggregating Results

Map join results to aggregate related data:
```typescript
type User = typeof users.$inferSelect;
type Pet = typeof pets.$inferSelect;

const rows = db.select({ user: users, pet: pets })
  .from(users).leftJoin(pets, eq(users.id, pets.ownerId)).all();

const result = rows.reduce<Record<number, { user: User; pets: Pet[] }>>(
  (acc, row) => {
    const user = row.user;
    const pet = row.pet;
    if (!acc[user.id]) acc[user.id] = { user, pets: [] };
    if (pet) acc[user.id].pets.push(pet);
    return acc;
  },
  {}
);
// Result: Record<number, { user: User; pets: Pet[] }>
```

## Many-to-One Example
```typescript
const cities = sqliteTable('cities', { id: integer('id').primaryKey(), name: text('name') });
const users = sqliteTable('users', { id: integer('id').primaryKey(), name: text('name'), cityId: integer('city_id').references(() => cities.id) });

const result = db.select().from(cities).leftJoin(users, eq(cities.id, users.cityId)).all();
```

## Many-to-Many Example
```typescript
const users = sqliteTable('users', { id: integer('id').primaryKey(), name: text('name') });
const chatGroups = sqliteTable('chat_groups', { id: integer('id').primaryKey(), name: text('name') });
const usersToChatGroups = sqliteTable('usersToChatGroups', { userId: integer('user_id').references(() => users.id), groupId: integer('group_id').references(() => chatGroups.id) });

db.select()
  .from(usersToChatGroups)
  .leftJoin(users, eq(usersToChatGroups.userId, users.id))
  .leftJoin(chatGroups, eq(usersToChatGroups.groupId, chatGroups.id))
  .where(eq(chatGroups.id, 1))
  .all();
```

### custom-migrations
Generate empty SQL migration files with `--custom` flag for unsupported DDL operations and data seeding; execute via `drizzle-kit migrate`; JS/TS support coming soon.

## Custom SQL Migrations

Drizzle Kit allows you to generate empty migration files for writing custom SQL migrations that handle DDL alterations not yet supported by Drizzle Kit, or for data seeding operations.

### Generating Custom Migrations

Use the `--custom` flag with the generate command:

```shell
drizzle-kit generate --custom --name=seed-users
```

This creates a new migration file in the `drizzle` directory with a sequential number prefix:

```plaintext
📦 <project root>
 ├ 📂 drizzle
 │ ├ 📂 _meta
 │ ├ 📜 0000_init.sql 
 │ └ 📜 0001_seed-users.sql 
 ├ 📂 src
 └ …
```

### Writing Custom SQL

Write your custom SQL directly in the generated migration file:

```sql
-- ./drizzle/0001_seed-users.sql
INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```

Custom migrations are executed using the `drizzle-kit migrate` command.

### Future: JavaScript and TypeScript Migrations

Support for running custom JavaScript and TypeScript migration/seeding scripts is planned for an upcoming release.

### kit-overview
Drizzle Kit CLI tool for SQL migrations: generate/migrate/push/pull/studio/check/up commands; configured via drizzle.config.ts with dialect and schema path; supports multiple config files per environment.

## Drizzle Kit Overview

Drizzle Kit is a CLI tool for managing SQL database migrations with Drizzle ORM.

### Installation
```
npm install -D drizzle-kit
```

### Core Commands

- **drizzle-kit generate** - Generate SQL migration files based on your Drizzle schema (initial or subsequent changes)
- **drizzle-kit migrate** - Apply generated SQL migration files to your database
- **drizzle-kit push** - Push your Drizzle schema directly to database (without generating migration files)
- **drizzle-kit pull** - Introspect database schema, convert to Drizzle schema, save to codebase
- **drizzle-kit studio** - Connect to database and spin up proxy server for Drizzle Studio for database browsing
- **drizzle-kit check** - Walk through all generated migrations and check for race conditions/collisions
- **drizzle-kit up** - Upgrade snapshots of previously generated migrations

### Configuration

Drizzle Kit is configured via `drizzle.config.ts` file. Minimum required: `dialect` and `schema` path.

Simple config:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
});
```

Extended config with all options:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./src/schema.ts",
  driver: "pglite",
  dbCredentials: {
    url: "./database/",
  },
  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",
  introspect: {
    casing: "camel",
  },
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
```

### Multiple Configurations

Provide config path via CLI for different database stages:
```
drizzle-kit push --config=drizzle-dev.config.ts
drizzle-kit push --config=drizzle-prod.config.ts
```

Project structure example:
```
📦 <project root>
 ├ 📂 drizzle
 ├ 📂 src
 ├ 📜 .env
 ├ 📜 drizzle-dev.config.ts
 ├ 📜 drizzle-prod.config.ts
 ├ 📜 package.json
 └ 📜 tsconfig.json
```

### migrations
Six migration strategies: database-first pull, or codebase-first via direct push, SQL file generation with CLI/runtime application, manual application, or export for external tools.

## Migrations Fundamentals

SQL databases require strict schemas defined upfront. Schema changes are managed through migrations. There are two primary approaches:

**Database First**: Database schema is the source of truth. Manage schema directly on the database or via migration tools, then pull the schema to your codebase using `drizzle-kit pull`.

**Codebase First**: TypeScript/JavaScript schema in your codebase is the source of truth under version control. Declare and manage schema in code, then apply to the database.

## Six Migration Strategies

**Option 1 - Database First (Pull)**
Use `drizzle-kit pull` to extract database schema as TypeScript:
```typescript
import * as p from "drizzle-orm/pg-core";
export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text(),
  email: p.text().unique(),
});
```

**Option 2 - Codebase First (Push)**
Modify TypeScript schema, use `drizzle-kit push` to apply directly to database. Best for rapid prototyping and production applications.

**Option 3 - Codebase First (Generate + Migrate)**
Use `drizzle-kit generate` to create SQL migration files from schema changes, then `drizzle-kit migrate` to apply them:
```sql
-- drizzle/20242409125510_premium_mister_fear/migration.sql
CREATE TABLE "users" (
 "id" SERIAL PRIMARY KEY,
 "name" TEXT,
 "email" TEXT UNIQUE
);
```

**Option 4 - Codebase First (Generate + Runtime)**
Generate SQL migrations with `drizzle-kit generate`, apply during application runtime:
```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from 'drizzle-orm/node-postgres/migrator';
const db = drizzle(process.env.DATABASE_URL);
await migrate(db);
```
Used for monolithic apps with zero-downtime deployments and serverless deployments.

**Option 5 - Codebase First (Generate Only)**
Use `drizzle-kit generate` to create SQL files, apply manually or via external tools (Bytebase, Liquibase, Atlas, etc.).

**Option 6 - Codebase First (Export)**
Use `drizzle-kit export` to output SQL representation of schema to console, apply via Atlas or other external tools.

### filter-and-conditional-operators
Comparison (eq, ne, gt, gte, lt, lte), existence (exists, notExists), null (isNull, isNotNull), array (inArray, notInArray), range (between, notBetween), string pattern (like, ilike, notIlike), logical (not, and, or), and PostgreSQL array operators (arrayContains, arrayContained, arrayOverlaps) for WHERE clause filtering.

## Filter and Conditional Operators

All filter and conditional operators are imported from `drizzle-orm`:
```typescript
import { eq, ne, gt, gte, lt, lte, exists, notExists, isNull, isNotNull, inArray, notInArray, between, notBetween, like, ilike, notIlike, not, and, or, arrayContains, arrayContained, arrayOverlaps } from "drizzle-orm";
```

### Comparison Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**eq** - Value equal to n:
```typescript
db.select().from(table).where(eq(table.column, 5));
// SELECT * FROM table WHERE table.column = 5
db.select().from(table).where(eq(table.column1, table.column2));
// SELECT * FROM table WHERE table.column1 = table.column2
```

**ne** - Value not equal to n:
```typescript
db.select().from(table).where(ne(table.column, 5));
// SELECT * FROM table WHERE table.column <> 5
```

**gt** - Greater than:
```typescript
db.select().from(table).where(gt(table.column, 5));
// SELECT * FROM table WHERE table.column > 5
```

**gte** - Greater than or equal:
```typescript
db.select().from(table).where(gte(table.column, 5));
// SELECT * FROM table WHERE table.column >= 5
```

**lt** - Less than:
```typescript
db.select().from(table).where(lt(table.column, 5));
// SELECT * FROM table WHERE table.column < 5
```

**lte** - Less than or equal:
```typescript
db.select().from(table).where(lte(table.column, 5));
// SELECT * FROM table WHERE table.column <= 5
```

### Existence Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**exists** - Subquery exists:
```typescript
const query = db.select().from(table2);
db.select().from(table).where(exists(query));
// SELECT * FROM table WHERE EXISTS (SELECT * from table2)
```

**notExists** - Subquery does not exist:
```typescript
const query = db.select().from(table2);
db.select().from(table).where(notExists(query));
// SELECT * FROM table WHERE NOT EXISTS (SELECT * from table2)
```

### Null Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**isNull** - Value is null:
```typescript
db.select().from(table).where(isNull(table.column));
// SELECT * FROM table WHERE table.column IS NULL
```

**isNotNull** - Value is not null:
```typescript
db.select().from(table).where(isNotNull(table.column));
// SELECT * FROM table WHERE table.column IS NOT NULL
```

### Array Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**inArray** - Value in array or subquery:
```typescript
db.select().from(table).where(inArray(table.column, [1, 2, 3, 4]));
// SELECT * FROM table WHERE table.column in (1, 2, 3, 4)
const query = db.select({ data: table2.column }).from(table2);
db.select().from(table).where(inArray(table.column, query));
// SELECT * FROM table WHERE table.column IN (SELECT table2.column FROM table2)
```

**notInArray** - Value not in array or subquery:
```typescript
db.select().from(table).where(notInArray(table.column, [1, 2, 3, 4]));
// SELECT * FROM table WHERE table.column NOT in (1, 2, 3, 4)
```

### Range Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**between** - Value between two values:
```typescript
db.select().from(table).where(between(table.column, 2, 7));
// SELECT * FROM table WHERE table.column BETWEEN 2 AND 7
```

**notBetween** - Value not between two values:
```typescript
db.select().from(table).where(notBetween(table.column, 2, 7));
// SELECT * FROM table WHERE table.column NOT BETWEEN 2 AND 7
```

### String Pattern Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**like** - Case-sensitive pattern matching:
```typescript
db.select().from(table).where(like(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column LIKE '%llo wor%'
```

**ilike** - Case-insensitive pattern matching (PostgreSQL only):
```typescript
db.select().from(table).where(ilike(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column ILIKE '%llo wor%'
```

**notIlike** - Negated case-insensitive pattern matching:
```typescript
db.select().from(table).where(notIlike(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column NOT ILIKE '%llo wor%'
```

### Logical Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**not** - Negate condition:
```typescript
db.select().from(table).where(not(eq(table.column, 5)));
// SELECT * FROM table WHERE NOT (table.column = 5)
```

**and** - All conditions must be true:
```typescript
db.select().from(table).where(and(gt(table.column, 5), lt(table.column, 7)));
// SELECT * FROM table WHERE (table.column > 5 AND table.column < 7)
```

**or** - One or more conditions must be true:
```typescript
db.select().from(table).where(or(gt(table.column, 5), lt(table.column, 7)));
// SELECT * FROM table WHERE (table.column > 5 OR table.column < 7)
```

### PostgreSQL Array Operators

**arrayContains** - Column contains all elements of array/subquery:
```typescript
db.select({ id: posts.id }).from(posts).where(arrayContains(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" @> {Typescript,ORM}
db.select({ id: posts.id }).from(posts).where(arrayContains(posts.tags, db.select({ tags: posts.tags }).from(posts).where(eq(posts.id, 1))));
// select "id" from "posts" where "posts"."tags" @> (select "tags" from "posts" where "posts"."id" = 1)
```

**arrayContained** - Array/subquery contains all elements of column:
```typescript
db.select({ id: posts.id }).from(posts).where(arrayContained(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" <@ {Typescript,ORM}
```

**arrayOverlaps** - Column contains any elements of array/subquery:
```typescript
db.select({ id: posts.id }).from(posts).where(arrayOverlaps(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" && {Typescript,ORM}
```

### overview
Headless TypeScript ORM with SQL-like and relational query APIs, zero dependencies, automatic migrations, multi-database support (PostgreSQL/MySQL/SQLite/SingleStore), serverless-ready.

## Headless TypeScript ORM

Drizzle is a headless TypeScript ORM designed to let you build projects your way without forcing a specific structure. Unlike traditional data frameworks, Drizzle doesn't require building projects around it.

### Core Philosophy

**SQL-like API**: If you know SQL, you know Drizzle. The library embraces SQL rather than abstracting it away, eliminating the double learning curve of learning both SQL and a framework API.

**Relational Query API**: For common scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently. Drizzle always outputs exactly 1 SQL query, making it serverless-friendly.

### Key Features

- **Dual Query APIs**: Both SQL-like and relational query interfaces
- **Schema Definition**: Define and manage database schemas in TypeScript
- **Automatic Migrations**: Generate migrations from schema changes
- **Zero Dependencies**: 31KB slim library, serverless-ready by design
- **Multi-Database Support**: PostgreSQL, MySQL, SQLite, SingleStore with native driver support
- **Type-Safe**: Full TypeScript support

### Examples

Schema definition:
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

SQL-like query:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

Relational query:
```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

Generated migration:
```sql
CREATE TABLE IF NOT EXISTS "countries" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256)
);

CREATE TABLE IF NOT EXISTS "cities" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256),
  "country_id" integer
);

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" 
FOREIGN KEY ("country_id") REFERENCES "countries"("id");
```

### prepared-statements
Prepared statements in Drizzle ORM: concatenate SQL once, reuse precompiled binary for repeated executions; use `.prepare()` then `.execute()` (or `.get()`/`.all()` for SQLite); use `sql.placeholder('name')` for dynamic values.

## Query Performance with Prepared Statements

Drizzle ORM is a thin TypeScript layer on top of SQL with minimal overhead. To achieve near-zero overhead, use prepared statements.

### How Query Execution Works
When running a query:
1. Query builder configurations are concatenated into an SQL string
2. String and parameters are sent to the database driver
3. Driver compiles SQL to binary executable format and sends to database

With prepared statements, SQL concatenation happens once on the Drizzle side, allowing the database driver to reuse the precompiled binary SQL instead of parsing the query repeatedly. This provides extreme performance benefits, especially for large SQL queries.

Different database drivers support prepared statements differently. Drizzle ORM can sometimes outperform even the better-sqlite3 driver.

### Prepared Statement Usage

**PostgreSQL:**
```typescript
const db = drizzle(...);
const prepared = db.select().from(customers).prepare("statement_name");
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

**MySQL:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

**SQLite:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = prepared.all();
const res2 = prepared.all();
```

**SingleStore:**
```typescript
const prepared = db.select().from(customers).prepare();
const res1 = await prepared.execute();
const res2 = await prepared.execute();
```

### Placeholders for Dynamic Values

Use `sql.placeholder(...)` to embed dynamic runtime values:

```typescript
import { sql } from "drizzle-orm";

// Simple placeholder
const p1 = db
  .select()
  .from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare("p1");

await p1.execute({ id: 10 }); // SELECT * FROM customers WHERE id = 10
await p1.execute({ id: 12 }); // SELECT * FROM customers WHERE id = 12

// Complex placeholder with SQL functions
const p2 = db
  .select()
  .from(customers)
  .where(sql`lower(${customers.name}) like ${sql.placeholder('name')}`)
  .prepare("p2");

await p2.execute({ name: '%an%' }); // SELECT * FROM customers WHERE lower(name) like '%an%'
```

For SQLite, use `.get()` and `.all()` instead of `.execute()`:
```typescript
p1.get({ id: 10 });
p2.all({ name: '%an%' });
```

### serverless-performance
Serverless functions reuse connections/prepared statements across 15-min lifetime when declared outside handler; edge functions don't.

## Serverless Performance Benefits

Serverless functions (AWS Lambda, Vercel Server Functions) can live up to 15 minutes and reuse database connections and prepared statements across invocations, providing significant performance benefits.

Edge functions, by contrast, clean up immediately after invocation and offer little to no performance benefits.

### Reusing Connections and Prepared Statements

Declare database connections and prepared statements outside the handler scope to reuse them across multiple invocations:

```ts
const databaseConnection = ...;
const db = drizzle({ client: databaseConnection });
const prepared = db.select().from(...).prepare();

export const handler = async (event: APIGatewayProxyEvent) => {
  return prepared.execute();
}
```

This pattern allows the same connection and prepared statement to be reused for every Lambda invocation within the 15-minute lifetime.

### prisma-extension
Prisma extension adding Drizzle query builder to existing Prisma clients via `$extends(drizzle())` and `prisma.$drizzle` namespace; requires drizzle-prisma-generator for schema generation; supports PostgreSQL/MySQL/SQLite with limitations on relational queries and prepared statements.

## Drizzle Extension for Prisma

Allows using Drizzle alongside Prisma in existing projects by extending the Prisma client with Drizzle API, reusing the same DB connection.

### Setup

1. Install dependencies:
```bash
npm install drizzle-orm
npm install -D drizzle-prisma-generator
```

2. Add generator to `schema.prisma`:
```prisma
generator drizzle {
  provider = "drizzle-prisma-generator"
  output   = "./drizzle"
}
```

3. Generate schema:
```bash
prisma generate
```

4. Extend Prisma client (PostgreSQL example; also available for MySQL and SQLite):
```ts
import { PrismaClient } from '@prisma/client';
import { drizzle } from 'drizzle-orm/prisma/pg';

const prisma = new PrismaClient().$extends(drizzle());
```

5. Use Drizzle queries via `prisma.$drizzle`:
```ts
import { User } from './drizzle';

await prisma.$drizzle.insert().into(User).values({ email: 'sorenbs@drizzle.team', name: 'Søren' });
const users = await prisma.$drizzle.select().from(User);
```

### Limitations

- Relational queries not supported (Prisma driver limitation with array format results)
- SQLite: `.values()` not supported
- Prepared statements: `.prepare()` builds SQL on Drizzle side only, no Prisma API for prepared queries

### quick-start
Install drizzle-orm and drizzle-kit, define PostgreSQL schema with pgTable, configure drizzle.config.ts with dialect/schema/out paths, add generate/migrate npm scripts, run generate to create SQL migrations then migrate to apply them.

## Installation

Install drizzle-orm and drizzle-kit:
```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

## Schema Definition

Create `src/schema.ts` with table definitions using drizzle-orm/pg-core:
```ts
import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  role: text("role").$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
```

## Configuration

Create `drizzle.config.ts`:
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
});
```

## Migration Setup

Add scripts to `package.json`:
```json
{
  "scripts": {
    "generate": "drizzle-kit generate",
    "migrate": "drizzle-kit migrate"
  }
}
```

## Running Migrations

Generate migration files:
```shell
npm run generate
```

This creates SQL migration files in the `drizzle/` directory (e.g., `drizzle/0000_pale_mister_fear.sql`).

Apply migrations to database:
```shell
npm run migrate
```

### read-replicas
withReplicas() automatically routes SELECT queries to read replicas and write operations to primary; supports custom replica selection logic via callback function.

## Read Replicas

The `withReplicas()` function enables automatic routing of SELECT queries to read replica instances while directing CREATE, UPDATE, and DELETE operations to the primary database instance.

### Setup

Create separate database connections for primary and replicas, then combine them:

```ts
// PostgreSQL
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, serial, text, boolean, timestamp, jsonb, withReplicas } from 'drizzle-orm/pg-core';

const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  verified: boolean('verified').notNull().default(false),
  jsonb: jsonb('jsonb').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

const primaryDb = drizzle("postgres://user:password@host:port/primary_db");
const read1 = drizzle("postgres://user:password@host:port/read_replica_1");
const read2 = drizzle("postgres://user:password@host:port/read_replica_2");

const db = withReplicas(primaryDb, [read1, read2]);
```

MySQL/SingleStore setup is similar, using `mysql2/promise` connections and `mysqlTable` or `singlestoreTable`. SQLite uses `libsql` client with `sqliteTable`.

### Usage

Drizzle automatically routes queries:

```ts
// SELECT queries automatically use a replica
await db.select().from(usersTable);

// Write operations use primary
await db.delete(usersTable).where(eq(usersTable.id, 1));

// Force primary for reads
await db.$primary.select().from(usersTable);
```

### Custom Replica Selection

Pass a function as the third argument to implement custom selection logic (e.g., weighted random selection):

```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
  const weight = [0.7, 0.3];
  let cumulativeProbability = 0;
  const rand = Math.random();

  for (const [i, replica] of replicas.entries()) {
    cumulativeProbability += weight[i]!;
    if (rand < cumulativeProbability) return replica;
  }
  return replicas[0]!;
});

await db.select().from(usersTable);
```

Any random selection method can be implemented in the custom function.

### relations
Define one-to-one, one-to-many, and many-to-many table relationships using `one()` and `many()` operators; relations are application-level abstractions independent from database foreign keys; foreign key actions (CASCADE, RESTRICT, NO ACTION, SET NULL, SET DEFAULT) control delete/update behavior; use relationName to disambiguate multiple relations between same tables.

## Purpose
Drizzle relations enable querying relational data with a simple API, abstracting away manual joins. They define relationships between tables at the application level without creating database constraints.

## Relational Queries vs Manual Joins
Relational queries automatically fetch related data:
```ts
const db = drizzle(client, { schema });
const result = await db.query.users.findMany({
  with: { posts: true }
});
// Returns: [{ id: 10, name: "Dan", posts: [...] }]
```

Manual joins require explicit join syntax and result mapping.

## One-to-One Relations
Define with `one()` operator. Two patterns:

**Foreign key in related table (nullable relation):**
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ one }) => ({
  profileInfo: one(profileInfo),
}));

export const profileInfo = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  metadata: jsonb('metadata'),
});

export const profileInfoRelations = relations(profileInfo, ({ one }) => ({
  user: one(users, { 
    fields: [profileInfo.userId], 
    references: [users.id] 
  }),
}));
// user.profileInfo is { ... } | null
```

**Self-referencing (foreign key in same table):**
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  invitedBy: integer('invited_by'),
});

export const usersRelations = relations(users, ({ one }) => ({
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
}));
```

## One-to-Many Relations
Define with `many()` operator on parent, `one()` on child:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content'),
  authorId: integer('author_id'),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text'),
  authorId: integer('author_id'),
  postId: integer('post_id'),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
```

## Many-to-Many Relations
Requires explicit junction/join table:
```ts
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  name: text('name'),
});

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroups = pgTable(
  'users_to_groups',
  {
    userId: integer('user_id').notNull().references(() => users.id),
    groupId: integer('group_id').notNull().references(() => groups.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));
```

## Relations vs Foreign Keys
- **Relations**: Application-level abstraction, don't affect database schema, don't create constraints
- **Foreign Keys**: Database-level constraints, enforced on insert/update/delete, throw errors on violation
- Can be used independently or together; relations work with databases that don't support foreign keys

## Foreign Key Actions
Specify behavior when referenced data is modified using `references()` second argument:
```ts
type UpdateDeleteAction = 'cascade' | 'restrict' | 'no action' | 'set null' | 'set default';

// In column definition:
author: integer('author').references(() => users.id, { onDelete: 'cascade' }).notNull()

// In foreignKey constraint:
foreignKey({
  name: "author_fk",
  columns: [table.author],
  foreignColumns: [users.id],
})
  .onDelete('cascade')
  .onUpdate('cascade')
```

**Actions:**
- `CASCADE`: Delete/update child rows when parent is deleted/updated
- `NO ACTION`: Prevent parent deletion if child rows exist (default)
- `RESTRICT`: Same as NO ACTION
- `SET NULL`: Set foreign key column to NULL when parent is deleted
- `SET DEFAULT`: Set foreign key column to default value when parent is deleted

## Disambiguating Relations
Use `relationName` option when defining multiple relations between same tables:
```ts
export const usersRelations = relations(users, ({ many }) => ({
  author: many(posts, { relationName: 'author' }),
  reviewer: many(posts, { relationName: 'reviewer' }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  reviewer: one(users, {
    fields: [posts.reviewerId],
    references: [users.id],
    relationName: 'reviewer',
  }),
}));
```

### rls.mdx
Define and manage Postgres Row-Level Security policies, roles, and permissions in Drizzle with support for Neon and Supabase providers, including policy linking, role configuration, and transactional RLS execution.

## Row-Level Security (RLS)

Enable RLS on Postgres tables, create policies with various options, and define roles. Works with Neon and Supabase.

### Enable RLS

Use `.enableRLS()` to enable RLS without policies. If no policy exists, a default-deny policy is used (no rows visible/modifiable). Operations like TRUNCATE and REFERENCES are not subject to row security.

```ts
import { integer, pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: integer(),
}).enableRLS();
```

Note: Adding a policy automatically enables RLS, so explicit `.enableRLS()` is unnecessary when adding policies.

### Roles

Define roles with options like `createRole`, `createDb`, `inherit`:

```ts
import { pgRole } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin', { createRole: true, createDb: true, inherit: true });
```

Mark existing database roles to exclude from migrations:

```ts
export const admin = pgRole('admin').existing();
```

### Policies

Define policies as parameters of `pgTable`. Policies are always associated with a specific table.

```ts
import { sql } from 'drizzle-orm';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy('policy', {
		as: 'permissive',
		to: admin,
		for: 'delete',
		using: sql``,
		withCheck: sql``,
	}),
]);
```

**Policy options:**
- `as`: `'permissive'` or `'restrictive'`
- `to`: Role name (string), `'public'`, `'current_role'`, `'current_user'`, `'session_user'`, or `pgRole` object
- `for`: `'all'`, `'select'`, `'insert'`, `'update'`, `'delete'`
- `using`: SQL for USING clause
- `withCheck`: SQL for WITH CHECK clause

**Link policy to existing table:**

```ts
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, realtimeMessages } from "drizzle-orm/supabase";

export const policy = pgPolicy("authenticated role insert policy", {
  for: "insert",
  to: authenticatedRole,
  using: sql``,
}).link(realtimeMessages);
```

### Migrations

Enable role management in `drizzle.config.ts`:

```ts
export default defineConfig({
  dialect: 'postgresql',
  schema: "./drizzle/schema.ts",
  dbCredentials: { url: process.env.DATABASE_URL! },
  entities: {
    roles: true
  }
});
```

Exclude specific roles:

```ts
entities: {
  roles: {
    exclude: ['admin']
  }
}
```

Include specific roles:

```ts
entities: {
  roles: {
    include: ['admin']
  }
}
```

Use provider option to exclude provider-defined roles:

```ts
entities: {
  roles: {
    provider: 'neon'  // or 'supabase'
  }
}
```

Combine provider with exclude:

```ts
entities: {
  roles: {
    provider: 'supabase',
    exclude: ['new_supabase_role']
  }
}
```

### RLS on Views

Use `securityInvoker` in view's WITH options:

```ts
export const roomsUsersProfiles = pgView("rooms_users_profiles")
  .with({
    securityInvoker: true,
  })
  .as((qb) =>
    qb
      .select({
        ...getTableColumns(roomsUsers),
        email: profiles.email,
      })
      .from(roomsUsers)
      .innerJoin(profiles, eq(roomsUsers.userId, profiles.id))
  );
```

### Using with Neon

Use `crudPolicy` from `drizzle-orm/neon` with predefined roles:

```ts
import { crudPolicy } from 'drizzle-orm/neon';
import { integer, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	crudPolicy({ role: admin, read: true, modify: false }),
]);
```

Equivalent to:

```ts
pgPolicy(`crud-${admin.name}-policy-insert`, {
	for: 'insert',
	to: admin,
	withCheck: sql`false`,
}),
pgPolicy(`crud-${admin.name}-policy-update`, {
	for: 'update',
	to: admin,
	using: sql`false`,
	withCheck: sql`false`,
}),
pgPolicy(`crud-${admin.name}-policy-delete`, {
	for: 'delete',
	to: admin,
	using: sql`false`,
}),
pgPolicy(`crud-${admin.name}-policy-select`, {
	for: 'select',
	to: admin,
	using: sql`true`,
}),
```

Neon exposes predefined roles and functions:

```ts
// drizzle-orm/neon
export const authenticatedRole = pgRole('authenticated').existing();
export const anonymousRole = pgRole('anonymous').existing();
export const authUid = (userIdColumn: AnyPgColumn) => sql`(select auth.user_id() = ${userIdColumn})`;
export const neonIdentitySchema = pgSchema('neon_identity');
export const usersSync = neonIdentitySchema.table('users_sync', {
  rawJson: jsonb('raw_json').notNull(),
  id: text().primaryKey().notNull(),
  name: text(),
  email: text(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
});
```

Usage:

```ts
import { sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/neon';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`policy-insert`, {
		for: 'insert',
		to: authenticatedRole,
		withCheck: sql`false`,
	}),
]);
```

### Using with Supabase

Predefined roles from `drizzle-orm/supabase`:

```ts
export const anonRole = pgRole('anon').existing();
export const authenticatedRole = pgRole('authenticated').existing();
export const serviceRole = pgRole('service_role').existing();
export const postgresRole = pgRole('postgres_role').existing();
export const supabaseAuthAdminRole = pgRole('supabase_auth_admin').existing();
```

Usage:

```ts
import { sql } from 'drizzle-orm';
import { serviceRole } from 'drizzle-orm/supabase';
import { integer, pgPolicy, pgRole, pgTable } from 'drizzle-orm/pg-core';

export const admin = pgRole('admin');

export const users = pgTable('users', {
	id: integer(),
}, (t) => [
	pgPolicy(`policy-insert`, {
		for: 'insert',
		to: serviceRole,
		withCheck: sql`false`,
	}),
]);
```

Predefined tables and functions:

```ts
// drizzle-orm/supabase
const auth = pgSchema('auth');
export const authUsers = auth.table('users', {
	id: uuid().primaryKey().notNull(),
});

const realtime = pgSchema('realtime');
export const realtimeMessages = realtime.table('messages', {
	id: bigserial({ mode: 'bigint' }).primaryKey(),
	topic: text().notNull(),
	extension: text({ enum: ['presence', 'broadcast', 'postgres_changes'] }).notNull(),
});

export const authUid = sql`(select auth.uid())`;
export const realtimeTopic = sql`realtime.topic()`;
```

Example with foreign key and policy:

```ts
import { foreignKey, pgPolicy, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    email: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: "profiles_id_fk",
    }).onDelete("cascade"),
    pgPolicy("authenticated can view all profiles", {
      for: "select",
      to: authenticatedRole,
      using: sql`true`,
    }),
  ]
);
```

Link policy to existing Supabase table:

```ts
import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { authenticatedRole, realtimeMessages } from "drizzle-orm/supabase";

export const policy = pgPolicy("authenticated role insert policy", {
  for: "insert",
  to: authenticatedRole,
  using: sql``,
}).link(realtimeMessages);
```

**Supabase RLS with transactions:**

Example `createDrizzle` wrapper for handling transactional work with Supabase:

```ts
type SupabaseToken = {
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  role?: string;
};

export function createDrizzle(token: SupabaseToken, { admin, client }: { admin: PgDatabase<any>; client: PgDatabase<any> }) {
  return {
    admin,
    rls: (async (transaction, ...rest) => {
      return await client.transaction(async (tx) => {
        try {
          await tx.execute(sql`
          select set_config('request.jwt.claims', '${sql.raw(JSON.stringify(token))}', TRUE);
          select set_config('request.jwt.claim.sub', '${sql.raw(token.sub ?? "")}', TRUE);
          set local role ${sql.raw(token.role ?? "anon")};
          `);
          return await transaction(tx);
        } finally {
          await tx.execute(sql`
            select set_config('request.jwt.claims', NULL, TRUE);
            select set_config('request.jwt.claim.sub', NULL, TRUE);
            reset role;
          `);
        }
      }, ...rest);
    }) as typeof client.transaction,
  };
}
```

Usage:

```ts
export async function createDrizzleSupabaseClient() {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  return createDrizzle(decode(session?.access_token ?? ""), { admin, client });
}

async function getRooms() {
  const db = await createDrizzleSupabaseClient();
  return db.rls((tx) => tx.select().from(rooms));
}
```

### relational-queries
Relational query API for fetching nested SQL data with single statement; supports with/columns/where/limit/offset/orderBy/extras/prepared statements.

## Relational Queries

Relational queries provide a typed API for querying nested relational data from SQL databases, avoiding multiple joins and complex data mappings. They generate exactly one SQL statement and are an extension to the core query builder.

### Setup

Pass schema to drizzle initialization:
```ts
import * as schema from './schema';
const db = drizzle({ schema });
await db.query.users.findMany({ with: { posts: true } });
```

For multiple schema files: `drizzle({ schema: { ...schema1, ...schema2 } })`

### Modes

Relational queries use lateral joins of subqueries. PlanetScale doesn't support them.
- MySQL with regular database: `mode: "default"`
- MySQL with PlanetScale: `mode: "planetscale"`

```ts
const db = drizzle({ client: connection, schema, mode: 'planetscale' });
```

### Query Methods

**findMany()** - returns array of records
```ts
const users = await db.query.users.findMany();
```

**findFirst()** - returns single record (adds `limit 1`)
```ts
const user = await db.query.users.findFirst();
```

### Include Relations

Use `with` operator to combine data from related tables:
```ts
// Single relation
const posts = await db.query.posts.findMany({
  with: { comments: true }
});

// Nested relations
const users = await db.query.users.findMany({
  with: {
    posts: {
      with: { comments: true }
    }
  }
});
```

### Partial Field Selection

`columns` parameter includes/excludes specific columns (performed at query level, no extra data transferred):
```ts
// Include specific columns
const posts = await db.query.posts.findMany({
  columns: { id: true, content: true },
  with: { comments: true }
});

// Exclude columns
const posts = await db.query.posts.findMany({
  columns: { content: false }
});

// Only nested relations (empty columns object)
const res = await db.query.users.findMany({
  columns: {},
  with: { posts: true }
});
```

When both `true` and `false` are present, `false` options are ignored. If any `true` is specified, all other fields are excluded.

### Nested Partial Selection

Apply column filtering to nested relations:
```ts
const posts = await db.query.posts.findMany({
  columns: { id: true, content: true },
  with: {
    comments: {
      columns: { authorId: false }
    }
  }
});
```

### Filters

Use operators from `drizzle-orm` or callback syntax:
```ts
import { eq } from 'drizzle-orm';

// Import style
const users = await db.query.users.findMany({
  where: eq(users.id, 1)
});

// Callback style
const users = await db.query.users.findMany({
  where: (users, { eq }) => eq(users.id, 1)
});

// Nested filters
await db.query.posts.findMany({
  where: (posts, { eq }) => eq(posts.id, 1),
  with: {
    comments: {
      where: (comments, { lt }) => lt(comments.createdAt, new Date())
    }
  }
});
```

### Limit & Offset

```ts
// Top-level limit
await db.query.posts.findMany({ limit: 5 });

// Nested limit
await db.query.posts.findMany({
  with: { comments: { limit: 3 } }
});

// Offset only available at top level
await db.query.posts.findMany({
  limit: 5,
  offset: 2,
  with: { comments: { limit: 3 } }
});
```

### Order By

Use core API or callback syntax:
```ts
import { desc, asc } from 'drizzle-orm';

// Import style
await db.query.posts.findMany({
  orderBy: [asc(posts.id)]
});

// Callback style
await db.query.posts.findMany({
  orderBy: (posts, { asc }) => [asc(posts.id)]
});

// Nested ordering
await db.query.posts.findMany({
  orderBy: (posts, { asc }) => [asc(posts.id)],
  with: {
    comments: {
      orderBy: (comments, { desc }) => [desc(comments.id)]
    }
  }
});
```

### Custom Fields (extras)

Add computed fields using SQL expressions. Must explicitly use `.as("<column_name>")`:
```ts
import { sql } from 'drizzle-orm';

// Import style
await db.query.users.findMany({
  extras: {
    loweredName: sql`lower(${users.name})`.as('lowered_name')
  }
});

// Callback style
await db.query.users.findMany({
  extras: {
    loweredName: (users, { sql }) => sql`lower(${users.name})`.as('lowered_name')
  }
});

// With nested relations
const res = await db.query.users.findMany({
  extras: {
    fullName: sql<string>`concat(${users.name}, " ", ${users.name})`.as('full_name')
  },
  with: {
    usersToGroups: { with: { group: true } }
  }
});

// Nested extras
const res = await db.query.posts.findMany({
  extras: (table, { sql }) => ({
    contentLength: sql<number>`length(${table.content})`.as('content_length')
  }),
  with: {
    comments: {
      extras: {
        commentSize: sql<number>`length(${comments.content})`.as('comment_size')
      }
    }
  }
});
```

Note: Aggregations not supported in `extras`, use core queries instead.

### Prepared Statements

Use `.prepare()` with `placeholder()` for parameterized queries:

**Placeholder in where:**
```ts
const prepared = db.query.users.findMany({
  where: (users, { eq }) => eq(users.id, placeholder('id')),
  with: {
    posts: {
      where: (users, { eq }) => eq(users.id, placeholder('pid'))
    }
  }
}).prepare('query_name'); // PostgreSQL requires name

const usersWithPosts = await prepared.execute({ id: 1 });
```

**Placeholder in limit:**
```ts
const prepared = db.query.users.findMany({
  with: {
    posts: { limit: placeholder('limit') }
  }
}).prepare();

const usersWithPosts = await prepared.execute({ limit: 1 });
```

**Placeholder in offset:**
```ts
const prepared = db.query.users.findMany({
  offset: placeholder('offset'),
  with: { posts: true }
}).prepare();

const usersWithPosts = await prepared.execute({ offset: 1 });
```

**Multiple placeholders:**
```ts
const prepared = db.query.users.findMany({
  limit: placeholder('uLimit'),
  offset: placeholder('uOffset'),
  where: (users, { eq, or }) => or(eq(users.id, placeholder('id')), eq(users.id, 3)),
  with: {
    posts: {
      where: (users, { eq }) => eq(users.id, placeholder('pid')),
      limit: placeholder('pLimit')
    }
  }
}).prepare('query_name');

const usersWithPosts = await prepared.execute({ 
  pLimit: 1, uLimit: 3, uOffset: 1, id: 2, pid: 6 
});
```

### schemas
Declare SQL schemas with pgSchema/mysqlSchema/singlestoreSchema; SQLite unsupported; prepends schema names to queries.

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

### seed-generators
30+ data generators for drizzle-seed with options for uniqueness, ranges, precision, array generation, and specialized types (names, emails, locations, geometric shapes).

## Seed Generators Reference

Generators are functions used with `drizzle-seed` to create test data. All generators support `arraySize` parameter to generate arrays of values.

**Warning**: Using `arraySize` with `isUnique` generates unique individual values packed into arrays, not unique arrays.

### Basic Generators

**`default(defaultValue, arraySize)`** - Returns the same value each time.
```ts
funcs.default({ defaultValue: "post content", arraySize: 3 })
```

**`valuesFromArray(values, isUnique, arraySize)`** - Picks from given array. Values can be weighted: `{ weight: number; values: any[] }[]`
```ts
funcs.valuesFromArray({ 
  values: ["Title1", "Title2", "Title3"],
  isUnique: true,
  arraySize: 3 
})
```

**`intPrimaryKey()`** - Sequential integers starting from 1.
```ts
funcs.intPrimaryKey()
```

### Numeric Generators

**`number(minValue, maxValue, precision, isUnique, arraySize)`** - Floating point numbers.
- `precision`: 10 = 0.1 accuracy, 100 = 0.01 accuracy
- Default `maxValue`: `precision * 1000` (non-unique) or `precision * count` (unique)
- Default `minValue`: `-maxValue`

```ts
funcs.number({ minValue: 10, maxValue: 120, precision: 100, isUnique: false, arraySize: 3 })
```

**`int(minValue, maxValue, isUnique, arraySize)`** - Integers in range.
- Default `maxValue`: `1000` (non-unique) or `count * 10` (unique)
- Default `minValue`: `-maxValue`

```ts
funcs.int({ minValue: 0, maxValue: 100, isUnique: false, arraySize: 3 })
```

### Boolean & Temporal Generators

**`boolean(arraySize)`** - True or false values.
```ts
funcs.boolean({ arraySize: 3 })
```

**`date(minDate, maxDate, arraySize)`** - Dates in range.
- Defaults: `minDate: '2020-05-08'`, `maxDate: '2028-05-08'`
- If only one date provided, the other is calculated by ±8 years

```ts
funcs.date({ minDate: "1990-01-01", maxDate: "2010-12-31", arraySize: 3 })
```

**`time(arraySize)`** - 24-hour format time.
```ts
funcs.time({ arraySize: 3 })
```

**`timestamp(arraySize)`** - Timestamps.
```ts
funcs.timestamp({ arraySize: 3 })
```

**`datetime(arraySize)`** - Datetime objects.
```ts
funcs.datetime({ arraySize: 3 })
```

**`year(arraySize)`** - Years in YYYY format.
```ts
funcs.year({ arraySize: 3 })
```

**`interval(isUnique, arraySize)`** - Time intervals (e.g., "1 year 12 days 5 minutes").
```ts
funcs.interval({ isUnique: true, arraySize: 3 })
```

### Data Type Generators

**`json(arraySize)`** - JSON objects with random structure containing: email, name, isGraduated, hasJob, salary, startedWorking, visitedCountries (structure picked randomly).
```ts
funcs.json({ arraySize: 3 })
```

**`string(isUnique, arraySize)`** - Random strings.
```ts
funcs.string({ isUnique: false, arraySize: 3 })
```

**`uuid(arraySize)`** - v4 UUID strings.
```ts
funcs.uuid({ arraySize: 3 })
```

### Person & Location Generators

**`firstName(isUnique, arraySize)`** - Person's first name.
```ts
funcs.firstName({ isUnique: true, arraySize: 3 })
```

**`lastName(isUnique, arraySize)`** - Person's last name.
```ts
funcs.lastName({ isUnique: false, arraySize: 3 })
```

**`fullName(isUnique, arraySize)`** - Person's full name.
```ts
funcs.fullName({ isUnique: true, arraySize: 3 })
```

**`email(arraySize)`** - Unique email addresses.
```ts
funcs.email({ arraySize: 3 })
```

**`phoneNumber(template | prefixes, generatedDigitsNumbers, arraySize)`** - Unique phone numbers.
- Template mode: `template: "+(380) ###-####"` (# replaced with digits)
- Prefix mode: `prefixes: ["+380 99", "+380 67"]`, `generatedDigitsNumbers: 7` or `[7, 7, 10]` per prefix

```ts
funcs.phoneNumber({ template: "+(380) ###-####", arraySize: 3 })
funcs.phoneNumber({ prefixes: ["+380 99", "+380 67"], generatedDigitsNumbers: 7, arraySize: 3 })
funcs.phoneNumber({ prefixes: ["+380 99", "+380 67", "+1"], generatedDigitsNumbers: [7, 7, 10], arraySize: 3 })
```

**`country(isUnique, arraySize)`** - Country names.
```ts
funcs.country({ isUnique: false, arraySize: 3 })
```

**`city(isUnique, arraySize)`** - City names.
```ts
funcs.city({ isUnique: false, arraySize: 3 })
```

**`streetAddress(isUnique, arraySize)`** - Street addresses.
```ts
funcs.streetAddress({ isUnique: false, arraySize: 3 })
```

**`postcode(isUnique, arraySize)`** - Postal codes.
```ts
funcs.postcode({ isUnique: true, arraySize: 3 })
```

**`state(arraySize)`** - US states.
```ts
funcs.state({ arraySize: 3 })
```

### Business & Content Generators

**`jobTitle(arraySize)`** - Job titles.
```ts
funcs.jobTitle({ arraySize: 3 })
```

**`companyName(isUnique, arraySize)`** - Company names.
```ts
funcs.companyName({ isUnique: true, arraySize: 3 })
```

**`loremIpsum(sentencesCount, arraySize)`** - Lorem ipsum text.
- Default `sentencesCount`: 1

```ts
funcs.loremIpsum({ sentencesCount: 2, arraySize: 3 })
```

### Geometric Generators

**`point(minXValue, maxXValue, minYValue, maxYValue, isUnique, arraySize)`** - 2D points.
- Default `maxXValue`/`maxYValue`: `10 * 1000` (non-unique) or `10 * count` (unique)
- Default `minXValue`/`minYValue`: `-maxXValue`/`-maxYValue`

```ts
funcs.point({ 
  minXValue: -5, maxXValue: 20, 
  minYValue: 0, maxYValue: 30, 
  isUnique: true, arraySize: 3 
})
```

**`line(minAValue, maxAValue, minBValue, maxBValue, minCValue, maxCValue, isUnique, arraySize)`** - 2D lines (equation: a*x + b*y + c = 0).
- Default ranges: `10 * 1000` (non-unique) or `10 * count` (unique)
- Default min values: `-max` values

```ts
funcs.line({ 
  minAValue: -5, maxAValue: 20,
  minBValue: 0, maxBValue: 30,
  minCValue: 0, maxCValue: 10,
  isUnique: true, arraySize: 3 
})
```

### Usage Pattern

All generators are used within `seed()` refine callback:
```ts
import { seed } from "drizzle-seed";

await seed(db, schema, { count: 1000 }).refine((funcs) => ({
  tableName: {
    columns: {
      columnName: funcs.generatorName({ /* options */ }),
    },
  },
}));
```

### seed-limitations
Type constraints and inference limitations for the third parameter in drizzle-orm seed operations.

Type limitations for the third parameter in seed operations.

The page documents constraints and type-related issues that developers may encounter when working with the third parameter of seeding functions in drizzle-orm. This covers type inference limitations, type safety concerns, and potential workarounds when the type system cannot properly infer or validate the third parameter.

### seed-overview
Deterministic fake data generation with seedable pRNG for reproducible testing; supports PostgreSQL/SQLite/MySQL with customizable generators, weighted distributions, and related entity creation.

## Drizzle Seed

TypeScript library for generating deterministic, realistic fake data using a seedable pseudorandom number generator (pRNG). Same seed always produces identical data, enabling reproducible testing and debugging.

**Supported databases:** PostgreSQL, SQLite, MySQL (not SingleStore)

**Requirements:** drizzle-orm@0.36.4 or higher

### Installation
```
npm install drizzle-seed
```

### Basic Usage
```ts
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";

const users = pgTable("users", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

const db = drizzle(process.env.DATABASE_URL!);
await seed(db, { users });  // Creates 10 users by default
```

### Options

**`count`** - Number of entities to create (default: 10)
```ts
await seed(db, schema, { count: 1000 });
```

**`seed`** - Seed number for pRNG (different numbers generate different data)
```ts
await seed(db, schema, { seed: 12345 });
```

### Reset Database
```ts
import * as schema from "./schema.ts";
import { reset } from "drizzle-seed";

const db = drizzle(process.env.DATABASE_URL!);
await reset(db, schema);
```

Reset strategies by dialect:
- **PostgreSQL:** `TRUNCATE tableName1, tableName2, ... CASCADE;`
- **MySQL:** Disables `FOREIGN_KEY_CHECKS`, runs `TRUNCATE` per table, re-enables checks
- **SQLite:** Disables `foreign_keys` pragma, runs `DELETE FROM` per table, re-enables pragma

### Refinements

Use `.refine()` callback to customize generation behavior:

```ts
await seed(db, schema).refine((f) => ({
  users: {
    columns: { name: f.fullName() },
    count: 20
  }
}));
```

Refinement properties:
- **`columns`** - Override default generator for each column
- **`count`** - Rows to insert (overrides global count)
- **`with`** - Define related entities to create (one-to-many only)

**Example 1:** Seed users with custom name generation
```ts
await seed(db, { users: schema.users }).refine((f) => ({
  users: {
    columns: { name: f.fullName() },
    count: 20
  }
}));
```

**Example 2:** Seed users with 10 posts each
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 20,
    with: { posts: 10 }
  }
}));
```

**Example 3:** Custom int range and array values
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 5,
    columns: {
      id: f.int({ minValue: 10000, maxValue: 20000, isUnique: true })
    }
  },
  posts: {
    count: 100,
    columns: {
      description: f.valuesFromArray({
        values: ["text1", "text2", "text3"]
      })
    }
  }
}));
```

### Weighted Random

Use weighted distributions for column values and related entity counts:

**Column values with weights:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    count: 5000,
    columns: {
      unitPrice: f.weightedRandom([
        { weight: 0.3, value: f.int({ minValue: 10, maxValue: 100 }) },
        { weight: 0.7, value: f.number({ minValue: 100, maxValue: 300, precision: 100 }) }
      ])
    }
  }
}));
```

**Related entity counts with weights:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    with: {
      details: [
        { weight: 0.6, count: [1, 2, 3] },
        { weight: 0.3, count: [5, 6, 7] },
        { weight: 0.1, count: [8, 9, 10] }
      ]
    }
  }
}));
```

### Complex Example

Full e-commerce schema with 10,000 customers, 200 employees, 50,000 orders with weighted detail counts, 1,000 suppliers, 5,000 products with weighted pricing, and order details with weighted discounts. Uses generators: `companyName()`, `fullName()`, `jobTitle()`, `streetAddress()`, `city()`, `postcode()`, `state()`, `country()`, `phoneNumber()`, `date()`, `int()`, `number()`, `loremIpsum()`, `valuesFromArray()`, `weightedRandom()`, `default()`.

### Limitations

- **`with` type inference:** TypeScript cannot properly infer table references with circular dependencies. The `with` option displays all tables; manually select the one with one-to-many relationship.
- **`with` supports one-to-many only:** Can use `users with posts` but not `posts with users`.
- **Third parameter in Drizzle tables:** No type support (works at runtime only).


### seed-versioning
drizzle-seed versioning allows choosing generator versions to maintain deterministic outputs; v2 fixes unique interval normalization and improves string generation with length constraints.

## Versioning System

`drizzle-seed` uses versioning to maintain deterministic outputs while allowing access to new features. When you upgrade `drizzle-seed`, you can choose which version to use, ensuring existing seeded data remains unchanged if needed.

Specify version in seed call:
```ts
await seed(db, schema, { version: '2' });
```

## How It Works

Each generator has independent versions. When a generator changes, only that generator gets a new version number. You can mix generators from different versions:

| Generator | V1 | V2 | V3 (latest) |
|-----------|----|----|------------|
| LastNameGen | V1 | V2 | - |
| FirstNameGen | V1 | - | V3 |

Examples:
```ts
// Uses latest version of all generators
await seed(db, schema);

// Uses V2 of lastName, V1 of firstName
await seed(db, schema, { version: '2' });

// Uses V1 of all generators
await seed(db, schema, { version: '1' });
```

## Version History

| API Version | NPM Version | Changed Generators |
|-------------|-------------|-------------------|
| v1 | 0.1.1 | - |
| v2 (LTS) | 0.2.1 | `string()`, `interval({ isUnique: true })` |

## Version 2 Changes

### Unique `interval` Generator

**Problem**: Old version generated intervals like `1 minute 60 seconds` and `2 minutes 0 seconds` as distinct values. PostgreSQL normalizes `1 minute 60 seconds` to `2 minutes 0 seconds`, causing unique constraint violations.

**Affected if**: Table has unique `interval` column or using `f.interval({ isUnique: true })` in refine.

Example affected code:
```ts
const intervals = pgTable("intervals", {
    interval: interval().unique()
});

await seed(db, { intervals });
```

### `string` Generators (unique and non-unique)

**Improvement**: Now generates unique strings respecting column length constraints (e.g., `varchar(20)`).

**Affected if**: Table has text-like columns with length parameters or unique text columns, or using `f.string()` / `f.string({ isUnique: true })` in refine.

Example affected code:
```ts
const strings = pgTable("strings", {
    string1: char({ length: 256 }).unique(),
    string2: varchar({ length: 256 }),
    string3: text().unique(),
});

await seed(db, { strings });
```

Explicit usage in refine:
```ts
await seed(db, { strings }).refine((f) => ({
    strings: {
        columns: {
            string1: f.string({ isUnique: true }),
            string2: f.string(),
            string3: f.string({ isUnique: true }),
        }
    }
}));
```

Works across PostgreSQL, MySQL, and SQLite with appropriate column types for each database.

### select
Type-safe SQL SELECT queries with partial selection, filtering, aggregations, CTEs, subqueries, pagination, and database-specific index hints.

## Basic Select
Select all rows with all columns - result type is automatically inferred from table definition:
```ts
const result = await db.select().from(users);
// {id: number; name: string; age: number | null}[]
```
Drizzle explicitly lists columns instead of using `select *` to guarantee field order.

## Partial Select
Select specific columns or use arbitrary expressions:
```ts
const result = await db.select({
  field1: users.id,
  field2: users.name,
}).from(users);

const result = await db.select({
  id: users.id,
  lowerName: sql<string>`lower(${users.name})`,
}).from(users);
```
When using `sql<Type>`, you specify the expected type - Drizzle cannot perform runtime type casts. Use `.mapWith()` for runtime transformations.

## Conditional Select
Build dynamic selection objects:
```ts
async function selectUsers(withName: boolean) {
  return db.select({
    id: users.id,
    ...(withName ? { name: users.name } : {}),
  }).from(users);
}
```

## Distinct Select
```ts
await db.selectDistinct().from(users).orderBy(users.id, users.name);
await db.selectDistinct({ id: users.id }).from(users).orderBy(users.id);
```
PostgreSQL supports `distinct on` clause:
```ts
await db.selectDistinctOn([users.id]).from(users).orderBy(users.id);
await db.selectDistinctOn([users.name], { name: users.name }).from(users).orderBy(users.name);
```

## Advanced Select
Use `getTableColumns()` to include/exclude columns:
```ts
import { getTableColumns, sql } from 'drizzle-orm';

await db.select({
  ...getTableColumns(posts),
  titleLength: sql<number>`length(${posts.title})`,
}).from(posts);

const { content, ...rest } = getTableColumns(posts);
await db.select({ ...rest }).from(posts);
```
Or use relational query API:
```ts
await db.query.posts.findMany({ columns: { title: true } });
await db.query.posts.findMany({ columns: { content: false } });
```

## Filters
Use filter operators in `.where()`:
```ts
import { eq, lt, gte, ne } from 'drizzle-orm';

await db.select().from(users).where(eq(users.id, 42));
await db.select().from(users).where(lt(users.id, 42));
await db.select().from(users).where(gte(users.id, 42));
await db.select().from(users).where(ne(users.id, 42));
```
All operators use the `sql` function internally. Write custom filters:
```ts
import { sql } from 'drizzle-orm';

function equals42(col: Column) {
  return sql`${col} = 42`;
}

await db.select().from(users).where(sql`${users.id} < 42`);
await db.select().from(users).where(equals42(users.id));
await db.select().from(users).where(sql`lower(${users.name}) = 'aaron'`);
```
All values are parameterized automatically: `eq(users.id, 42)` becomes `where "id" = $1; -- params: [42]`

Invert conditions with `not`:
```ts
import { eq, not } from 'drizzle-orm';

await db.select().from(users).where(not(eq(users.id, 42)));
```

## Combining Filters
Use `and()` and `or()`:
```ts
import { eq, and, or } from 'drizzle-orm';

await db.select().from(users).where(
  and(eq(users.id, 42), eq(users.name, 'Dan'))
);

await db.select().from(users).where(
  or(eq(users.id, 42), eq(users.name, 'Dan'))
);
```

## Advanced Filters
Conditional filtering:
```ts
const searchPosts = async (term?: string) => {
  await db.select().from(posts)
    .where(term ? ilike(posts.title, term) : undefined);
};

const searchPosts = async (filters: SQL[]) => {
  await db.select().from(posts).where(and(...filters));
};
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
filters.push(gt(posts.views, 200));
await searchPosts(filters);
```

## Limit & Offset
```ts
await db.select().from(users).limit(10);
await db.select().from(users).limit(10).offset(10);
```

## Order By
```ts
import { asc, desc } from 'drizzle-orm';

await db.select().from(users).orderBy(users.name);
await db.select().from(users).orderBy(desc(users.name));
await db.select().from(users).orderBy(users.name, users.name2);
await db.select().from(users).orderBy(asc(users.name), desc(users.name2));
```

## Advanced Pagination
Limit-offset pagination:
```ts
await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(4)
  .offset(4);

const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```
Cursor-based pagination:
```ts
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};
await nextUserPage(3);
```

## WITH Clause (CTEs)
Common table expressions simplify complex queries:
```ts
const sq = db.$with('sq').as(
  db.select().from(users).where(eq(users.id, 42))
);
const result = await db.with(sq).select().from(sq);
```
Use insert/update/delete in WITH:
```ts
const sq = db.$with('sq').as(
  db.insert(users).values({ name: 'John' }).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.update(users).set({ age: 25 }).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);

const sq = db.$with('sq').as(
  db.delete(users).where(eq(users.name, 'John')).returning()
);
const result = await db.with(sq).select().from(sq);
```
Add aliases to arbitrary SQL values in CTEs:
```ts
const sq = db.$with('sq').as(
  db.select({ 
    name: sql<string>`upper(${users.name})`.as('name'),
  }).from(users)
);
const result = await db.with(sq).select({ name: sq.name }).from(sq);
```
Without an alias, the field becomes `DrizzleTypeError` and cannot be referenced.

## Select from Subquery
```ts
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(sq);

const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(users).leftJoin(sq, eq(users.id, sq.id));
```

## Aggregations
Use aggregation functions with `.groupBy()` and `.having()`:
```ts
import { gt } from 'drizzle-orm';

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
}).from(users).groupBy(users.age);

await db.select({
  age: users.age,
  count: sql<number>`cast(count(${users.id}) as int)`,
}).from(users).groupBy(users.age)
  .having(({ count }) => gt(count, 1));
```
Note: `cast(... as int)` is necessary because `count()` returns `bigint` in PostgreSQL and `decimal` in MySQL. Alternatively use `.mapWith(Number)`.

## Aggregation Helpers
Wrapped `sql` functions for common aggregations. Remember to use `.groupBy()` when selecting aggregating functions with other columns.

**count** - Returns number of values:
```ts
import { count } from 'drizzle-orm'

await db.select({ value: count() }).from(users);
await db.select({ value: count(users.id) }).from(users);
// Equivalent to: sql`count('*')`.mapWith(Number) and sql`count(${users.id})`.mapWith(Number)
```

**countDistinct** - Returns number of non-duplicate values:
```ts
import { countDistinct } from 'drizzle-orm'

await db.select({ value: countDistinct(users.id) }).from(users);
// Equivalent to: sql`count(distinct ${users.id})`.mapWith(Number)
```

**avg** - Returns average of non-null values:
```ts
import { avg } from 'drizzle-orm'

await db.select({ value: avg(users.id) }).from(users);
// Equivalent to: sql`avg(${users.id})`.mapWith(String)
```

**avgDistinct** - Returns average of non-null distinct values:
```ts
import { avgDistinct } from 'drizzle-orm'

await db.select({ value: avgDistinct(users.id) }).from(users);
// Equivalent to: sql`avg(distinct ${users.id})`.mapWith(String)
```

**sum** - Returns sum of non-null values:
```ts
import { sum } from 'drizzle-orm'

await db.select({ value: sum(users.id) }).from(users);
// Equivalent to: sql`sum(${users.id})`.mapWith(String)
```

**sumDistinct** - Returns sum of non-null distinct values:
```ts
import { sumDistinct } from 'drizzle-orm'

await db.select({ value: sumDistinct(users.id) }).from(users);
// Equivalent to: sql`sum(distinct ${users.id})`.mapWith(String)
```

**max** - Returns maximum value:
```ts
import { max } from 'drizzle-orm'

await db.select({ value: max(users.id) }).from(users);
// Equivalent to: sql`max(${users.id})`.mapWith(users.id)
```

**min** - Returns minimum value:
```ts
import { min } from 'drizzle-orm'

await db.select({ value: min(users.id) }).from(users);
// Equivalent to: sql`min(${users.id})`.mapWith(users.id)
```

Advanced aggregation example:
```ts
const orders = sqliteTable('order', {
  id: integer('id').primaryKey(),
  orderDate: integer('order_date', { mode: 'timestamp' }).notNull(),
  requiredDate: integer('required_date', { mode: 'timestamp' }).notNull(),
  shippedDate: integer('shipped_date', { mode: 'timestamp' }),
  shipVia: integer('ship_via').notNull(),
  freight: numeric('freight').notNull(),
  shipName: text('ship_name').notNull(),
  shipCity: text('ship_city').notNull(),
  shipRegion: text('ship_region'),
  shipPostalCode: text('ship_postal_code'),
  shipCountry: text('ship_country').notNull(),
  customerId: text('customer_id').notNull(),
  employeeId: integer('employee_id').notNull(),
});

const details = sqliteTable('order_detail', {
  unitPrice: numeric('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  discount: numeric('discount').notNull(),
  orderId: integer('order_id').notNull(),
  productId: integer('product_id').notNull(),
});

db.select({
  id: orders.id,
  shippedDate: orders.shippedDate,
  shipName: orders.shipName,
  shipCity: orders.shipCity,
  shipCountry: orders.shipCountry,
  productsCount: sql<number>`cast(count(${details.productId}) as int)`,
  quantitySum: sql<number>`sum(${details.quantity})`,
  totalPrice: sql<number>`sum(${details.quantity} * ${details.unitPrice})`,
})
  .from(orders)
  .leftJoin(details, eq(orders.id, details.orderId))
  .groupBy(orders.id)
  .orderBy(asc(orders.id))
  .all();
```

## $count
See dedicated documentation for count API.

## Iterator
MySQL only. Convert large result sets to async iterators to avoid loading all rows into memory:
```ts
const iterator = await db.select().from(users).iterator();

for await (const row of iterator) {
  console.log(row);
}
```
Works with prepared statements:
```ts
const query = await db.select().from(users).prepare();
const iterator = await query.iterator();

for await (const row of iterator) {
  console.log(row);
}
```

## Use Index (MySQL only)
Suggest indexes to the optimizer:
```ts
export const users = mysqlTable('users', {
  id: int('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
}, () => [usersTableNameIndex]);

const usersTableNameIndex = index('users_name_index').on(users.name);

await db.select()
  .from(users, { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { useIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

## Ignore Index (MySQL only)
Tell optimizer to avoid specific indexes:
```ts
await db.select()
  .from(users, { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { ignoreIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

## Force Index (MySQL only)
Force optimizer to use specific indexes:
```ts
await db.select()
  .from(users, { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));

await db.select()
  .from(users)
  .leftJoin(posts, eq(posts.userId, users.id), { forceIndex: usersTableNameIndex })
  .where(eq(users.name, 'David'));
```

### sequences
PostgreSQL sequences for auto-incrementing IDs: create with pgSequence("name", {startWith, maxValue, minValue, cycle, cache, increment}); use nextval/currval/setval/lastval; supports OWNED BY, cycling, caching; has gaps, out-of-order values, no rollback; PostgreSQL only.

## Sequences

PostgreSQL sequences are special single-row tables that generate unique sequential identifiers, commonly used for auto-incrementing primary keys. They provide thread-safe value generation across multiple sessions.

### Key Features

**Creation and Initialization**
- Use `CREATE SEQUENCE` to create sequences with configurable parameters

**Manipulation Functions**
- `nextval('sequence_name')`: Advances sequence and returns next value
- `currval('sequence_name')`: Returns current value for current session
- `setval('sequence_name', value)`: Sets sequence's current value
- `lastval()`: Returns last value from nextval in current session

**Ownership**
- Link sequences to table columns using `OWNED BY` clause
- Dropping table/column automatically drops associated sequence

**Cycling**
- Sequences can cycle when reaching max/min values using `CYCLE` option
- Default is `NO CYCLE`

**Caching**
- Preallocate values using `CACHE` option for performance

### Limitations

- **Gaps**: Aborted transactions or crashes create gaps in sequence values
- **Concurrency**: Values may be out of order across sessions despite uniqueness
- **No Rollback**: Sequence changes aren't rolled back on transaction failure
- **Crash Recovery**: Unlogged sequences may not restore properly after crashes

### Usage

Default behavior: increment by 1, start at 1.

```ts
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

// No params
export const customSequence = pgSequence("name");

// With params
export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});

// In custom schema
export const customSchema = pgSchema('custom_schema');
export const customSequence = customSchema.sequence("name");
```

### Requirements
- drizzle-orm@0.32.0 or higher
- drizzle-kit@0.23.0 or higher
- PostgreSQL only (not supported in SQLite, MySQL, SingleStore)

### set-operations
Six SQL set operations (UNION, UNION ALL, INTERSECT, INTERSECT ALL, EXCEPT, EXCEPT ALL) for combining query results with function-based or method-based syntax; support varies by database.

## Set Operations

SQL set operations combine results from multiple query blocks. Drizzle-orm supports: `UNION`, `UNION ALL`, `INTERSECT`, `INTERSECT ALL`, `EXCEPT`, `EXCEPT ALL`.

### Union
Removes duplicates from combined results of two queries.

```typescript
import { union } from 'drizzle-orm/pg-core'
import { users, customers } from './schema'

const result = await union(
  db.select({ name: users.name }).from(users),
  db.select({ name: customers.name }).from(customers)
).limit(10);

// Or builder pattern:
const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore

### Union All
Keeps duplicates when combining results.

```typescript
import { unionAll } from 'drizzle-orm/pg-core'

const result = await unionAll(
  db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
  db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
);

// Or:
const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales));
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore (with ORDER BY behavior differences)

### Intersect
Returns only rows present in both query results, removing duplicates.

```typescript
import { intersect } from 'drizzle-orm/pg-core'

const result = await intersect(
  db.select({ courseName: depA.courseName }).from(depA),
  db.select({ courseName: depB.courseName }).from(depB)
);

// Or:
const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore

### Intersect All
Returns only rows present in both query results, keeping duplicates.

```typescript
import { intersectAll } from 'drizzle-orm/pg-core'

const result = await intersectAll(
  db.select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered }).from(regularOrders),
  db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders)
);

// Or:
const result = await db
  .select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered })
  .from(regularOrders)
  .intersectAll(db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders));
```

Supported in: PostgreSQL, MySQL (not SingleStore)

### Except
Returns rows from first query that are not in second query, removing duplicates.

```typescript
import { except } from 'drizzle-orm/pg-core'

const result = await except(
  db.select({ courseName: depA.projectsName }).from(depA),
  db.select({ courseName: depB.projectsName }).from(depB)
);

// Or:
const result = await db
  .select({ courseName: depA.projectsName })
  .from(depA)
  .except(db.select({ courseName: depB.projectsName }).from(depB));
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore

### Except All
Returns rows from first query that are not in second query, keeping duplicates.

```typescript
import { exceptAll } from 'drizzle-orm/pg-core'

const result = await exceptAll(
  db.select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered }).from(regularOrders),
  db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders)
);

// Or:
const result = await db
  .select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered })
  .from(regularOrders)
  .exceptAll(db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders));
```

Supported in: PostgreSQL, MySQL (not SingleStore)

All operations support both import-pattern (function-based) and builder-pattern (method-based) syntax. Database-specific imports are required: `drizzle-orm/pg-core`, `drizzle-orm/mysql-core`, `drizzle-orm/sqlite-core`, `drizzle-orm/singlestore-core`.

### schema-declaration
Define TypeScript schemas using dialect-specific table functions (pgTable/mysqlTable/sqliteTable) with columns; organize in single or multiple files; use casing option for camelCase-to-snake_case mapping; PostgreSQL supports pgSchema namespaces; MySQL schemas are databases; SQLite has no schemas.

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

### sql-template
Type-safe parameterized SQL template with automatic escaping, runtime mapping, aliasing, raw SQL fragments, chunk composition, and dialect-specific conversion to query strings and parameters.

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

### transactions
Execute grouped SQL statements atomically with commit/rollback; supports nested transactions, conditional rollback, return values, and dialect-specific isolation/access configs.

## Transactions

SQL transactions group one or more SQL statements into a single logical unit that either commits entirely or rolls back entirely.

### Basic Usage

```ts
const db = drizzle(...)

await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});
```

### Nested Transactions (Savepoints)

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.transaction(async (tx2) => {
    await tx2.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
  });
});
```

### Rollback on Condition

```ts
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  if (account.balance < 100) {
    tx.rollback()
  }
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
});
```

### Return Values

```ts
const newBalance: number = await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  return account.balance;
});
```

### Relational Queries in Transactions

```ts
const db = drizzle({ schema })
await db.transaction(async (tx) => {
  await tx.query.users.findMany({ with: { accounts: true } });
});
```

### Dialect-Specific Configuration

**PostgreSQL:**
```ts
await db.transaction(async (tx) => { /* ... */ }, {
  isolationLevel: "read committed" | "read uncommitted" | "repeatable read" | "serializable",
  accessMode: "read only" | "read write",
  deferrable: boolean,
});
```

**MySQL/SingleStore:**
```ts
await db.transaction(async (tx) => { /* ... */ }, {
  isolationLevel: "read committed" | "read uncommitted" | "repeatable read" | "serializable",
  accessMode: "read only" | "read write",
  withConsistentSnapshot: boolean,
});
```

**SQLite:**
```ts
await db.transaction(async (tx) => { /* ... */ }, {
  behavior: "deferred" | "immediate" | "exclusive",
});
```

### typebox
Plugin generating Typebox validation schemas from Drizzle ORM table/view/enum definitions via createSelectSchema/createInsertSchema/createUpdateSchema with field refinement support and comprehensive type mappings.

## Overview
`drizzle-typebox` is a plugin that generates Typebox schemas from Drizzle ORM schemas. Requires `drizzle-typebox@0.2.0+`, Drizzle ORM v0.36.0+, and Typebox v0.34.8+.

## Select Schema
Validates data queried from the database (API responses).

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';
import { Value } from '@sinclair/typebox/value';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = Value.Parse(userSelectSchema, rows[0]);
```

Works with views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data to be inserted into the database (API requests).

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = Value.Parse(userInsertSchema, user);
await db.insert(users).values(parsed);
```

## Update Schema
Validates data to be updated in the database. Generated columns cannot be updated.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = Value.Parse(userUpdateSchema, user);
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Each create schema function accepts an optional parameter to extend, modify, or overwrite field schemas. Callback functions extend/modify; Typebox schemas overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => Type.String({ ...schema, maxLength: 20 }),
  bio: (schema) => Type.String({ ...schema, maxLength: 1000 }),
  preferences: Type.Object({ theme: Type.String() })
});
```

## Factory Functions
Use `createSchemaFactory` for advanced cases like extended Typebox instances:

```ts
import { createSchemaFactory } from 'drizzle-typebox';
import { t } from 'elysia';

const { createInsertSchema } = createSchemaFactory({ typeboxInstance: t });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => t.Number({ ...schema }, { error: '`name` must be a string' })
});
```

## Data Type Reference
Maps Drizzle column types to Typebox schemas:

- `boolean()` → `Type.Boolean()`
- `date({ mode: 'date' })`, `timestamp({ mode: 'date' })` → `Type.Date()`
- `text()`, `varchar()`, `numeric()`, `time()`, etc. → `Type.String()`
- `uuid()` → `Type.String({ format: 'uuid' })`
- `char({ length })` → `Type.String({ minLength: length, maxLength: length })`
- `varchar({ length })` → `Type.String({ maxLength: length })`
- `text({ enum })`, `char({ enum })`, `varchar({ enum })` → `Type.Enum(enum)`
- `tinyint()` → `Type.Integer({ minimum: -128, maximum: 127 })`
- `tinyint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 255 })`
- `smallint()` → `Type.Integer({ minimum: -32_768, maximum: 32_767 })`
- `smallint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 65_535 })`
- `real()`, `float()` → `Type.Number().min(-8_388_608).max(8_388_607)`
- `mediumint()` → `Type.Integer({ minimum: -8_388_608, maximum: 8_388_607 })`
- `float({ unsigned: true })` → `Type.Number({ minimum: 0, maximum: 16_777_215 })`
- `mediumint({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 16_777_215 })`
- `integer()`, `serial()`, `int()` → `Type.Integer({ minimum: -2_147_483_648, maximum: 2_147_483_647 })`
- `int({ unsigned: true })` → `Type.Integer({ minimum: 0, maximum: 4_294_967_295 })`
- `doublePrecision()`, `double()`, `real()` → `Type.Number({ minimum: -140_737_488_355_328, maximum: 140_737_488_355_327 })`
- `double({ unsigned: true })` → `Type.Number({ minimum: 0, maximum: 281_474_976_710_655 })`
- `bigint({ mode: 'number' })` → `Type.Integer({ minimum: -9_007_199_254_740_991, maximum: 9_007_199_254_740_991 })`
- `serial()` → `Type.Integer({ minimum: 0, maximum: 9_007_199_254_740_991 })`
- `bigint({ mode: 'bigint' })` → `Type.BigInt({ minimum: -9_223_372_036_854_775_808n, maximum: 9_223_372_036_854_775_807n })`
- `bigint({ mode: 'bigint', unsigned: true })` → `Type.BigInt({ minimum: 0, maximum: 18_446_744_073_709_551_615n })`
- `year()` → `Type.Integer({ minimum: 1_901, maximum: 2_155 })`
- `point({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number()])`
- `point({ mode: 'xy' })` → `Type.Object({ x: Type.Number(), y: Type.Number() })`
- `vector({ dimensions })`, `halfvec({ dimensions })` → `Type.Array(Type.Number(), { minItems: dimensions, maxItems: dimensions })`
- `line({ mode: 'abc' })` → `Type.Object({ a: Type.Number(), b: Type.Number(), c: Type.Number() })`
- `line({ mode: 'tuple' })` → `Type.Tuple([Type.Number(), Type.Number(), Type.Number()])`
- `json()`, `jsonb()` → `Type.Recursive((self) => Type.Union([Type.Union([Type.String(), Type.Number(), Type.Boolean(), Type.Null()]), Type.Array(self), Type.Record(Type.String(), self)]))`
- `blob({ mode: 'buffer' })` → `t.Union([t.Union([t.String(), t.Number(), t.Boolean(), t.Null()]), t.Array(t.Any()), t.Record(t.String(), t.Any())])`
- `dataType().array(size)` → `Type.Array(baseDataTypeSchema, { minItems: size, maxItems: size })`


### update
UPDATE statements with .set(), .where(), optional .limit()/.orderBy()/.returning(), WITH clauses for CTEs, and FROM joins (PostgreSQL/SQLite)

## SQL Update

Basic update with `.set()` and `.where()`:
```typescript
await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'));
```

Keys in the set object must match column names. `undefined` values are ignored; pass `null` to set a column to null. SQL expressions can be passed as values:
```typescript
await db.update(users)
  .set({ updatedAt: sql`NOW()` })
  .where(eq(users.name, 'Dan'));
```

### Limit (MySQL, SQLite, SingleStore only)
```typescript
await db.update(usersTable).set({ verified: true }).limit(2);
```

### Order By
```typescript
import { asc, desc } from 'drizzle-orm';

await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name);
await db.update(usersTable).set({ verified: true }).orderBy(desc(usersTable.name));
await db.update(usersTable).set({ verified: true }).orderBy(usersTable.name, usersTable.name2);
await db.update(usersTable).set({ verified: true }).orderBy(asc(usersTable.name), desc(usersTable.name2));
```

### Returning (PostgreSQL, SQLite only)
```typescript
const updatedUserId: { updatedId: number }[] = await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'))
  .returning({ updatedId: users.id });
```

### WITH clause (CTE)
```typescript
const averagePrice = db.$with('average_price').as(
  db.select({ value: sql`avg(${products.price})`.as('value') }).from(products)
);

const result = await db.with(averagePrice)
  .update(products)
  .set({ cheap: true })
  .where(lt(products.price, sql`(select * from ${averagePrice})`))
  .returning({ id: products.id });
```

### Update ... FROM (PostgreSQL, SQLite only)
Join other tables to compute which rows to update and their new values:
```typescript
await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .where(and(eq(cities.name, 'Seattle'), eq(users.name, 'John')));
```

With table aliases:
```typescript
const c = alias(cities, 'c');
await db
  .update(users)
  .set({ cityId: c.id })
  .from(c);
```

PostgreSQL only: return columns from joined tables:
```typescript
const updatedUsers = await db
  .update(users)
  .set({ cityId: cities.id })
  .from(cities)
  .returning({ id: users.id, cityName: cities.name });
```

### upgrade-to-0.21.0
Migration guide for v0.21.0: move dialect from CLI to mandatory config field, unify connection params to `url`, add optional driver for special databases, auto-select drivers by dialect, upgrade snapshots, extract relations from FKs, add custom migration naming and direct migrate command.

## Breaking Changes

**Dialect prefix removal**: Remove `:dialect` from drizzle-kit commands. Change `drizzle-kit push:mysql` to `drizzle-kit push`.

**drizzle.config.ts updates**:
- `dialect` is now mandatory: `"postgresql"`, `"mysql"`, or `"sqlite"`
- `driver` is optional, only use if: `aws-data-api`, `turso`, `d1-http` (WIP), or `expo`
- Replace `connectionString` or `uri` with `url` in `dbCredentials`
- New `migrations` object for custom table/schema:
  ```ts
  import { defineConfig } from "drizzle-kit"
  export default defineConfig({
    dialect: "sqlite",
    driver: "turso",
    dbCredentials: { url: "" },
    migrations: { table: "migrations", schema: "public" }
  })
  ```

**Snapshot upgrade**: PostgreSQL and SQLite snapshots upgrade to version 6. Run `drizzle-kit up` to upgrade.

**Driver auto-selection** (when no driver specified):
- PostgreSQL: tries `pg` → `postgres` → `@vercel/postgres` → `@neondatabase/serverless`
- MySQL: tries `mysql2` → `@planetscale/database`
- SQLite: tries `@libsql/client` → `better-sqlite3`

**MySQL schemas removed**: Drizzle Kit no longer handles schema changes for additional schemas/databases.

## New Features

**Pull relations**: Drizzle extracts foreign key information and generates `relations.ts` during introspection.

**Custom migration names**: Use `drizzle-kit generate --name init_db`

**New migrate command**: `drizzle-kit migrate` applies generated migrations directly. By default stores in `__drizzle_migrations` table (PostgreSQL: `drizzle` schema). Customize via `drizzle.config.ts`:
```ts
export default defineConfig({
  migrations: { table: "migrations", schema: "public" }
})
```

### valibot
Plugin generating Valibot schemas from Drizzle ORM tables with createSelectSchema/createInsertSchema/createUpdateSchema functions, refinements support, and comprehensive type mappings including range-validated integers, geometry, vectors, and JSON.

## Overview
`drizzle-valibot` is a plugin for Drizzle ORM that generates Valibot schemas from Drizzle ORM table definitions. Requires `drizzle-valibot@0.3.0+`, Drizzle ORM v0.36.0+, and Valibot v1.0.0-beta.7+.

## Select Schema
Validates data queried from the database (useful for API responses).

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-valibot';
import { parse } from 'valibot';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = parse(userSelectSchema, rows[0]); // { id: number; name: string; age: number }
```

Works with views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);
const parsed = parse(rolesSchema, ...); // 'admin' | 'basic'

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data before inserting into the database (useful for API requests). Auto-generated columns are excluded.

```ts
const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = parse(userInsertSchema, user); // { name: string, age: number }
await db.insert(users).values(parsed);
```

## Update Schema
Validates data before updating in the database. All fields become optional, and generated columns cannot be updated.

```ts
const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = parse(userUpdateSchema, user); // { name?: string | undefined, age?: number | undefined }
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
All `createSelectSchema`, `createInsertSchema`, and `createUpdateSchema` functions accept an optional second parameter to extend, modify, or overwrite field schemas. Pass a callback function to extend/modify, or a Valibot schema to overwrite.

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => pipe(schema, maxLength(20)), // Extends schema
  bio: (schema) => pipe(schema, maxLength(1000)), // Extends before nullability
  preferences: object({ theme: string() }) // Overwrites field including nullability
});
```

## Data Type Reference
Maps Drizzle ORM column types to Valibot schemas:

**Boolean**: `pg.boolean()` → `boolean()`

**Date**: `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })` → `date()`

**String**: `pg.text()`, `pg.varchar()`, `mysql.binary()`, etc. → `string()`

**Bit**: `pg.bit({ dimensions: ... })` → `pipe(string(), regex(/^[01]+$/), maxLength(dimensions))`

**UUID**: `pg.uuid()` → `pipe(string(), uuid())`

**Char**: `pg.char({ length: ... })` → `pipe(string(), length(length))`

**Varchar**: `pg.varchar({ length: ... })` → `pipe(string(), maxLength(length))`

**MySQL text variants**: `mysql.tinytext()` → `pipe(string(), maxLength(255))`, `mysql.text()` → `maxLength(65_535)`, `mysql.mediumtext()` → `maxLength(16_777_215)`, `mysql.longtext()` → `maxLength(4_294_967_295)`

**Enum**: `pg.text({ enum: [...] })` → `enum([...])`

**Integer types with range validation**:
- `mysql.tinyint()` → `pipe(number(), minValue(-128), maxValue(127), integer())`
- `mysql.tinyint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(255), integer())`
- `pg.smallint()` → `pipe(number(), minValue(-32_768), maxValue(32_767), integer())`
- `mysql.smallint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(65_535), integer())`
- `pg.real()`, `mysql.float()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607))`
- `mysql.mediumint()` → `pipe(number(), minValue(-8_388_608), maxValue(8_388_607), integer())`
- `mysql.float({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215))`
- `mysql.mediumint({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(16_777_215), integer())`
- `pg.integer()`, `mysql.int()` → `pipe(number(), minValue(-2_147_483_648), maxValue(2_147_483_647), integer())`
- `mysql.int({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(4_294_967_295), integer())`
- `pg.doublePrecision()`, `mysql.double()` → `pipe(number(), minValue(-140_737_488_355_328), maxValue(140_737_488_355_327))`
- `mysql.double({ unsigned: true })` → `pipe(number(), minValue(0), maxValue(281_474_976_710_655))`
- `pg.bigint({ mode: 'number' })` → `pipe(number(), minValue(-9_007_199_254_740_991), maxValue(9_007_199_254_740_991), integer())`
- `mysql.serial()` → `pipe(number(), minValue(0), maxValue(9_007_199_254_740_991), integer())`
- `pg.bigint({ mode: 'bigint' })` → `pipe(bigint(), minValue(-9_223_372_036_854_775_808n), maxValue(9_223_372_036_854_775_807n))`
- `mysql.bigint({ mode: 'bigint', unsigned: true })` → `pipe(bigint(), minValue(0n), maxValue(18_446_744_073_709_551_615n))`

**Year**: `mysql.year()` → `pipe(number(), minValue(1_901), maxValue(2_155), integer())`

**Geometry**: `pg.point({ mode: 'tuple' })` → `tuple([number(), number()])`, `pg.point({ mode: 'xy' })` → `object({ x: number(), y: number() })`

**Vectors**: `pg.vector({ dimensions: ... })` → `pipe(array(number()), length(dimensions))`

**Line**: `pg.line({ mode: 'abc' })` → `object({ a: number(), b: number(), c: number() })`, `pg.line({ mode: 'tuple' })` → `tuple([number(), number(), number()])`

**JSON**: `pg.json()`, `pg.jsonb()`, `mysql.json()` → `union([union([string(), number(), boolean(), null_()]), array(any()), record(string(), any())])`

**Buffer**: `sqlite.blob({ mode: 'buffer' })` → `custom<Buffer>((v) => v instanceof Buffer)`

**Arrays**: `pg.dataType().array(...)` → `pipe(array(baseDataTypeSchema), length(size))`

### views
Declare views via inline/standalone query builders or raw SQL; mark existing views with .existing(); PostgreSQL supports materialized views with refresh operations and extended configuration options.

## Declaring Views

Views can be declared in three ways:
1. **Inline query builder** - passed directly to `.as()`
2. **Standalone query builder** - created separately and passed to `.as()`
3. **Raw SQL** - using `sql` operator with explicit column schema

### Basic Declaration (Inline Query Builder)

PostgreSQL:
```ts
import { pgTable, pgView, serial, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial(),
  name: text(),
  email: text(),
  password: text(),
  role: text().$type<"admin" | "customer">(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const userView = pgView("user_view").as((qb) => qb.select().from(user));
export const customersView = pgView("customers_view").as((qb) => 
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

MySQL and SQLite use `mysqlView` and `sqliteView` respectively with identical syntax.

### Selecting Specific Columns

```ts
export const customersView = pgView("customers_view").as((qb) => {
  return qb
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
    })
    .from(user);
});
```

### Standalone Query Builder

```ts
import { pgTable, pgView, serial, text, timestamp, QueryBuilder } from "drizzle-orm/pg-core";

const qb = new QueryBuilder();

export const userView = pgView("user_view").as(qb.select().from(user));
export const customersView = pgView("customers_view").as(
  qb.select().from(user).where(eq(user.role, "customer"))
);
```

### Raw SQL Declaration

When query builder syntax is insufficient, use `sql` operator with explicit column schema:

```ts
const newYorkers = pgView('new_yorkers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  cityId: integer('city_id').notNull(),
}).as(sql`select * from ${users} where ${eq(users.cityId, 1)}`);
```

## Existing Views

For read-only access to existing database views, use `.existing()` to prevent migration generation:

```ts
export const trimmedUser = pgView("trimmed_user", {
  id: serial("id"),
  name: text("name"),
  email: text("email"),
}).existing();
```

## Materialized Views (PostgreSQL Only)

PostgreSQL supports materialized views that persist results in table-like form.

```ts
const newYorkers = pgMaterializedView('new_yorkers').as((qb) => 
  qb.select().from(users).where(eq(users.cityId, 1))
);
```

Refresh at runtime:
```ts
await db.refreshMaterializedView(newYorkers);
await db.refreshMaterializedView(newYorkers).concurrently();
await db.refreshMaterializedView(newYorkers).withNoData();
```

## Extended Configuration

Views support additional options via `.with()`, `.using()`, `.tablespace()`, and `.withNoData()`:

```ts
const newYorkers = pgView('new_yorkers')
  .with({
    checkOption: 'cascaded',
    securityBarrier: true,
    securityInvoker: true,
  })
  .as((qb) => {
    const sq = qb
      .$with('sq')
      .as(
        qb.select({ userId: users.id, cityId: cities.id })
          .from(users)
          .leftJoin(cities, eq(cities.id, users.homeCity))
          .where(sql`${users.age1} > 18`),
      );
    return qb.with(sq).select().from(sq).where(sql`${users.homeCity} = 1`);
  });

const newYorkers2 = pgMaterializedView('new_yorkers')
  .using('btree')
  .with({
    fillfactor: 90,
    toast_tuple_target: 0.5,
    autovacuum_enabled: true,
  })
  .tablespace('custom_tablespace')
  .withNoData()
  .as((qb) => { /* ... */ });
```

**Supported databases**: PostgreSQL, SQLite, MySQL (not SingleStore)

### why-drizzle
Headless TypeScript ORM with SQL-like and relational query APIs, zero dependencies, serverless-ready, doesn't force project structure.

## Headless ORM Philosophy
Drizzle is a headless TypeScript ORM - a library and collection of opt-in tools that lets you build projects with it, not around it. Unlike data frameworks (Django-like, Spring-like), Drizzle doesn't force your project structure.

## SQL-Like Query API
Drizzle embraces SQL at its core. If you know SQL, you know Drizzle - zero to minimal learning curve. It provides SQL schema declaration, SQL-like queries, automatic migrations, and a relational query API.

Example - SQL-like queries:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

Schema definition:
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

Generated migration:
```sql
CREATE TABLE IF NOT EXISTS "countries" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256)
);

CREATE TABLE IF NOT EXISTS "cities" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256),
  "country_id" integer
);

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
```

## Relational Query API
For common scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently and performantly. Always outputs exactly 1 SQL query, making it serverless-database friendly.

```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Serverless-Ready Design
Drizzle has zero dependencies. It's dialect-specific, slim, performant, and serverless-ready by design. Supports PostgreSQL, MySQL, and SQLite through industry-standard database drivers.

## Key Characteristics
- Lightweight, performant, typesafe
- Non-intrusive to project structure
- Both SQL-like and relational query APIs
- Zero dependencies
- Serverless-ready
- Full SQL dialect support

### zod
Generate Zod schemas from Drizzle tables via createSelectSchema/createInsertSchema/createUpdateSchema with field refinements and factory support for extended Zod instances and type coercion; includes complete type mapping reference.

## Overview
`drizzle-zod` is a plugin that generates Zod schemas from Drizzle ORM schemas for validation.

**Requirements:** drizzle-zod@0.6.0+, Drizzle ORM v0.36.0+, Zod v3.25.1+

## Select Schema
Validates data queried from the database (API responses).

```ts
import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';

const users = pgTable('users', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: text().notNull(),
  age: integer().notNull()
});

const userSelectSchema = createSelectSchema(users);
const rows = await db.select().from(users).limit(1);
const parsed = userSelectSchema.parse(rows[0]); // { id: number; name: string; age: number }
```

Supports views and enums:
```ts
const roles = pgEnum('roles', ['admin', 'basic']);
const rolesSchema = createSelectSchema(roles);

const usersView = pgView('users_view').as((qb) => qb.select().from(users).where(gt(users.age, 18)));
const usersViewSchema = createSelectSchema(usersView);
```

## Insert Schema
Validates data to be inserted (API requests).

```ts
import { createInsertSchema } from 'drizzle-zod';

const userInsertSchema = createInsertSchema(users);
const user = { name: 'Jane', age: 30 };
const parsed = userInsertSchema.parse(user); // { name: string, age: number }
await db.insert(users).values(parsed);
```

## Update Schema
Validates data to be updated. Generated columns cannot be updated.

```ts
import { createUpdateSchema } from 'drizzle-zod';

const userUpdateSchema = createUpdateSchema(users);
const user = { age: 35 };
const parsed = userUpdateSchema.parse(user); // { name?: string | undefined, age?: number | undefined }
await db.update(users).set(parsed).where(eq(users.name, 'Jane'));
```

## Refinements
Extend, modify, or overwrite field schemas via optional parameter:

```ts
const userSelectSchema = createSelectSchema(users, {
  name: (schema) => schema.max(20), // Extends schema
  bio: (schema) => schema.max(1000), // Extends before nullability
  preferences: z.object({ theme: z.string() }) // Overwrites field
});
```

## Factory Functions
`createSchemaFactory` for advanced use cases.

**Extended Zod instance:**
```ts
import { createSchemaFactory } from 'drizzle-zod';
import { z } from '@hono/zod-openapi';

const { createInsertSchema } = createSchemaFactory({ zodInstance: z });
const userInsertSchema = createInsertSchema(users, {
  name: (schema) => schema.openapi({ example: 'John' })
});
```

**Type coercion:**
```ts
const { createInsertSchema } = createSchemaFactory({
  coerce: { date: true } // or coerce: true for all types
});
const userInsertSchema = createInsertSchema(users);
// createdAt: z.coerce.date()
```

## Data Type Reference
Comprehensive mapping of Drizzle column types to Zod schemas:

- **Boolean:** `pg.boolean()` → `z.boolean()`
- **Date:** `pg.date({ mode: 'date' })`, `pg.timestamp({ mode: 'date' })` → `z.date()`
- **String:** `pg.text()`, `pg.varchar()`, `mysql.binary()` → `z.string()`
- **UUID:** `pg.uuid()` → `z.string().uuid()`
- **Char:** `pg.char({ length: 10 })` → `z.string().length(10)`
- **Varchar:** `pg.varchar({ length: 100 })` → `z.string().max(100)`
- **MySQL text variants:** `tinytext` → `z.string().max(255)`, `text` → `z.string().max(65_535)`, `mediumtext` → `z.string().max(16_777_215)`, `longtext` → `z.string().max(4_294_967_295)`
- **Enum:** `pg.text({ enum: ['a', 'b'] })` → `z.enum(['a', 'b'])`
- **Bit:** `pg.bit({ dimensions: 8 })` → `z.string().regex(/^[01]+$/).max(8)`
- **Integer types:** `pg.smallint()` → `z.number().min(-32_768).max(32_767).int()`, `pg.integer()` → `z.number().min(-2_147_483_648).max(2_147_483_647).int()`, `mysql.tinyint()` → `z.number().min(-128).max(127).int()`, unsigned variants adjust min to 0
- **Float/Double:** `pg.real()`, `mysql.float()` → `z.number()` with appropriate bit limits
- **BigInt:** `pg.bigint({ mode: 'bigint' })` → `z.bigint().min(-9_223_372_036_854_775_808n).max(9_223_372_036_854_775_807n)`, unsigned → `z.bigint().min(0).max(18_446_744_073_709_551_615n)`
- **BigInt (number mode):** `pg.bigint({ mode: 'number' })` → `z.number().min(-9_007_199_254_740_991).max(9_007_199_254_740_991).int()`
- **Year:** `mysql.year()` → `z.number().min(1_901).max(2_155).int()`
- **Geometry:** `pg.point({ mode: 'tuple' })` → `z.tuple([z.number(), z.number()])`, `pg.point({ mode: 'xy' })` → `z.object({ x: z.number(), y: z.number() })`
- **Vector:** `pg.vector({ dimensions: 3 })` → `z.array(z.number()).length(3)`
- **Line:** `pg.line({ mode: 'abc' })` → `z.object({ a: z.number(), b: z.number(), c: z.number() })`, `pg.line({ mode: 'tuple' })` → `z.tuple([z.number(), z.number(), z.number()])`
- **JSON:** `pg.json()`, `pg.jsonb()` → `z.union([z.union([z.string(), z.number(), z.boolean(), z.null()]), z.record(z.any()), z.array(z.any())])`
- **Buffer:** `sqlite.blob({ mode: 'buffer' })` → `z.custom<Buffer>((v) => v instanceof Buffer)`
- **Array:** `pg.dataType().array(size)` → `z.array(baseDataTypeSchema).length(size)`

