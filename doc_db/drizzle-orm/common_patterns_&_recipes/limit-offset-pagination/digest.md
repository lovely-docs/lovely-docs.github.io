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