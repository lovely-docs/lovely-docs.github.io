## Relational Queries

Typed API for querying nested relational data, generating a single SQL statement.

**Setup:** Pass schema to `drizzle({ schema })`, use `db.query.tableName.findMany()` or `findFirst()`.

**Modes:** Use `mode: 'planetscale'` for PlanetScale MySQL, `mode: 'default'` for regular MySQL.

**Relations:** Use `with: { relationName: true }` for nested data, supports chaining.

**Columns:** `columns: { field: true }` includes, `columns: { field: false }` excludes (query-level filtering).

**Filters:** `where: (table, { eq }) => eq(table.id, 1)` or import operators.

**Pagination:** `limit: 5, offset: 2` (offset only at top level).

**Ordering:** `orderBy: (table, { asc }) => [asc(table.id)]`.

**Computed fields:** `extras: { name: sql\`...\`.as('col_name') }` for custom SQL expressions.

**Prepared statements:** `.prepare().execute({ id: 1 })` with `placeholder('id')` in where/limit/offset.