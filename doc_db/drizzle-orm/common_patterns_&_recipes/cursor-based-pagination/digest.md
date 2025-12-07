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