

## Pages

### conditional-filters-in-query
Conditional filtering with `.where()`, combining filters with `and()`/`or()`, dynamic filter arrays, and custom operator creation via `sql` expressions.

## Conditional Filters in Query

Apply filters conditionally using `.where()` with logical operators:

```ts
import { ilike } from 'drizzle-orm';
const searchPosts = async (term?: string) => {
  await db.select().from(posts)
    .where(term ? ilike(posts.title, term) : undefined);
};
await searchPosts(); // select * from posts;
await searchPosts('AI'); // select * from posts where title ilike 'AI';
```

Combine multiple conditional filters with `and()` or `or()`:

```ts
import { and, gt, ilike, inArray } from 'drizzle-orm';
const searchPosts = async (term?: string, categories: string[] = [], views = 0) => {
  await db.select().from(posts).where(
    and(
      term ? ilike(posts.title, term) : undefined,
      categories.length > 0 ? inArray(posts.category, categories) : undefined,
      views > 100 ? gt(posts.views, views) : undefined,
    ),
  );
};
await searchPosts(); // select * from posts;
await searchPosts('AI', ['Tech', 'Art', 'Science'], 200);
// select * from posts where (title ilike 'AI' and category in ('Tech', 'Science', 'Art') and views > 200);
```

Build filters dynamically by collecting them in an array and passing to `and()` or `or()`:

```ts
import { SQL } from 'drizzle-orm';
const searchPosts = async (filters: SQL[]) => {
  await db.select().from(posts).where(and(...filters));
};
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
filters.push(gt(posts.views, 200));
await searchPosts(filters);
```

Create custom filter operators using `sql` template:

```ts
import { AnyColumn, sql } from 'drizzle-orm';
const lenlt = (column: AnyColumn, value: number) => {
  return sql`length(${column}) < ${value}`;
};
const searchPosts = async (maxLen = 0, views = 0) => {
  await db.select().from(posts).where(
    and(
      maxLen ? lenlt(posts.title, maxLen) : undefined,
      views > 100 ? gt(posts.views, views) : undefined,
    ),
  );
};
await searchPosts(8); // select * from posts where length(title) < 8;
await searchPosts(8, 200); // select * from posts where (length(title) < 8 and views > 200);
```

Drizzle operators are SQL expressions. Example implementation of `lt`:
```js
const lt = (left, right) => sql`${left} < ${bindIfParam(right, left)}`;
```

### count-rows
Count rows using count() function with database-specific type casting (PostgreSQL/MySQL need integer cast, SQLite returns integer); supports filtering, joins, and grouping.

## Counting Rows

Use `count()` function to count all rows:
```ts
import { count } from 'drizzle-orm';
await db.select({ count: count() }).from(products);
// select count(*) from products;
```

Or with `sql` operator:
```ts
await db.select({ count: sql`count(*)`.mapWith(Number) }).from(products);
```

Result type: `{ count: number }[]`

## Count Non-NULL Values in a Column

```ts
await db.select({ count: count(products.discount) }).from(products);
// select count("discount") from products;
```

## Database-Specific Casting

PostgreSQL and MySQL return `count()` as bigint (interpreted as string), requiring explicit cast to integer:
```ts
const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};
await db.select({ count: customCount() }).from(products);
await db.select({ count: customCount(products.discount) }).from(products);
```

SQLite returns `count()` as integer natively:
```ts
await db.select({ count: sql<number>`count(*)` }).from(products);
await db.select({ count: sql<number>`count(${products.discount})` }).from(products);
```

## Type Specification Warning

When using `sql<number>`, you declare the expected type. Drizzle cannot perform runtime type casts—if the type generic is incorrect, the runtime value won't match. Use `.mapWith()` for runtime transformations.

## Conditional Counting

Use `.where()` to count rows matching a condition:
```ts
await db
  .select({ count: count() })
  .from(products)
  .where(gt(products.price, 100));
// select count(*) from products where price > 100
```

## Count with Joins and Aggregations

```ts
await db
  .select({
    country: countries.name,
    citiesCount: count(cities.id),
  })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id)
  .orderBy(countries.name);
// select countries.name, count("cities"."id") from countries
//   left join cities on countries.id = cities.country_id
//   group by countries.id
//   order by countries.name;
```

### cursor-based-pagination
Cursor-based pagination: use cursor (last row pointer) with gt/lt comparisons and orderBy; supports multi-column cursors for non-unique columns, non-sequential PKs, dynamic ordering, and relational queries; requires indexing cursor columns.

## Cursor-Based Pagination

Cursor-based pagination uses a cursor (pointer to a specific row) to fetch the next page of results, rather than using offset/limit. The cursor should be unique and sequential.

### Basic Implementation

```ts
import { asc, gt } from 'drizzle-orm';
import { users } from './schema';

const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};

await nextUserPage(3); // pass cursor of last row from previous page
```

### Dynamic Order Direction

```ts
import { asc, desc, gt, lt } from 'drizzle-orm';

const nextUserPage = async (order: 'asc' | 'desc' = 'asc', cursor?: number, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .where(cursor ? (order === 'asc' ? gt(users.id, cursor) : lt(users.id, cursor)) : undefined)
    .limit(pageSize)
    .orderBy(order === 'asc' ? asc(users.id) : desc(users.id));
};

await nextUserPage();
await nextUserPage('asc', 3);
await nextUserPage('desc', 7);
```

### Multi-Column Cursor (Non-Unique Columns)

For ordering by non-unique columns, use multiple columns in the cursor:

```ts
import { and, asc, eq, gt, or } from 'drizzle-orm';

const nextUserPage = async (
  cursor?: { id: number; firstName: string },
  pageSize = 3,
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.firstName, cursor.firstName),
            and(eq(users.firstName, cursor.firstName), gt(users.id, cursor.id)),
          )
        : undefined,
    )
    .limit(pageSize)
    .orderBy(asc(users.firstName), asc(users.id));
};

await nextUserPage({ id: 2, firstName: 'Alex' });
```

