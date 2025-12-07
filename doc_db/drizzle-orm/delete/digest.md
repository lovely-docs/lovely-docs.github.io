## Delete Operations

Delete all rows:
```typescript
await db.delete(users);
```

Delete with conditions:
```typescript
await db.delete(users).where(eq(users.name, 'Dan'));
```

### Limit
Supported in MySQL, SQLite, SingleStore (not PostgreSQL).
```typescript
await db.delete(users).where(eq(users.name, 'Dan')).limit(2);
```

### Order By
Sort results before deletion:
```typescript
import { asc, desc } from 'drizzle-orm';

await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(desc(users.name));
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(users.name, users.name2);
await db.delete(users).where(eq(users.name, 'Dan')).orderBy(asc(users.name), desc(users.name2));
```

### Delete with Return
Supported in PostgreSQL and SQLite (not MySQL, SingleStore). Returns deleted rows:
```typescript
const deletedUser = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning();

// partial return
const deletedUserIds: { deletedId: number }[] = await db.delete(users)
  .where(eq(users.name, 'Dan'))
  .returning({ deletedId: users.id });
```

### WITH DELETE Clause
Use CTEs to simplify complex delete queries:
```typescript
const averageAmount = db.$with('average_amount').as(
  db.select({ value: sql`avg(${orders.amount})`.as('value') }).from(orders)
);

const result = await db
	.with(averageAmount)
	.delete(orders)
	.where(gt(orders.amount, sql`(select * from ${averageAmount})`))
	.returning({
		id: orders.id
	});
```