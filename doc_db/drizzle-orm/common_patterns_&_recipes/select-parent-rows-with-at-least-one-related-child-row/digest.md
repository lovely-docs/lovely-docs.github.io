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