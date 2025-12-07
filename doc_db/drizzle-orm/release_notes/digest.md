## Release History: v0.11.0 through v0.32.2

### Early Releases (v0.11.0 - v0.16.2)
Initial TypeScript ORM with PostgreSQL support. v0.11.0 introduced core features: typed schema definition via classes, filtering/selection, joins, many-to-many relationships, and automatic migration generation. v0.16.2 added PostgreSQL schemas, MySQL database/schema support, database introspection, postgres.js driver support, and custom types.

### Schema & Constraints (v0.27.2 - v0.28.6)
v0.27.2 added UNIQUE constraints across PostgreSQL, MySQL, SQLite with column-level `.unique()` or table-level `unique().on()` methods. v0.28.0 removed nested relation filtering, added mysql2 mode config, achieved 430% IntelliSense speedup via lateral joins rewrite, added insert with all defaults. v0.28.1-v0.28.6 fixed array bugs, timestamp milliseconds, SQLite typing, added Typebox support, column runtime defaults via `.$defaultFn()`, table type inference via `.$inferSelect/$inferInsert`, LibSQL batch API, SQLite JSON text mode, relational query `.toSQL()`, PostgreSQL array operators (`arrayContains`, `arrayContained`, `arrayOverlaps`).

### Query Building & Drivers (v0.29.0 - v0.29.5)
v0.29.0 added MySQL unsigned bigint, dynamic query building with `.$dynamic()`, custom constraint names, read replicas via `withReplicas()`, set operators (UNION/INTERSECT/EXCEPT), MySQL/PostgreSQL proxy drivers, D1 batch API. v0.29.1 added aggregate helpers (`count`, `sum`, `avg`, `max`, `min` with Distinct variants), ESLint plugin with `enforce-delete-with-where` and `enforce-update-with-where` rules. v0.29.2 added Expo SQLite driver with migration support via babel/metro config and `useMigrations` hook. v0.29.3 made Expo peer dependencies optional. v0.29.4 added Neon HTTP batch queries, deprecated PlanetScale `connect()` in favor of Client instances. v0.29.5 added WITH clauses for INSERT/UPDATE/DELETE, custom migrations table/schema, SQLite proxy batch and relational query support.

### Timestamp Handling & New Drivers (v0.30.0 - v0.30.10)
v0.30.0 changed postgres.js to return date strings with Drizzle mode-based mapping, fixed 8 timestamp/date bugs. v0.30.1 added OP-SQLite driver. v0.30.2 made LibSQL migrations use batch execution. v0.30.3 added raw query batch support for Neon HTTP. v0.30.4 added native xata-http driver for Xata Postgres. v0.30.5 added `$onUpdate()` for runtime column value computation on update. v0.30.6 added PGlite driver (WASM Postgres, 2.6mb, browser/Node.js/Bun). v0.30.7 added Vercel Postgres mappings, fixed Neon interval mapping. v0.30.8 added PostgreSQL enum schema support, D1 batch migrations, split `onConflict` where clause into `setWhere`/`targetWhere`. v0.30.9 added SQLite `onConflictDoUpdate` split where, `db._.fullSchema` for schema introspection. v0.30.10 added `.if()` for conditional WHERE clauses.

### Advanced Features (v0.31.0 - v0.32.2)
v0.31.0 breaking change: PostgreSQL indexes API - ordering modifiers move to per-column level, `.using()` specifies index type. Added pg_vector support with distance functions (`l2Distance`, `l1Distance`, `innerProduct`, `cosineDistance`, `hammingDistance`, `jaccardDistance`), PostgreSQL point/line types, PostGIS geometry type. v0.31.1 added `useLiveQuery` React Hook for Expo SQLite with auto-rerun on data changes. v0.31.2 added TiDB Cloud Serverless driver. v0.31.3 fixed RQB schema handling, added Prisma extension for native Drizzle query integration via `$extends(drizzle())`. v0.31.4 marked prisma clients package as optional. v0.32.0 added MySQL `$returningId()` for inserted IDs, PostgreSQL sequences/identity columns/generated columns, MySQL/SQLite generated columns with stored/virtual modes, Drizzle Kit migrations support and `--force` flag, customizable migration file prefixes. v0.32.1 fixed index typings for 3+ columns, added limit 0 support, empty array handling for `inArray`/`notInArray`. v0.32.2 fixed AWS Data API type hints, MySQL transactions, `useLiveQuery` dependency forwarding.

### Key Patterns
- Schema definition: `pgTable('name', { columns })` with typed columns
- Queries: `db.select().from(table).where(eq(table.id, 1))`
- Inserts: `db.insert(table).values({...})`
- Migrations: auto-generated via drizzle-kit
- Type inference: `typeof table.$inferSelect`, `typeof table.$inferInsert`
- Relational queries: `db.query.table.findMany({ with: { relation: true } })`
- Batch operations: `db.batch([query1, query2, ...])`