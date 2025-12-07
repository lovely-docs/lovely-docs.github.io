## Setup

Install: `drizzle-orm`, `drizzle-kit`, `dotenv`, `node-postgres`, `express`.

Get Nile connection string from console, add to `.env` as `NILEDB_URL`.

## Configuration

`src/db/db.ts` - Create drizzle instance and `tenantDB()` wrapper that sets `nile.tenant_id` in transaction context using AsyncLocalStorage:
```typescript
export const db = drizzle(process.env.NILEDB_URL);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

`drizzle.config.ts` - Standard config pointing to schema and Nile URL.

Run `npx drizzle-kit pull` to introspect Nile's built-in tables.

## Schema & Express App

Define schema with Nile's `tenants` table plus custom tables like `todos`.

Express middleware extracts tenant ID from URL and stores in AsyncLocalStorage:
```typescript
app.use('/api/tenants/:tenantId/*', (req, res, next) => {
  tenantContext.run(req.params.tenantId, next);
});
```

All queries wrapped with `tenantDB()` automatically execute against tenant's virtual database - no explicit WHERE clauses needed:
```typescript
app.post("/api/tenants/:tenantId/todos", async (req, res) => {
  const newTodo = await tenantDB(async (tx) => {
    return await tx.insert(todoSchema)
      .values({ tenantId: req.params.tenantId, title, complete })
      .returning();
  });
  res.json(newTodo);
});
```

Run with `npx tsx src/app.ts` and test with curl.