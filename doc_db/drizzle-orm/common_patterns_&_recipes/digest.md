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
