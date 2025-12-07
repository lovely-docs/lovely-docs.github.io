## pg_vector

Vector similarity search extension for PostgreSQL. Store vectors alongside relational data with support for exact and approximate nearest neighbor search, multiple vector types (single-precision, half-precision, binary, sparse), and distance metrics (L2, inner product, cosine, L1, Hamming, Jaccard).

**Column Types:**
```ts
const table = pgTable('table', {
    embedding: vector({ dimensions: 3 })
})
```

**Indexes:**
```ts
const table = pgTable('items', {
    embedding: vector({ dimensions: 3 })
}, (table) => [
  index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops')),
  index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops')),
  index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
  index('l1_index').using('hnsw', table.embedding.op('vector_l1_ops')),
  index('hamming_index').using('hnsw', table.embedding.op('bit_hamming_ops')),
  index('jaccard_index').using('hnsw', table.embedding.op('bit_jaccard_ops'))
])
```

**Helper Functions:**
```ts
import { l2Distance, l1Distance, innerProduct, cosineDistance, hammingDistance, jaccardDistance } from 'drizzle-orm'

l2Distance(table.column, [3, 1, 2]) // <->
l1Distance(table.column, [3, 1, 2]) // <+>
innerProduct(table.column, [3, 1, 2]) // <#>
cosineDistance(table.column, [3, 1, 2]) // <=>
hammingDistance(table.column, '101') // <~>
jaccardDistance(table.column, '101') // <%>
```

Custom distance functions can be created by replicating the pattern:
```ts
export function l2Distance(
  column: SQLWrapper | AnyColumn,
  value: number[] | string[] | TypedQueryBuilder<any> | string,
): SQL {
  if (is(value, TypedQueryBuilder<any>) || typeof value === 'string') {
    return sql`${column} <-> ${value}`;
  }
  return sql`${column} <-> ${JSON.stringify(value)}`;
}
```

**Query Examples:**
```ts
// Nearest neighbors
db.select().from(items).orderBy(l2Distance(items.embedding, [3,1,2])).limit(5)

// Distance calculation
db.select({ distance: l2Distance(items.embedding, [3,1,2]) }).from(items)

// Subquery distance
const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1));
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5)

// Computed distance
db.select({ innerProduct: sql`(${innerProduct(items.embedding, [3,1,2])}) * -1` }).from(items)
```

## PostGIS

Geospatial extension for PostgreSQL. Adds support for storing, indexing, and querying geographic data.

**Column Types:**
```ts
const items = pgTable('items', {
  geo: geometry('geo', { type: 'point' }),
  geoObj: geometry('geo_obj', { type: 'point', mode: 'xy' }),
  geoSrid: geometry('geo_options', { type: 'point', mode: 'xy', srid: 4000 }),
});
```

**Mode:** `tuple` (default, maps to [x,y]) or `xy` (maps to {x, y} object)

**Type:** Predefined `point` type available; any string can be used for other PostGIS types

**Indexes:**
```ts
const table = pgTable('table', {
  geo: geometry({ type: 'point' }),
}, (table) => [
  index('custom_idx').using('gist', table.geo)
])
```

Note: Use `extensionsFilters` in drizzle config to exclude PostGIS tables from introspect/push commands.