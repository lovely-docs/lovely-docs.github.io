## Batch API

Execute multiple SQL statements in a single call with implicit transaction handling (all succeed or all rollback).

```ts
const batchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
	db.query.usersTable.findMany({}),
	db.select().from(usersTable).where(eq(usersTable.id, 1)),
]);
```

Supported for LibSQL, Neon, and D1. Response is a tuple with results for each statement. All query builders supported: `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.execute()`, `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`, `db.select()`, `db.update()`, `db.delete()`, `db.insert()`.