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