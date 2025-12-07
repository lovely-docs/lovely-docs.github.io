## UNIQUE Constraints Support

**PostgreSQL**: Single-column `.unique()` or `.unique('name')` at column level; multi-column via `unique('name').on(...).nullsNotDistinct()` in table config. Supports `NULLS NOT DISTINCT` option.

**MySQL**: Same syntax as PostgreSQL, no `NULLS NOT DISTINCT` support.

**SQLite**: Unique constraints as indexes with optional names via `.unique('name')` or `unique('name').on(...)`.

All support both single and multi-column constraints with optional custom names.