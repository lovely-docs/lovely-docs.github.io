## PostGIS Geometry Point Support

PostGIS extends PostgreSQL with geospatial data capabilities. Drizzle doesn't auto-create extensions, so manually create it:

```bash
npx drizzle-kit generate --custom
```

```sql
CREATE EXTENSION postgis;
```

### Table Definition with Spatial Index

Define a table with `geometry` datatype and GIST spatial index:

```ts
import { geometry, index, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const stores = pgTable(
  'stores',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    location: geometry('location', { type: 'point', mode: 'xy', srid: 4326 }).notNull(),
  },
  (t) => [
    index('spatial_index').using('gist', t.location),
  ]
);
```

Generated SQL:
```sql
CREATE TABLE IF NOT EXISTS "stores" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "location" geometry(point) NOT NULL
);
CREATE INDEX IF NOT EXISTS "spatial_index" ON "stores" USING gist ("location");
```

### Inserting Geometry Data

Three insertion modes using `ST_MakePoint()` and `ST_SetSRID()`:

```ts
// mode: 'xy' - object with x, y properties
await db.insert(stores).values({
  name: 'Test',
  location: { x: -90.9, y: 18.7 },
});

// mode: 'tuple' - array coordinates
await db.insert(stores).values({
  name: 'Test',
  location: [-90.9, 18.7],
});

// raw SQL
await db.insert(stores).values({
  name: 'Test',
  location: sql`ST_SetSRID(ST_MakePoint(-90.9, 18.7), 4326)`,
});
```

### Finding Nearest Location

Use `<->` operator for distance ordering and `ST_Distance()` to compute planar distance:

```ts
import { getTableColumns, sql } from 'drizzle-orm';
import { stores } from './schema';

const point = { x: -73.935_242, y: 40.730_61 };
const sqlPoint = sql`ST_SetSRID(ST_MakePoint(${point.x}, ${point.y}), 4326)`;

await db
  .select({
    ...getTableColumns(stores),
    distance: sql`ST_Distance(${stores.location}, ${sqlPoint})`,
  })
  .from(stores)
  .orderBy(sql`${stores.location} <-> ${sqlPoint}`)
  .limit(1);
```

SQL equivalent:
```sql
select *, ST_Distance(location, ST_SetSRID(ST_MakePoint(-73.935_242, 40.730_61), 4326))
from stores order by location <-> ST_SetSRID(ST_MakePoint(-73.935_242, 40.730_61), 4326)
limit 1;
```

### Filtering Within Rectangular Area

Use `ST_MakeEnvelope()` to create a bounding box and `ST_Within()` to check containment:

```ts
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };

await db
  .select()
  .from(stores)
  .where(
    sql`ST_Within(
      ${stores.location}, ST_MakeEnvelope(${point.x1}, ${point.y1}, ${point.x2}, ${point.y2}, 4326)
    )`,
  );
```

SQL:
```sql
select * from stores where ST_Within(location, ST_MakeEnvelope(-88, 40, -73, 43, 4326));
```