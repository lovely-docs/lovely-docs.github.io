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