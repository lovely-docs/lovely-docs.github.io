## WITH Statements for INSERT, UPDATE, DELETE

You can now use `WITH` (CTE) clauses with INSERT, UPDATE, and DELETE statements.

Example with DELETE:
```ts
const averageAmount = db.$with('average_amount').as(
	db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders),
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({ id: orders.id });
```

Generates:
```sql
with "average_amount" as (select avg("amount") as "value" from "orders") 
delete from "orders" 
where "orders"."amount" > (select * from "average_amount") 
returning "id";
```

## Custom Migrations Table and Schema

**Custom migrations table name** (all databases):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsTable: 'my_migrations',
});
```

By default migrations are stored in `__drizzle_migrations` table (in `drizzle` schema for PostgreSQL).

**Custom migrations schema** (PostgreSQL only):
```ts
await migrate(db, {
	migrationsFolder: './drizzle',
	migrationsSchema: 'custom',
});
```

## SQLite Proxy Batch and Relational Queries

SQLite proxy driver now supports:
- Relational queries: `.query.findFirst()` and `.query.findMany()`
- Batch requests via `db.batch([])`

Batch callback setup:
```ts
import { drizzle } from 'drizzle-orm/sqlite-proxy';

type ResponseType = { rows: any[][] | any[] }[];

const db = drizzle(
	async (sql, params, method) => {
		// single query logic
	},
	async (queries: { sql: string; params: any[]; method: 'all' | 'run' | 'get' | 'values' }[]) => {
		const result: ResponseType = await axios.post('http://localhost:3000/batch', { queries });
		return result;
	},
);
```

Response must be an array of raw values in the same order as sent queries.