Generated SQL: `select * from users where (first_name > 'Alex' or (first_name = 'Alex' and id > 2)) order by first_name asc, id asc limit 3;`

### Non-Sequential Primary Keys (UUIDv4)

For non-sequential primary keys, combine with a sequential column like `created_at`:

```ts
const nextUserPage = async (
  cursor?: { id: string; createdAt: Date },
  pageSize = 3,
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.createdAt, cursor.createdAt),
            and(eq(users.createdAt, cursor.createdAt), gt(users.id, cursor.id)),
          )
        : undefined,
    )
    .limit(pageSize)
    .orderBy(asc(users.createdAt), asc(users.id));
};

await nextUserPage({
  id: '66ed00a4-c020-4dfd-a1ca-5d2e4e54d174',
  createdAt: new Date('2024-03-09T17:59:36.406Z'),
});
```

### Relational Query API

```ts
import * as schema from './db/schema';

const db = drizzle(..., { schema });

const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.query.users.findMany({
    where: (users, { gt }) => (cursor ? gt(users.id, cursor) : undefined),
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
  });
};

await nextUserPage(3);
```

### Indexing

Create indices on cursor columns for query efficiency:

```ts
import { index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  // columns
}, (t) => [
  index('first_name_index').on(t.firstName).asc(),
  index('first_name_and_id_index').on(t.firstName, t.id).asc(),
]);
```

### Benefits vs Drawbacks

**Benefits**: Consistent results with no skipped/duplicated rows on insert/delete; more efficient than offset/limit as it doesn't scan previous rows.

**Drawbacks**: Cannot directly navigate to specific pages; more complex implementation, especially with multiple cursor columns.

Use offset/limit pagination if you need direct page navigation or simpler implementation.

### d1_http_api_configuration
Configure drizzle.config.ts with dialect: 'sqlite', driver: 'd1-http', and D1 credentials (accountId, databaseId, token from Cloudflare dashboard) to use Drizzle Kit with Cloudflare D1 HTTP API for migrations and database management.

## Cloudflare D1 HTTP API with Drizzle Kit

Configure Drizzle Kit to work with Cloudflare D1 using HTTP API instead of direct database connections.

### Prerequisites
- Drizzle Kit v0.21.3 or higher
- Drizzle Studio
- Drizzle Chrome Extension
- Cloudflare account with deployed D1 database
- API token with D1 edit permissions

### Configuration

Set up `drizzle.config.ts`:

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

Key settings:
- `dialect: 'sqlite'` - D1 uses SQLite
- `driver: 'd1-http'` - Use HTTP API driver
- `dbCredentials` - Requires three environment variables

### Getting Credentials

1. **accountId**: Workers & Pages → Overview → copy Account ID from right sidebar
2. **databaseId**: Open your D1 database → copy Database ID
3. **token**: My profile → API Tokens → create new token with D1 edit permissions

### Supported Commands

After configuration, you can run: `migrate`, `push`, `introspect`, and `studio` commands via Cloudflare D1 HTTP API.

### Browser Access

Use the Drizzle Chrome Extension to browse and manage Cloudflare D1 databases directly in the Cloudflare admin panel.

### decrementing-a-value
Decrement columns with sql`${column} - value` in update().set() or via custom helper function; supports PostgreSQL, MySQL, SQLite.

## Decrementing Column Values

To decrement a column value in an update statement, use the `update().set()` method with the `sql` operator:

```ts
import { eq, sql } from 'drizzle-orm';

await db
  .update(table)
  .set({
    counter: sql`${table.counter} - 1`,
  })
  .where(eq(table.id, 1));
```

This generates: `update "table" set "counter" = "counter" - 1 where "id" = 1;`

For reusable decrement logic, create a custom function:

```ts
import { AnyColumn } from 'drizzle-orm';

const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

await db
  .update(table)
  .set({
    counter1: decrement(table.counter1),
    counter2: decrement(table.counter2, 10),
  })
  .where(eq(table.id, 1));
```

Supported on PostgreSQL, MySQL, and SQLite.

### empty-array-default-value
Set empty array defaults in PostgreSQL (sql`'{}'::text[]`), MySQL (json type with default([]) or JSON_ARRAY()), SQLite (text with mode: 'json' and json_array()); use .$type<T>() for type inference.

## Setting Empty Array as Default Value

### PostgreSQL
Use `sql` operator with array syntax:
```ts
import { sql } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  tags1: text('tags1').array().notNull().default(sql`'{}'::text[]`),
  tags2: text('tags2').array().notNull().default(sql`ARRAY[]::text[]`),
});
```

### MySQL
MySQL lacks native array type; use `json` instead with `JSON_ARRAY()` or `sql` operator:
```ts
import { sql } from 'drizzle-orm';
import { json, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  tags1: json('tags1').$type<string[]>().notNull().default([]),
  tags2: json('tags2').$type<string[]>().notNull().default(sql`('[]')`),
  tags3: json('tags3').$type<string[]>().notNull().default(sql`(JSON_ARRAY())`),
});
```
The `mode` option (e.g., `json` mode) defines how values are handled in the application. Use `.$type<..>()` for compile-time type inference and protection for default values, insert and select schemas.

### SQLite
SQLite lacks native array type; use `text` with `json` mode:
```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  tags1: text('tags1', { mode: 'json' }).notNull().$type<string[]>().default(sql`(json_array())`),
  tags2: text('tags2', { mode: 'json' }).notNull().$type<string[]>().default(sql`'[]'`),
});
```
The `mode: 'json'` option treats values as JSON object literals. Use `.$type<..>()` for compile-time type inference.

### full-text-search-with-generated-columns
Implement PostgreSQL full-text search using generated columns with custom tsvector type, to_tsvector() for indexing, and @@ operator for queries; support weighted multi-column search with setweight().

## Full-Text Search with Generated Columns in PostgreSQL

Generated columns are special columns that are always computed from other columns, eliminating the need to compute values on every query.

### Basic Full-Text Search Setup

Define a custom `tsvector` type and create a generated column that converts text to a searchable vector:

