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