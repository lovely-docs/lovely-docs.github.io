## SQL Update

Basic: `.update(table).set({...}).where(...)` with `undefined` ignored and `null` explicit.

**Limit** (MySQL, SQLite, SingleStore): `.limit(n)`

**Order By**: `.orderBy(field)` or `.orderBy(asc(field), desc(field2))`

**Returning** (PostgreSQL, SQLite): `.returning({...})`

**WITH clause**: Define CTE with `db.$with('name').as(...)` then `.with(cte).update(...)`

**FROM clause** (PostgreSQL, SQLite): `.from(otherTable).where(...)` to join tables; PostgreSQL can `.returning()` from joined tables