```ts
import { SQL, sql } from 'drizzle-orm';
import { index, pgTable, serial, text, customType } from 'drizzle-orm/pg-core';

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
```

When inserting data, the generated column is automatically computed:

```ts
await db.insert(posts).values({
  body: "Golden leaves cover the quiet streets...",
  title: "The Beauty of Autumn",
}).returning();
// Returns: bodySearch: "'air':13 'breez':10 'bring':14 'chang':23 'cover':3..."
```

Query using the `@@` operator for full-text matching:

```ts
const searchParam = "bring";
await db.select().from(posts)
  .where(sql`${posts.bodySearch} @@ to_tsquery('english', ${searchParam})`);
```

### Advanced: Weighted Full-Text Search

Combine multiple columns with different weights using `setweight()` to prioritize matches from title over body:

```ts
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

// Query
const search = 'travel';
await db.select().from(posts)
  .where(sql`${posts.search} @@ to_tsquery('english', ${search})`);
```

The GIN index on the generated column optimizes query performance.

### gel-auth-extension
Integrate Gel's auth extension with Drizzle: define User type with ext::auth::Identity in ESDL, apply migrations, configure drizzle.config.ts with gel dialect and auth schema filter, then pull schema with drizzle-kit.

## Setting up Gel auth extension with Drizzle

This guide walks through integrating Gel's auth extension with Drizzle ORM.

**Step 1: Define Gel auth schema**

In `dbschema/default.esdl`, add the auth extension and define a User type with identity:

```esdl
using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id, username, email }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  type User {
    required identity: ext::auth::Identity;
    required username: str;
    required email: str;
  }
}
```

**Step 2: Push schema to database**

```bash
gel migration create
gel migration apply
```

**Step 3: Configure Drizzle**

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'gel',
  schemaFilter: ['ext::auth', 'public']
});
```

**Step 4: Pull schema with drizzle-kit**

Run `drizzle-kit pull` to generate TypeScript schema definitions. The generated schema includes all auth tables from `ext::auth`:

```typescript
import { gelTable, uniqueIndex, uuid, text, gelSchema, timestamptz, foreignKey } from "drizzle-orm/gel-core"
import { sql } from "drizzle-orm"

export const extauth = gelSchema('ext::auth');

export const identityInExtauth = extauth.table('Identity', {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	createdAt: timestamptz('created_at').default(sql`(clock_timestamp())`).notNull(),
	issuer: text().notNull(),
	modifiedAt: timestamptz('modified_at').notNull(),
	subject: text().notNull(),
}, (table) => [
	uniqueIndex('6bc2dd19-bce4-5810-bb1b-7007afe97a11;schemaconstr').using(
		'btree',
		table.id.asc().nullsLast().op('uuid_ops'),
	),
]);

