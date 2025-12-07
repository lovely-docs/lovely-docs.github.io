**Querying**: Conditional filters with `and()`/`or()`, dynamic filter arrays, custom operators via `sql`. Count rows with `count()` (cast to integer on PostgreSQL/MySQL). Select columns with `.select()`, `getTableColumns()`, or relational `columns`/`extras` options. Find parent rows with children via `innerJoin()` or `exists()` subquery.

**Pagination**: Limit/offset with `orderBy().limit().offset()` (simple, degrades with large offsets; use deferred join optimization). Cursor-based with `gt()`/`lt()` comparisons (consistent, supports multi-column cursors for non-unique columns, requires indexing).

**Updates**: Increment/decrement with `sql`${column} + value``. Toggle booleans with `not()`. Bulk update different values per row using `case` statement with `sql.join()`. Upsert: PostgreSQL/SQLite `.onConflictDoUpdate(target, set, setWhere)` with `excluded` keyword; MySQL `.onDuplicateKeyUpdate(set)` with `values()`.

**Search**: PostgreSQL full-text with `to_tsvector()`/`to_tsquery()` and `@@` operator; variants: `plainto_tsquery()` (AND), `phraseto_tsquery()` (phrase), `websearch_to_tsquery()` (web). Generated columns with `tsvector` type for indexing. Multi-column with `setweight()`, rank with `ts_rank`/`ts_rank_cd`, GIN indexes.

**Vector Search**: PostgreSQL pgvector extension with embeddings, HNSW indexing, `cosineDistance` queries.

**Geospatial**: PostgreSQL `point` datatype with `<->` distance operator, `<@` rectangular boundary. PostGIS geometry with `ST_Distance()`, `ST_Within()`, `ST_MakeEnvelope()`.

**Defaults**: Timestamps: PostgreSQL `defaultNow()`/`sql`now()``/`extract(epoch from now())``; MySQL `defaultNow()`/`sql`now()``/`unix_timestamp()``; SQLite `sql`current_timestamp``/`unixepoch()``; use `mode: 'string'` for string representation. Empty arrays: PostgreSQL `sql`'{}'::text[]``; MySQL `json` with `default([])` or `sql`(JSON_ARRAY())``; SQLite `text` with `mode: 'json'` and `sql`(json_array())``; use `.$type<T>()` for type inference.

**Case-Insensitive Email**: Unique index on `lower()` function; query with `eq(lower(column), lowercased_value)`.

**Seeding**: Use `with` option for one-to-many relationships (requires foreign key or explicit relations). Handle partially exposed schemas by exposing referenced table, removing not-null constraint, or refining column generator.

**Setup**: PostgreSQL/MySQL Docker containers with password and port mapping. Cloudflare D1 HTTP API via `drizzle.config.ts` with `dialect: 'sqlite'`, `driver: 'd1-http'`, credentials. Gel auth extension with ESDL User type and `schemaFilter`.
