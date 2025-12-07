## Dynamic Query Building

By default, query builder methods can only be invoked once (e.g., `.where()` once per query). Enable dynamic mode with `.$dynamic()` to remove this restriction for building queries dynamically:

```ts
function withPagination<T extends PgSelect>(qb: T, page: number = 1, pageSize: number = 10) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
withPagination(query, 1); // ✅ OK
```

Use dialect-specific generic types (`PgSelect`, `MySqlSelect`, `SQLiteSelect`, etc.) for functions that enhance query builders. The `...QueryBuilder` variants work with standalone query builder instances.