export const user = gelTable('User', {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	email: text().notNull(),
	identityId: uuid('identity_id').notNull(),
	username: text().notNull(),
}, (table) => [
	uniqueIndex('d504514c-26a7-11f0-b836-81aa188c0abe;schemaconstr').using(
		'btree',
		table.id.asc().nullsLast().op('uuid_ops'),
	),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identityInExtauth.id],
		name: 'User_fk_identity',
	}),
]);
```

The generated schema can then be used in queries.

### include-or-exclude-columns
Multiple methods to include/exclude columns: .select() with field objects, getTableColumns() utility with spread/destructuring, relational queries with columns/extras/with options, conditional selection with spread operators.

## Including/Excluding Columns in Queries

### Basic Selection
- `.select()` with no arguments returns all columns
- `.select({ title: posts.title })` returns only specific columns

### Using getTableColumns() Utility
- `getTableColumns(table)` returns all table columns as an object
- Spread to include all: `.select({ ...getTableColumns(posts) })`
- Exclude by destructuring: `const { content, ...rest } = getTableColumns(posts); .select({ ...rest })`
- Add computed columns: `.select({ ...getTableColumns(posts), titleLength: sql<number>\`length(${posts.title})\` })`

### With Joins
```ts
const { userId, postId, ...rest } = getTableColumns(comments);
await db
  .select({
    postId: posts.id,
    comment: { ...rest },
    user: users, // equivalent to getTableColumns(users)
  })
  .from(posts)
  .leftJoin(comments, eq(posts.id, comments.postId))
  .leftJoin(users, eq(users.id, posts.userId));
```

### Relational Queries API
- Include all: `db.query.posts.findMany()`
- Include specific: `db.query.posts.findMany({ columns: { title: true } })`
- Exclude specific: `db.query.posts.findMany({ columns: { content: false } })`
- Add extras: `db.query.posts.findMany({ extras: { titleLength: sql<number>\`length(${posts.title})\`.as('title_length') } })`
- With relations:
```ts
db.query.posts.findMany({
  columns: { id: true },
  with: {
    comments: { columns: { userId: false, postId: false } },
    user: true,
  },
});
```

### Conditional Selection
```ts
const searchPosts = async (withTitle = false) => {
  await db.select({
    id: posts.id,
    ...(withTitle && { title: posts.title }),
  }).from(posts);
};
```

### incrementing-a-value
Increment columns with update().set(sql`${column} + value`) or a custom increment(column, value) helper; supports PostgreSQL, MySQL, SQLite.

## Incrementing Column Values

To increment a column value, use the `update().set()` method with the `sql` operator:

```ts
import { eq, sql } from 'drizzle-orm';

await db
  .update(table)
  .set({
    counter: sql`${table.counter} + 1`,
  })
  .where(eq(table.id, 1));
```

This generates: `update "table" set "counter" = "counter" + 1 where "id" = 1;`

For reusable increment logic, create a custom function:

```ts
import { AnyColumn } from 'drizzle-orm';

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

await db
  .update(table)
  .set({
    counter1: increment(table.counter1),
    counter2: increment(table.counter2, 10),
  })
  .where(eq(table.id, 1));
```

Supported on PostgreSQL, MySQL, and SQLite.

### limit-offset-pagination
Limit/offset pagination: skip (page-1)*size rows, return size rows; requires unique column ordering; simple but degrades with large offsets and inconsistent with concurrent data changes; deferred join optimizes large tables.

## Limit/Offset Pagination

Implements pagination by skipping a number of rows and returning a fixed page size. Supported on PostgreSQL, MySQL, and SQLite.

### Basic Implementation

```ts
import { asc } from 'drizzle-orm';
import { users } from './schema';

const db = drizzle(...);

await db
  .select()
  .from(users)
  .orderBy(asc(users.id)) // mandatory for consistent results
  .limit(4) // page size
  .offset(4); // rows to skip = (page - 1) * pageSize
```

Generates: `select * from users order by id asc limit 4 offset 4;`

Returns rows 5-8 from the users table.

### Ordering Requirements

For consistent pagination, order by a unique column. If ordering by non-unique columns, append a unique column:

```ts
const getUsers = async (page = 1, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .orderBy(asc(users.firstName), asc(users.id)) // non-unique, then unique
    .limit(pageSize) 
    .offset((page - 1) * pageSize);
}
```

### Relational Query API

```ts
import * as schema from './db/schema';

const db = drizzle({ schema });

const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });
};
```

### Custom Pagination Function

```ts
import { SQL, asc } from 'drizzle-orm';
import { PgColumn, PgSelect } from 'drizzle-orm/pg-core';

function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = 3,
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}

const query = db.select().from(users);
await withPagination(query.$dynamic(), asc(users.id));
```

### Deferred Join Optimization

For better performance on large tables, use deferred join to paginate a subset before joining full rows:

```ts
const getUsers = async (page = 1, pageSize = 10) => {
   const sq = db
    .select({ id: users.id })
    .from(users)
    .orderBy(users.id)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as('subquery');

   await db.select().from(users).innerJoin(sq, eq(users.id, sq.id)).orderBy(users.id);
};
```

### Benefits & Drawbacks

**Benefits:** Simple to implement, pages easily reachable, can navigate to any page without state.

**Drawbacks:** Performance degrades with large offsets (must scan all skipped rows), inconsistency from concurrent inserts/deletes (rows can appear on multiple pages or be skipped entirely).

**Example of inconsistency:** If a row is deleted while user browses page 1, page 2 may skip a row that shifted positions.

For high-frequency inserts/deletes or large table pagination, consider cursor-based pagination instead. See Planetscale Pagination Guide and Aaron Francis's Efficient Pagination Using Deferred Joins for more details.

### mysql-local-setup
Pull MySQL Docker image and start container with docker run, then connect via mysql://root:password@localhost:3306/database URL

## Setup MySQL locally with Docker

### Prerequisites
- Install Docker Desktop for your operating system

### Pull MySQL image
Pull the latest MySQL image from Docker Hub:
```bash
docker pull mysql
```

Or pull a specific version:
```bash
docker pull mysql:8.2
```

Verify the image is downloaded:
```bash
docker images
```

### Start MySQL container
Run a new MySQL container:
```bash
docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql
```

Options explained:
- `--name drizzle-mysql` - container name
- `-e MYSQL_ROOT_PASSWORD=mypassword` - root user password
- `-d` - run in detached mode (background)
- `-p 3306:3306` - map container port 3306 to host port 3306
- `mysql` - image name (can specify version like `mysql:8.2`)

Optional parameters:
- `-e MYSQL_DATABASE=` - create a database on startup (default: `mysql`)
- `-e MYSQL_USER=` and `-e MYSQL_PASSWORD=` - create a new user with password (still requires `MYSQL_ROOT_PASSWORD`)

Verify container is running:
```bash
docker ps
```

### Configure database URL
Connection string format:
```
mysql://<user>:<password>@<host>:<port>/<database>
```

Example for the created container:
```
mysql://root:mypassword@localhost:3306/mysql
```

Use this URL to connect to the database in your application.

### point-datatype-psql
PostgreSQL point datatype: define with point() column, insert as {x,y} or [x,y], compute distance with <-> operator, filter by rectangular boundary with <@ operator.

## Point Datatype in PostgreSQL

PostgreSQL's `point` datatype stores geometric data as a pair of (x, y) coordinates representing a point in 2D space. The point expects longitude first, then latitude.

### Creating a Table with Point Column

```ts
import { pgTable, point, serial, text } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: point('location', { mode: 'xy' }).notNull(),
});
```

### Inserting Point Data

Three insertion methods are supported:

```ts
// mode: 'xy' - object format
await db.insert(stores).values({
  name: 'Test',
  location: { x: -90.9, y: 18.7 },
});

// mode: 'tuple' - array format
await db.insert(stores).values({
  name: 'Test',
  location: [-90.9, 18.7],
});

// SQL raw
await db.insert(stores).values({
  name: 'Test',
  location: sql`point(-90.9, 18.7)`,
});
```

### Computing Distance Between Points

Use the `<->` operator to calculate distance. Query for nearest location:

```ts
import { getTableColumns, sql } from 'drizzle-orm';
import { stores } from './schema';

const point = { x: -73.935_242, y: 40.730_61 };
const sqlDistance = sql`location <-> point(${point.x}, ${point.y})`;

await db
  .select({
    ...getTableColumns(stores),
    distance: sql`round((${sqlDistance})::numeric, 2)`,
  })
  .from(stores)
  .orderBy(sqlDistance)
  .limit(1);
```

Generates: `select *, round((location <-> point(-73.935242, 40.73061))::numeric, 2) from stores order by location <-> point(-73.935242, 40.73061) limit 1;`

### Filtering by Rectangular Boundary

Use the `<@` operator to check if a point falls within a rectangular boundary defined by two diagonal points:

```ts
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };

await db
  .select()
  .from(stores)
  .where(
    sql`${stores.location} <@ box(point(${point.x1}, ${point.y1}), point(${point.x2}, ${point.y2}))`
  );
```

Generates: `select * from stores where location <@ box(point(-88, 40), point(-73, 43));`

### postgis-geometry-point
PostGIS geometry point support: create extension, define geometry columns with GIST indexes, insert via xy/tuple/SQL modes, query nearest with <-> operator and ST_Distance(), filter within bounds with ST_Within/ST_MakeEnvelope.

## PostGIS Geometry Point Support

PostGIS extends PostgreSQL with geospatial data capabilities. Drizzle doesn't auto-create extensions, so manually create it:

```bash
npx drizzle-kit generate --custom
```

```sql
CREATE EXTENSION postgis;
```

### Table Definition with Spatial Index

Define a table with `geometry` datatype and GIST spatial index:

```ts
import { geometry, index, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const stores = pgTable(
  'stores',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
  },
  (t) => [
    index('spatial_index').using('gist', t.location),
  ]
);
```

Generated SQL:
```sql
CREATE TABLE IF NOT EXISTS "stores" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "location" geometry(point) NOT NULL
);
CREATE INDEX IF NOT EXISTS "spatial_index" ON "stores" USING gist ("location");
```

### Inserting Geometry Data

Three insertion modes using `ST_MakePoint()` and `ST_SetSRID()`:

```ts
// mode: 'xy' - object with x, y properties
await db.insert(stores).values({
  name: 'Test',
  location: { x: -90.9, y: 18.7 },
});

// mode: 'tuple' - array coordinates
await db.insert(stores).values({
  name: 'Test',
  location: [-90.9, 18.7],
});

// raw SQL
await db.insert(stores).values({
  name: 'Test',
  location: sql`ST_SetSRID(ST_MakePoint(-90.9, 18.7), 4326)`,
});
```

### Finding Nearest Location

Use `<->` operator for distance ordering and `ST_Distance()` to compute planar distance:

```ts
import { getTableColumns, sql } from 'drizzle-orm';
import { stores } from './schema';

const point = { x: -73.935_242, y: 40.730_61 };
const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;

await db
  .select({
    ...getTableColumns(stores),
    distance: sql`ST_Distance(${stores.location}, ${sqlPoint})`,
  })
  .from(stores)
  .orderBy(sql`${stores.location} <-> ${sqlPoint}`)
  .limit(1);
```

SQL equivalent:
```sql
select *, ST_Distance(location, ST_SetSRID(ST_MakePoint(-73.935_242, 40.730_61), 4326))
from stores order by location <-> ST_SetSRID(ST_MakePoint(-73.935_242, 40.730_61), 4326)
limit 1;
```

### Filtering Within Rectangular Area

Use `ST_MakeEnvelope()` to create a bounding box and `ST_Within()` to check containment:

```ts
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };

await db
  .select()
  .from(stores)
  .where(
    sql`ST_Within(
      ${stores.location}, ST_MakeEnvelope(${point.x1}, ${point.y1}, ${point.x2}, ${point.y2}, 4326)
    )`,
  );
```

SQL:
```sql
select * from stores where ST_Within(location, ST_MakeEnvelope(-88, 40, -73, 43, 4326));
```

### postgresql-full-text-search
PostgreSQL full-text search with to_tsvector/to_tsquery, query variants (plainto_tsquery, phraseto_tsquery, websearch_to_tsquery), multi-column search with setweight, ranking with ts_rank/ts_rank_cd, GIN indexing.

## Full-Text Search in PostgreSQL

Full-text search is a technique to search for text within documents. PostgreSQL provides functions to work with full-text search:

### Core Functions

**`to_tsvector`** - Parses a textual document into tokens, reduces them to lexemes, and returns a `tsvector` listing lexemes with their positions:
```ts
import { sql } from 'drizzle-orm';
await db.execute(
  sql`select to_tsvector('english', 'Guide to PostgreSQL full-text search with Drizzle ORM')`
);
// Result: "'drizzl':9 'full':5 'full-text':4 'guid':1 'orm':10 'postgresql':3 'search':7 'text':6"
```

**`to_tsquery`** - Converts keywords to normalized tokens and returns a `tsquery` that matches lexemes in a `tsvector`. The `@@` operator performs direct matches:
```ts
await db.execute(
  sql`select to_tsvector('english', 'Guide to PostgreSQL full-text search with Drizzle ORM')
    @@ to_tsquery('english', 'Drizzle') as match`
);
// Result: true
```

### Creating Indexes

Drizzle doesn't support `tsvector` type natively, so convert data on-the-fly. Create a `GIN` index for performance:

```ts
import { index, pgTable, serial, text, sql } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
  },
  (table) => [
    index('title_search_index').using('gin', sql`to_tsvector('english', ${table.title})`),
  ]
);
```

### Basic Full-Text Search

```ts
import { sql } from 'drizzle-orm';
import { posts } from './schema';

const title = 'trip';
await db
  .select()
  .from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);
// Returns posts with 'trip' in title
```

### Query Variations

**Match any keyword** using `|` operator:
```ts
const title = 'Europe | Asia';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);
```

**Match multiple keywords** using `plainto_tsquery`:
```ts
const title = 'discover Italy'; // becomes 'discover & Italy'
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ plainto_tsquery('english', ${title})`);
```

**Match phrases** using `phraseto_tsquery`:
```ts
const title = 'family trip'; // becomes 'family <-> trip'
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ phraseto_tsquery('english', ${title})`);
```

**Web search syntax** using `websearch_to_tsquery`:
```ts
const title = 'family or first trip Europe or Asia';
await db.select().from(posts)
  .where(sql`to_tsvector('english', ${posts.title}) @@ websearch_to_tsquery('english', ${title})`);
```

### Multi-Column Search

Create index on multiple columns with `setweight` to assign weights (A, B, C, D) to different parts:

```ts
import { sql, index, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
  },
  (table) => [
    index('search_index').using(
      'gin',
      sql`(
        setweight(to_tsvector('english', ${table.title}), 'A') ||
        setweight(to_tsvector('english', ${table.description}), 'B')
      )`,
    ),
  ],
);

// Query:
const title = 'plan';
await db.select().from(posts)
  .where(sql`(
    setweight(to_tsvector('english', ${posts.title}), 'A') ||
    setweight(to_tsvector('english', ${posts.description}), 'B'))
    @@ to_tsquery('english', ${title})`
  );
```

### Ranking Results

Use `ts_rank` (focuses on frequency) or `ts_rank_cd` (focuses on proximity) with `orderBy`:

```ts
import { desc, getTableColumns, sql } from 'drizzle-orm';

const search = 'culture | Europe | Italy | adventure';
const matchQuery = sql`(
  setweight(to_tsvector('english', ${posts.title}), 'A') ||
  setweight(to_tsvector('english', ${posts.description}), 'B')), to_tsquery('english', ${search})`;

await db
  .select({
    ...getTableColumns(posts),
    rank: sql`ts_rank(${matchQuery})`,
    rankCd: sql`ts_rank_cd(${matchQuery})`,
  })
  .from(posts)
  .where(sql`(
    setweight(to_tsvector('english', ${posts.title}), 'A') ||
    setweight(to_tsvector('english', ${posts.description}), 'B')
    ) @@ to_tsquery('english', ${search})`)
  .orderBy((t) => desc(t.rank));
```

### Requirements
- drizzle-orm@0.31.0 and drizzle-kit@0.22.0 or higher


### postgresql-local-setup
Set up local PostgreSQL with Docker: pull image, run container with password and port mapping, connect via postgres://postgres:password@localhost:5432/postgres

## PostgreSQL Local Setup with Docker

### Prerequisites
- Install Docker Desktop for your operating system

### Pull PostgreSQL Image
Pull the latest PostgreSQL image from Docker Hub:
```bash
docker pull postgres
```

Or pull a specific version:
```bash
docker pull postgres:15
```

Verify the image is downloaded:
```bash
docker images
```

### Start PostgreSQL Container
Run a new PostgreSQL container:
```bash
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
```

Key options:
- `--name drizzle-postgres`: Container name
- `-e POSTGRES_PASSWORD=mypassword`: Set password
- `-d`: Run in detached mode (background)
- `-p 5432:5432`: Map container port 5432 to host port 5432
- `postgres`: Image name (can specify version like `postgres:15`)

Optional parameters:
- `-e POSTGRES_USER=`: Set username (defaults to `postgres`)
- `-e POSTGRES_DB=`: Set database name (defaults to `POSTGRES_USER` value)

Verify container is running:
```bash
docker ps
```

### Configure Database URL
Connection string format:
```
postgres://<user>:<password>@<host>:<port>/<database>
```

Example for the created container:
```
postgres://postgres:mypassword@localhost:5432/postgres
```

Use this URL to connect to the database in your application.

### seeding-with-option
Generate related child records in one-to-many relationships using `with` option; requires foreign key or explicit relations definition.

## Seeding with the `with` Option

The `with` option in Drizzle Seed allows you to generate related data for one-to-many relationships. When seeding, you can specify that for each parent record, multiple child records should be created.

### Basic Concept

The `with` option requires a one-to-many relationship between tables. For example, if one user has many posts:

```ts
users: {
    count: 2,
    with: {
        posts: 3,
    },
}
```

This generates 2 users, each with 3 posts.

### Requirements

To use `with`, you must establish the relationship in your schema. There are two approaches:

**Option 1: Add a foreign key reference**
```ts
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content'),
    authorId: integer('author_id').notNull().references(() => users.id),
});
```

**Option 2: Define explicit relations**
```ts
export const postsRelations = relations(posts, ({ one }) => ({
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
}));
```

Then include the relations in the seed function:
```ts
await seed(db, { users, posts, postsRelations }).refine(() => ({
    users: {
        count: 2,
        with: {
            posts: 3,
        },
    },
}));
```

### Common Errors

**Error: "posts" table doesn't have a reference to "users" table**
- Occurs when trying to use `with` without establishing a relationship
- Solution: Add foreign key or explicit relations as shown above

**Error: Attempting to generate many parents for one child**
- Example: Trying to generate 3 users for 2 posts when the relationship is one user → many posts
- This violates the one-to-many constraint
- Solution: Reverse the structure to match the actual relationship direction

**Error: "users" table has self reference**
- Occurs when a table references itself (e.g., `reportsTo` field in users table)
- Cannot use `with` for self-referencing tables because you cannot generate multiple parents for a single record
- Solution: Do not use `with` for self-referential relationships

### seeding-with-partially-exposed-schema
Handle foreign key constraints when seeding tables with unexposed referenced tables: expose the table, remove not-null constraint, or refine the column generator with specific values.

## Seeding with Partially Exposed Schema

When seeding a database with Drizzle Seed, you may encounter issues when a table has foreign key constraints but the referenced table is not exposed to the seed function.

### Problem Scenarios

**Scenario 1: Not-null foreign key without referenced table**

If you seed only the `bloodPressure` table but it has a not-null `userId` column referencing an unexposed `users` table:

```ts
import { bloodPressure } from './schema.ts';

async function main() {
  const db = drizzle(...);
  await seed(db, { bloodPressure });
}
```

With schema:
```ts
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
});

export const bloodPressure = pgTable("bloodPressure", {
	bloodPressureId: serial().primaryKey(),
	pressure: doublePrecision(),
	userId: integer().references(() => users.id).notNull(),
})
```

This throws an error: `Column 'userId' has not null constraint, and you didn't specify a table for foreign key on column 'userId' in 'bloodPressure' table.`

**Scenario 2: Nullable foreign key without referenced table**

If the `userId` column is nullable instead:
```ts
userId: integer().references(() => users.id),
```

A warning is issued: `Column 'userId' in 'bloodPressure' table will be filled with Null values because you specified neither a table for foreign key on column 'userId' nor a function for 'userId' column in refinements.`

### Solutions

1. **Remove the not-null constraint** from the foreign key column
2. **Expose the referenced table** to the seed function:
   ```ts
   await seed(db, { bloodPressure, users });
   ```
3. **Refine the column generator** to provide specific values (requires the referenced table to already have data in the database):
   ```ts
   await seed(db, { bloodPressure }).refine((funcs) => ({
     bloodPressure: {
       columns: {
         userId: funcs.valuesFromArray({ values: [1, 2] })
       }
     }
   }));
   ```


### select-parent-rows-with-at-least-one-related-child-row
Filter parent rows to only those with at least one related child using innerJoin (with child data) or exists subquery (parent only).

## Selecting Parent Rows with At Least One Related Child Row

Supported on PostgreSQL, MySQL, and SQLite.

### Using Inner Join

To select parent rows with their related child rows, use `.innerJoin()`:

```ts
import { eq } from 'drizzle-orm';
import { users, posts } from './schema';

await db
  .select({
    user: users,
    post: posts,
  })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.userId))
  .orderBy(users.id);
```

Generates SQL:
```sql
select users.*, posts.* from users
  inner join posts on users.id = posts.user_id
  order by users.id;
```

Result includes each parent row paired with each related child row. Parent rows without children are excluded:
```ts
[
  {
    user: { id: 1, name: 'John Doe', email: 'john_doe@email.com' },
    post: { id: 1, title: 'Post 1', content: 'This is the text of post 1', userId: 1 }
  },
  {
    user: { id: 1, name: 'John Doe', email: 'john_doe@email.com' },
    post: { id: 2, title: 'Post 2', content: 'This is the text of post 2', userId: 1 }
  },
  {
    user: { id: 3, name: 'Nick Smith', email: 'nick_smith@email.com' },
    post: { id: 3, title: 'Post 3', content: 'This is the text of post 3', userId: 3 }
  }
]
```

### Using Subquery with EXISTS

To select only parent rows (without child data) that have at least one related child row, use a subquery with `exists()`:

```ts
import { eq, exists, sql } from 'drizzle-orm';

const sq = db
  .select({ id: sql`1` })
  .from(posts)
  .where(eq(posts.userId, users.id));

await db.select().from(users).where(exists(sq));
```

Generates SQL:
```sql
select * from users where exists (select 1 from posts where posts.user_id = users.id);
```

Result contains only parent rows with at least one child:
```ts
[
  { id: 1, name: 'John Doe', email: 'john_doe@email.com' },
  { id: 3, name: 'Nick Smith', email: 'nick_smith@email.com' }
]
```

### timestamp-default-value
Set SQL timestamp defaults with defaultNow() or sql operator: PostgreSQL now()/extract(epoch from now()), MySQL now()/unix_timestamp(), SQLite current_timestamp/unixepoch(); control app representation with mode option.

## Setting Timestamp Default Values

### PostgreSQL

Use `defaultNow()` or `sql` operator with `now()` for current timestamp:

```ts
import { sql } from 'drizzle-orm';
import { timestamp, pgTable, serial } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
});
```

The `mode: 'string'` option treats values as strings in the application but stores them as timestamps in the database. Default mode returns Date objects.

For unix timestamp (seconds since 1970-01-01), use `extract(epoch from now())`:

```ts
timestamp: integer('timestamp')
  .notNull()
  .default(sql`extract(epoch from now())`),
```

### MySQL

Use `defaultNow()` or `sql` operator with `now()`:

```ts
import { sql } from 'drizzle-orm';
import { mysqlTable, serial, timestamp } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  timestamp1: timestamp('timestamp1').notNull().defaultNow(),
  timestamp2: timestamp('timestamp2', { mode: 'string' })
    .notNull()
    .default(sql`now()`),
  timestamp3: timestamp('timestamp3', { fsp: 3 })
    .notNull()
    .default(sql`now(3)`),
});
```

The `fsp` option sets fractional seconds precision (0-6, default 0). The `mode: 'string'` option treats values as strings in the application.

For unix timestamp, use `unix_timestamp()`:

```ts
timestamp: int('timestamp')
  .notNull()
  .default(sql`(unix_timestamp())`),
```

### SQLite

Use `sql` operator with `current_timestamp` for text representation:

```ts
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  timestamp: text('timestamp')
    .notNull()
    .default(sql`(current_timestamp)`),
});
```

For unix timestamp, use `unixepoch()`:

```ts
timestamp1: integer('timestamp1', { mode: 'timestamp' })
  .notNull()
  .default(sql`(unixepoch())`),
timestamp2: integer('timestamp2', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
timestamp3: integer('timestamp3', { mode: 'number' })
  .notNull()
  .default(sql`(unixepoch())`),
```

The `mode` option controls how values are handled in the application:
- `timestamp`: seconds as Date object
- `timestamp_ms`: milliseconds as Date object
- `number`: raw number value

### toggling-a-boolean-field
Toggle boolean columns with not() operator in update().set() - supported on PostgreSQL, MySQL, SQLite

## Toggle Boolean Field

To toggle a boolean column value in an update statement, use the `not()` operator with `update().set()`:

```tsx
import { eq, not } from 'drizzle-orm';

await db
  .update(table)
  .set({
    isActive: not(table.isActive),
  })
  .where(eq(table.id, 1));
```

Generates SQL: `update "table" set "is_active" = not "is_active" where "id" = 1;`

Supported on PostgreSQL, MySQL, and SQLite.

**Note:** MySQL uses `tinyint(1)` for booleans, SQLite uses integers (0 for false, 1 for true).

### case-insensitive-unique-email
Create unique case-insensitive email indexes using lower() function in uniqueIndex() for PostgreSQL/SQLite; MySQL requires parentheses and version 8.0.13+; query with eq(lower(column), lowercased_value).

## Unique and Case-Insensitive Email Handling

Implement case-insensitive unique email validation across PostgreSQL, MySQL, and SQLite by creating a unique index on the lowercased email column.

### PostgreSQL

Create a custom `lower()` function that wraps the SQL `lower()` function:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyPgColumn, pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ],
);
```

Generated SQL:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "users" USING btree (lower("email"));
```

