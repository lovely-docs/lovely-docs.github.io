## `sql` Template
Type-safe, parameterized raw SQL with automatic escaping and SQL injection prevention.

**Basic:** `sql`select * from ${table} where id = ${value}`` → parameterized query

**Type & Map:** `sql<string>`...`` for compile-time typing; `.mapWith(column)` or `.mapWith({mapFromDriverValue})` for runtime mapping

**Alias:** `.as('name')` to name custom fields

**Raw:** `sql.raw(value)` for unescaped SQL

**Combine:** `sql.fromList(chunks)`, `sql.join(chunks, separator)`, `sql.append()`, `sql.empty()`

**Convert:** `dialect.sqlToQuery(sql`...``)` to get query string and params (PostgreSQL uses `$1`, MySQL/SQLite use `?`)

**Usage:** Works in SELECT, WHERE, ORDER BY, GROUP BY, HAVING clauses for complex queries not supported by query builder