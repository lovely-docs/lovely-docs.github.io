## Breaking Changes
- Removed filtering by nested relations in `where` callbacks (use manual filtering or core API instead)
- Added `mode` config for `mysql2` driver: `'default'` for MySQL, `'planetscale'` for PlanetScale

## Performance
- **430% IntelliSense speedup** for large schemas via optimized internal types
- Relational queries rewritten with lateral joins, selective data retrieval, reduced aggregations, and simplified grouping

## Features
- Insert rows with all defaults: `db.insert(table).values({})` or `db.insert(table).values([{}, {}])`