Query users by email:
```ts
import { eq } from 'drizzle-orm';

const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));
};
```

### MySQL

MySQL's default collation is case-insensitive, but explicitly enforce it with a functional index (requires MySQL 8.0.13+). The `lower()` function must wrap the column in parentheses:

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnyMySqlColumn, mysqlTable, serial, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`;
}

export const users = mysqlTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);
```

Generated SQL:
```sql
CREATE TABLE `users` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  CONSTRAINT `users_id` PRIMARY KEY(`id`),
  CONSTRAINT `emailUniqueIndex` UNIQUE((lower(`email`)))
);
```

Query pattern same as PostgreSQL.

### SQLite

```ts
import { SQL, sql } from 'drizzle-orm';
import { AnySQLiteColumn, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export function lower(email: AnySQLiteColumn): SQL {
  return sql`lower(${email})`;
}

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
  },
  (table) => [
    uniqueIndex('emailUniqueIndex').on(lower(table.email)),
  ]
);
```

Generated SQL:
```sql
CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower(`email`));
```

Query pattern same as PostgreSQL.

### update-many-with-different-values
Bulk update multiple rows with different values per row using dynamic SQL case statement with sql operator and inArray filter

## Update Multiple Rows with Different Values in Single Request

Update multiple rows with different values for each row using a single SQL request with `sql` operator and `case` statement.

