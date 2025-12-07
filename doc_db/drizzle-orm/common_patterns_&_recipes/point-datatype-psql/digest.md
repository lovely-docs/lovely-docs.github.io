## Point Datatype in PostgreSQL

PostgreSQL's `point` datatype stores geometric data as a pair of (x, y) coordinates representing a point in 2D space. The point expects longitude first, then latitude.

### Creating a Table with Point Column

```ts
import { pgTable, point, serial, text } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: point('location', { mode: 'xy' }).notNull(),
});
```

### Inserting Point Data

Three insertion methods are supported:

```ts
// mode: 'xy' - object format
await db.insert(stores).values({
  name: 'Test',
  location: { x: -90.9, y: 18.7 },
});

// mode: 'tuple' - array format
await db.insert(stores).values({
  name: 'Test',
  location: [-90.9, 18.7],
});

// SQL raw
await db.insert(stores).values({
  name: 'Test',
  location: sql`point(-90.9, 18.7)`,
});
```

### Computing Distance Between Points

Use the `<->` operator to calculate distance. Query for nearest location:

```ts
import { getTableColumns, sql } from 'drizzle-orm';
import { stores } from './schema';

const point = { x: -73.935_242, y: 40.730_61 };
const sqlDistance = sql`location <-> point(${point.x}, ${point.y})`;

await db
  .select({
    ...getTableColumns(stores),
    distance: sql`round((${sqlDistance})::numeric, 2)`,
  })
  .from(stores)
  .orderBy(sqlDistance)
  .limit(1);
```

Generates: `select *, round((location <-> point(-73.935242, 40.73061))::numeric, 2) from stores order by location <-> point(-73.935242, 40.73061) limit 1;`

### Filtering by Rectangular Boundary

Use the `<@` operator to check if a point falls within a rectangular boundary defined by two diagonal points:

```ts
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };

await db
  .select()
  .from(stores)
  .where(
    sql`${stores.location} <@ box(point(${point.x1}, ${point.y1}), point(${point.x2}, ${point.y2}))`
  );
```

Generates: `select * from stores where location <@ box(point(-88, 40), point(-73, 43));`