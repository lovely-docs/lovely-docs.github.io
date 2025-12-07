## Migrate from TypeORM to Drizzle

**Setup:**
1. Install: `npm install drizzle-orm pg` + `npm install -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with DB credentials
3. Run `npx drizzle-kit introspect` to generate schema
4. Create `src/drizzle/db.ts` with connection
5. Run migrations in `src/index.ts`

**Config & Connection:**
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql',
  out: './src/drizzle',
  schema: './src/drizzle/schema.ts',
  dbCredentials: { host, port, user, password, database },
  verbose: true,
  strict: true,
});

// src/drizzle/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
export const client = new Client({ host, port, user, password, database });
export const db = drizzle({ client, schema });

// src/index.ts
await client.connect();
await migrate(db, { migrationsFolder: './src/drizzle' });
```

**Query Replacements:**

Insert:
```typescript
// TypeORM
await repository.save(repository.create([{ companyName, city, country }]));
// Drizzle
await db.insert(suppliers).values([{ companyName, city, country }]);
```

Select with relations:
```typescript
// TypeORM
await repository.findOne({ where: { id }, relations: ['supplier'] });
// Drizzle (core)
await db.select({ product: products, supplier: suppliers })
  .from(products).where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));
// Drizzle (relational)
await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

Select with filtering & pagination:
```typescript
// TypeORM
await repository.findAndCount({ skip: 0, take: 10, where: { name: ILike('%test%') } });
// Drizzle
const [rows, count] = await Promise.all([
  db.select({ id, name, unitPrice, unitsInStock }).from(products)
    .where(ilike(products.name, '%test%')).offset(0).limit(10),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` })
    .from(products).where(ilike(products.name, '%test%')),
]);
```

Select with aggregations:
```typescript
// Drizzle (core query only, not relational)
await db.select({
  id: orders.id,
  totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
  totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
  totalProducts: sql<number>`cast(count(${orderDetails.productId}) as int)`,
})
  .from(orders).where(eq(orders.id, id)).groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

Update:
```typescript
// TypeORM
const supplier = await repository.findOneBy({ id });
supplier.city = 'Updated'; await repository.save(supplier);
// Drizzle
await db.update(suppliers).set({ city: 'Updated' }).where(eq(suppliers.id, id));
```

Delete with transaction:
```typescript
// TypeORM
const qr = dataSource.createQueryRunner();
await qr.startTransaction();
try { await qr.manager.delete(OrderDetail, { orderId: id }); await qr.manager.delete(Order, { id }); await qr.commitTransaction(); }
catch { await qr.rollbackTransaction(); }
finally { await qr.release(); }
// Drizzle
try { await db.transaction(async (tx) => { await tx.delete(orderDetails).where(eq(orderDetails.orderId, id)); await tx.delete(orders).where(eq(orders.id, id)); }); }
catch (e) { console.error(e); }
```

**Key Differences:**
- Drizzle provides strict type safety (response type matches selected fields)
- `numeric` fields are `string` type (handles more precision than `number`)
- Aggregations not yet supported in relational queries
- Simpler transaction API