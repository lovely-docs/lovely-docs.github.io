## Dynamic Query Building

By default, Drizzle query builders enforce SQL semantics where most methods can only be invoked once. For example, you cannot call `.where()` multiple times on a SELECT statement:

```ts
const query = db
	.select()
	.from(users)
	.where(eq(users.id, 1))
	.where(eq(users.name, 'John')); // ❌ Type error
```

This restriction is useful for conventional query building but problematic for dynamic query construction, such as when a shared function needs to enhance a query builder passed to it.

### Enabling Dynamic Mode

Call `.$dynamic()` on a query builder to enable dynamic mode, which removes the single-invocation restriction:

```ts
function withPagination<T extends PgSelect>(
	qb: T,
	page: number = 1,
	pageSize: number = 10,
) {
	return qb.limit(pageSize).offset((page - 1) * pageSize);
}

const query = db.select().from(users).where(eq(users.id, 1));
withPagination(query, 1); // ❌ Type error - not in dynamic mode

const dynamicQuery = query.$dynamic();
withPagination(dynamicQuery, 1); // ✅ OK
```

### Generic Types for Dynamic Query Building

Dynamic query builders use generic types that allow functions to modify the query builder's result type (e.g., adding joins):

```ts
function withFriends<T extends PgSelect>(qb: T) {
	return qb.leftJoin(friends, eq(friends.userId, users.id));
}

let query = db.select().from(users).where(eq(users.id, 1)).$dynamic();
query = withFriends(query);
```

Available types by dialect:

| Dialect | Select | Insert | Update | Delete |
|---------|--------|--------|--------|--------|
| Postgres | `PgSelect`, `PgSelectQueryBuilder` | `PgInsert` | `PgUpdate` | `PgDelete` |
| MySQL | `MySqlSelect`, `MySqlSelectQueryBuilder` | `MySqlInsert` | `MySqlUpdate` | `MySqlDelete` |
| SQLite | `SQLiteSelect`, `SQLiteSelectQueryBuilder` | `SQLiteInsert` | `SQLiteUpdate` | `SQLiteDelete` |

The `...QueryBuilder` types are for standalone query builder instances. DB query builders are subclasses of them, so both can be used:

```ts
import { QueryBuilder } from 'drizzle-orm/pg-core';

function withFriends<T extends PgSelectQueryBuilder>(qb: T) {
	return qb.leftJoin(friends, eq(friends.userId, users.id));
}

const qb = new QueryBuilder();
let query = qb.select().from(users).where(eq(users.id, 1)).$dynamic();
query = withFriends(query);
```