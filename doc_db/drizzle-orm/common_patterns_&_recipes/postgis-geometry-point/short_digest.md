## PostGIS Geometry Point

Manually create PostGIS extension: `CREATE EXTENSION postgis;`

Define table with spatial index:
```ts
geometry('location', { type: 'point', mode: 'xy', srid: 4326 })
index('spatial_index').using('gist', t.location)
```

Insert with `mode: 'xy'` (object), `mode: 'tuple'` (array), or raw SQL `ST_SetSRID(ST_MakePoint(x, y), 4326)`.

Find nearest: `.orderBy(sql`${stores.location} <-> ${sqlPoint}`)` with `ST_Distance()` for distance values.

Filter within bounds: `ST_Within(location, ST_MakeEnvelope(x1, y1, x2, y2, srid))`