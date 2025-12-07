## Migrate from Sequelize to Drizzle ORM

**Setup:** Install `drizzle-orm pg` and `drizzle-kit @types/pg`. Create `drizzle.config.ts` with database credentials. Run `npx drizzle-kit introspect` to generate schema and migrations.

**Connection:**
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

export const client = new Client({ host, port, user, password, database });
export const db = drizzle({ client, schema });
```

**Query Examples:**

Insert:
```typescript
await db.insert(suppliers).values([{ companyName, city, country }, ...]);
```

Select (core):
```typescript
const result = await db.select({ product: products, supplier: suppliers })
  .from(products).where(eq(products.id, id)).leftJoin(suppliers, eq(suppliers.id, products.supplierId));
```

Select (relational):
```typescript
const result = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

Select with aggregation:
```typescript
const result = await db.select({
  id: orders.id,
  totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
}).from(orders).where(eq(orders.id, id)).groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

Update:
```typescript
await db.update(suppliers).set({ city, country }).where(eq(suppliers.id, id));
```

Delete with transaction:
```typescript
await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

**Key differences:** Numeric fields are strings; relational queries don't support aggregations; response types are strictly typed based on selected fields.