**Approach:**
- Use `sql` operator to build a `case` statement dynamically
- Combine with `.update().set()` and `.where(inArray())` methods
- Supported on PostgreSQL, MySQL, and SQLite

**Example:**
```ts
import { SQL, inArray, sql } from 'drizzle-orm';
import { users } from './schema';

const inputs = [
  { id: 1, city: 'New York' },
  { id: 2, city: 'Los Angeles' },
  { id: 3, city: 'Chicago' },
];

if (inputs.length === 0) return;

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
```

**Generated SQL:**
```sql
update users set "city" = 
  (case when id = 1 then 'New York' when id = 2 then 'Los Angeles' when id = 3 then 'Chicago' end)
where id in (1, 2, 3)
```

**Key Points:**
- Ensure inputs array is not empty before executing
- Use `sql.join()` to combine SQL chunks with proper spacing
- Filter with `inArray()` to target only the rows being updated

### upsert
Insert-or-update queries: PostgreSQL/SQLite use `.onConflictDoUpdate(target, set, setWhere)` with `excluded` keyword; MySQL uses `.onDuplicateKeyUpdate(set)` with `values()` function.

## Upsert Query

Supported on PostgreSQL, MySQL, and SQLite.

### PostgreSQL and SQLite

Use `.onConflictDoUpdate()` method:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });
```

For multiple rows, use the `excluded` keyword to reference the proposed row:

```ts
const values = [
  { id: 1, lastLogin: new Date() },
  { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  { id: 3, lastLogin: new Date(Date.now() + 1000 * 60 * 120) },
];

await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
  });
