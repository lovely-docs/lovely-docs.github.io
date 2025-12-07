## Batch API

Execute multiple SQL statements in a single database call with implicit transaction handling.

### Overview

Batch APIs are supported for LibSQL, Neon, and D1 drivers. A batch executes one or more SQL statements in order within an implicit transaction. If all statements succeed, the transaction commits. If any statement fails, the entire transaction rolls back.

**LibSQL**: Batch is an implicit transaction controlled by the backend.

**D1**: Batching reduces network latency by sending multiple statements in one call. Operates in auto-commit mode. Statements execute sequentially and non-concurrently. If any statement fails, the sequence aborts and rolls back.

### Usage

```ts
const batchResponse: BatchResponse = await db.batch([
	db.insert(usersTable).values({ id: 1, name: 'John' }).returning({ id: usersTable.id }),
	db.update(usersTable).set({ name: 'Dan' }).where(eq(usersTable.id, 1)),
	db.query.usersTable.findMany({}),
	db.select().from(usersTable).where(eq(usersTable.id, 1)),
	db.select({ id: usersTable.id, invitedBy: usersTable.invitedBy }).from(usersTable),
]);
```

The response is a tuple where each element corresponds to the result of each statement in the batch. Return types vary by driver:
- **libSQL**: `ResultSet` for mutations
- **Neon**: `NeonHttpQueryResult` for mutations
- **D1**: `D1Result` for mutations

### Supported Builders

All query builders can be used in `db.batch()`:
- `db.all()`, `db.get()`, `db.values()`, `db.run()`, `db.execute()`
- `db.query.<table>.findMany()`, `db.query.<table>.findFirst()`
- `db.select()`, `db.update()`, `db.delete()`, `db.insert()`