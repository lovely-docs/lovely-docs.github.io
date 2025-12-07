## WITH Clauses for DML

INSERT, UPDATE, DELETE now support WITH (CTE) statements:
```ts
const avg = db.$with('avg').as(db.select({ value: sql`avg(${orders.amount})` }).from(orders));
await db.with(avg).delete(orders).where(gt(orders.amount, sql`(select * from ${avg})`)).returning({ id: orders.id });
```

## Custom Migrations Configuration

```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsTable: 'my_migrations',      // custom table name
	migrationsSchema: 'custom',             // PostgreSQL only
});
```

## SQLite Proxy Enhancements

Relational queries (`.query.findFirst()`, `.query.findMany()`) and batch requests now supported. Batch callback:
```ts
const db = drizzle(
	async (sql, params, method) => { /* single query */ },
	async (queries) => axios.post('http://localhost:3000/batch', { queries }),
);
```