```

Custom function to update specific columns:

```ts
const buildConflictUpdateColumns = <T extends PgTable | SQLiteTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

Composite primary key (multiple targets):

```ts
await db
  .insert(inventory)
  .values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId],
    set: { quantity: sql`${inventory.quantity} + 100` },
  });
```

Conditional update with `setWhere`:

```ts
const excludedPrice = sql.raw(`excluded.${products.price.name}`);
const excludedStock = sql.raw(`excluded.${products.stock.name}`);

await db
  .insert(products)
  .values(data)
  .onConflictDoUpdate({
    target: products.id,
    set: {
      price: excludedPrice,
      stock: excludedStock,
      lastUpdated: sql.raw(`excluded.${products.lastUpdated.name}`)
    },
    setWhere: or(
      sql`${products.stock} != ${excludedStock}`,
      sql`${products.price} != ${excludedPrice}`
    ),
  });
```

Preserve specific columns by using `sql`:

```ts
await db
  .insert(users)
  .values(data)
  .onConflictDoUpdate({
    target: users.id,
    set: { ...data, email: sql`${users.email}` }, // leave email unchanged
  });
```

### MySQL

Use `.onDuplicateKeyUpdate()` method. MySQL automatically determines conflict target from primary key and unique indexes:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });
```

For multiple rows, use `values()` function:

```ts
const values = [
  { id: 1, lastLogin: new Date() },
  { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  { id: 3, lastLogin: new Date(Date.now() + 1000 * 60 * 120) },
];

await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: {
      lastLogin: sql`values(${users.lastLogin})`,
    },
  });
