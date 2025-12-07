Cursor-based pagination uses a cursor (pointer to a row) to fetch next pages. Pass the last row's cursor value to get the next page.

**Basic**: `where(cursor ? gt(users.id, cursor) : undefined).limit(pageSize).orderBy(asc(users.id))`

**Multi-column cursor** (non-unique columns): `where(or(gt(col, cursor.col), and(eq(col, cursor.col), gt(id, cursor.id))))`

**Non-sequential PKs** (UUIDv4): Combine with sequential column like `created_at` in cursor.

**Relational API**: `db.query.users.findMany({ where: (users, { gt }) => gt(users.id, cursor), ... })`

**Index cursor columns** for efficiency. Benefits: no skipped rows on insert/delete, efficient. Drawbacks: can't jump to specific page, more complex.