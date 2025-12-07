## Limit/Offset Pagination

Skip N rows and return M rows per page. Requires ordering by unique column for consistency.

**Basic:**
```ts
await db.select().from(users)
  .orderBy(asc(users.id))
  .limit(pageSize)
  .offset((page - 1) * pageSize);
```

**Relational API:**
```ts
await db.query.users.findMany({
  orderBy: (users, { asc }) => asc(users.id),
  limit: pageSize,
  offset: (page - 1) * pageSize,
});
```

**Custom function:**
```ts
function withPagination<T extends PgSelect>(qb: T, orderByColumn, page = 1, pageSize = 3) {
  return qb.orderBy(orderByColumn).limit(pageSize).offset((page - 1) * pageSize);
}
```

**Deferred join optimization** (for large tables):
```ts
const sq = db.select({ id: users.id }).from(users)
  .orderBy(users.id).limit(pageSize).offset((page - 1) * pageSize).as('subquery');
await db.select().from(users).innerJoin(sq, eq(users.id, sq.id)).orderBy(users.id);
```

**Benefits:** Simple, any page reachable. **Drawbacks:** Performance degrades with large offsets, concurrent changes cause inconsistency (rows skipped or duplicated). Use cursor-based pagination for high-frequency operations.