```

Custom function for specific columns:

```ts
const buildConflictUpdateColumns = <T extends MySqlTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    acc[column] = sql`values(${cls[column]})`;
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

Preserve specific columns:

```ts
await db
  .insert(users)
  .values(data)
  .onDuplicateKeyUpdate({
    set: { ...data, email: sql`${users.email}` }, // leave email unchanged
  });
```

### vector-similarity-search
Implement semantic search in PostgreSQL using pgvector extension with vector embeddings, HNSW indexing, and cosineDistance queries for similarity matching.

## Vector Similarity Search with pgvector

Implement semantic search in PostgreSQL using the pgvector extension to find similar content based on vector embeddings.

### Setup

1. Create the pgvector extension manually via migration:
```bash
npx drizzle-kit generate --custom
```
```sql
CREATE EXTENSION vector;
```

2. Define a table with a vector column and HNSW/IVFFlat index:
```ts
import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);
```

### Generate Embeddings

Use OpenAI to convert text to vector embeddings:
```ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] });

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  });
  return data[0].embedding;
};
```

### Perform Similarity Search

Query similar items using cosineDistance and a similarity threshold:
```ts
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { generateEmbedding } from './embedding';
import { guides } from './schema';

const db = drizzle(...);

const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;
  
  return await db
    .select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
};

// Usage
const similarGuides = await findSimilarGuides('Guides on using Drizzle ORM with different platforms');
// Returns: [{ name: 'Drizzle with Turso', url: '...', similarity: 0.864 }, ...]
```

**Requirements:** drizzle-orm@0.31.0+, drizzle-kit@0.22.0+, openai package

