## Breaking Changes

**PostgreSQL indexes API was changed** to align with PostgreSQL documentation. The previous API didn't support SQL expressions in `.on()`, conflated `.using()` and `.on()`, and placed ordering modifiers on the index instead of per-column.

Previous API:
```ts
index('name')
  .on(table.column1, table.column2)
  .using(sql``)
  .asc() / .desc()
  .nullsFirst() / .nullsLast()
  .where(sql``)
```

New API:
```ts
// With .on()
index('name')
  .on(table.column1.asc(), table.column2.nullsFirst())
  .concurrently()
  .where(sql``)
  .with({ fillfactor: '70' })

// With .using()
index('name')
  .using('btree', table.column1.asc(), sql`lower(${table.column2})`, table.column1.op('text_ops'))
  .where(sql``)
  .with({ fillfactor: '70' })
```

Requires `drizzle-kit@0.22.0` or higher.

## New Features

### pg_vector extension support

Define vector indexes and use vector distance functions:

```ts
const table = pgTable('items', {
    embedding: vector('embedding', { dimensions: 3 })
}, (table) => ({
    l2: index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops')),
    ip: index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops')),
    cosine: index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
    l1: index('l1_index').using('hnsw', table.embedding.op('vector_l1_ops')),
    hamming: index('hamming_index').using('hnsw', table.embedding.op('bit_hamming_ops')),
    jaccard: index('jaccard_index').using('hnsw', table.embedding.op('bit_jaccard_ops'))
}))
```

Helper functions for queries:
```ts
import { l2Distance, l1Distance, innerProduct, cosineDistance, hammingDistance, jaccardDistance } from 'drizzle-orm'

l2Distance(table.column, [3, 1, 2]) // <->
l1Distance(table.column, [3, 1, 2]) // <+>
innerProduct(table.column, [3, 1, 2]) // <#>
cosineDistance(table.column, [3, 1, 2]) // <=>
hammingDistance(table.column, '101') // <~>
jaccardDistance(table.column, '101') // <%>
```

Query examples:
```ts
db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2]))
db.select({ distance: l2Distance(items.embedding, [3,1,2]) }).from(items)
const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1));
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5)
```

Custom distance functions can be created by replicating the pattern:
```ts
export function l2Distance(column: SQLWrapper | AnyColumn, value: number[] | string[] | TypedQueryBuilder<any> | string): SQL {
  if (is(value, TypedQueryBuilder<any>) || typeof value === 'string') {
    return sql`${column} <-> ${value}`;
  }
  return sql`${column} <-> ${JSON.stringify(value)}`;
}
```

### New PostgreSQL types: point and line

**point** type with two modes:
```ts
const items = pgTable('items', {
 point: point('point'), // tuple mode: [1,2]
 pointObj: point('point_xy', { mode: 'xy' }), // xy mode: { x: 1, y: 2 }
});
```

**line** type with two modes:
```ts
const items = pgTable('items', {
 line: line('line'), // tuple mode: [1,2,3]
 lineObj: line('line_abc', { mode: 'abc' }), // abc mode: { a: 1, b: 2, c: 3 }
});
```

### PostGIS extension support

**geometry** type from postgis:
```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point' }),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' }),
  geoSrid: geometry('geo_options', { type: 'point', mode: 'xy', srid: 4000 }),
});
```

Modes: `tuple` (default, maps to [x,y]) and `xy` (maps to { x, y }). Type defaults to `point` but accepts any string.

## Drizzle Kit v0.22.0 Updates

### New type support
- `point` and `line` from PostgreSQL
- `vector` from pg_vector extension
- `geometry` from PostGIS extension

### extensionsFilters config parameter

Skip tables created by extensions:
```ts
export default defineConfig({
  dialect: "postgresql",
  extensionsFilters: ["postgis"], // skips geography_columns, geometry_columns, spatial_ref_sys
})
```

### SSL configuration improvements

Full SSL parameter support:
```ts
// PostgreSQL
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    ssl: true, // or "require" | "allow" | "prefer" | "verify-full" | node:tls options
  }
})

// MySQL
export default defineConfig({
  dialect: "mysql",
  dbCredentials: {
    ssl: "", // string | mysql2 SslOptions
  }
})
```

### Normalized SQLite URLs

libsql and better-sqlite3 drivers now accept both file path patterns and normalize them correctly.

### MySQL and SQLite index-as-expression behavior

Expressions are no longer escaped in strings, columns are properly handled:
```ts
export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    email: text('email').notNull(),
}, (table) => ({
    emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
}));

// Before: CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (`lower("users"."email")`);
// Now: CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower("email"));
```

### Index limitations

Must specify index name manually if using expressions:
```ts
index().on(table.id, table.email) // auto-named, works
index('my_name').on(table.id, table.email) // works
index().on(sql`lower(${table.email})`) // error
index('my_name').on(sql`lower(${table.email})`) // works
```

Push won't generate statements if these fields change in existing indexes: expressions in `.on()`/`.using()`, `.where()` statements, or `.op()` operator classes. For changes, comment out the index, push, uncomment and modify, then push again. Generate command has no such limitations.

### Bug fixes
- Multiple constraints not added (only first generated)
- Drizzle Studio connection termination errors
- SQLite local migrations execution
- Unknown '--config' option errors