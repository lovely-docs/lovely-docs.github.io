**Breaking: PostgreSQL indexes API redesigned** - ordering modifiers (`.asc()`, `.desc()`, `.nullsFirst()`, `.nullsLast()`) now apply per-column/expression, not to the index; `.using()` now specifies index type with expressions.

**New features:** pg_vector support with distance functions (`l2Distance`, `cosineDistance`, etc.); PostgreSQL `point` and `line` types with tuple/xy modes; PostGIS `geometry` type support.

**Drizzle Kit v0.22.0:** Handles new types; `extensionsFilters` config skips extension tables; improved SSL config; normalized SQLite URLs; fixed index-as-expression behavior. Index limitations: must name indexes with expressions; push won't update expression/where/operator changes (use comment-push-uncomment workaround).