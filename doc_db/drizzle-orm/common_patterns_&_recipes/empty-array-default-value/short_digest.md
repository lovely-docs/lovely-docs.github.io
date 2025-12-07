## Empty Array Defaults by Database

**PostgreSQL**: Use `sql` with `'{}'::text[]` or `ARRAY[]::text[]`

**MySQL**: Use `json` type with `.default([])`, `sql`('[]')`, or `sql`(JSON_ARRAY())`

**SQLite**: Use `text` with `mode: 'json'` and `sql`(json_array())` or `sql`'[]'`

All support `.$type<string[]>()` for compile-time type safety.