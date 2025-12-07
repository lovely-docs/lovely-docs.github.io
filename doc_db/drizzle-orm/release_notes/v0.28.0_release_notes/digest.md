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