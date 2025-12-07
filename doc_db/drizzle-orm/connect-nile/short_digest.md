## Nile Integration

Install: `npm install drizzle-orm postgres`

Basic setup with node-postgres driver:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
const db = drizzle(process.env.NILEDB_URL);
```

For multi-tenant isolation, wrap queries in transactions that set tenant context:
```typescript
function tenantDB<T>(tenantId: string, cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}

await tenantDB(tenantId, async (tx) => tx.select().from(todosTable));
```

For web frameworks, use AsyncLocalStorage with middleware to populate tenant ID automatically.