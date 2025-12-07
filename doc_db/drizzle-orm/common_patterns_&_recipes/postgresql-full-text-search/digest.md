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
