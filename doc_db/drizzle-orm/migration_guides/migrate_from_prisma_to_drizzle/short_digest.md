## Setup

Install: `npm install drizzle-orm pg` and `npm install -D drizzle-kit @types/pg`

Config (`drizzle.config.ts`): dialect, schema path, database credentials, output folder

Introspect: `npx drizzle-kit introspect` generates schema and migrations

Add relations to schema using `relations()` function

Connect: Create `db.ts` with `drizzle({ client, schema })`

Run migrations on startup: `await migrate(db, { migrationsFolder })`

## Query Examples

**Insert:**
```typescript
await db.insert(suppliers).values([{ companyName: 'Test', city: 'City', country: 'Country' }]);
```

**Select with join (relational):**
```typescript
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select with filtering/pagination:**
```typescript
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db.query.products.findMany({ where: whereOptions, columns: {...}, offset: 0, limit: 10 }),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` }).from(products).where(whereOptions),
]);
```

**Select with aggregations (core query only):**
```typescript
const response = await db
  .select({
    id: orders.id,
    totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
    totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
  })
  .from(orders)
  .where(eq(orders.id, id))
  .groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

**Update:**
```typescript
await db.update(suppliers).set({ city: 'Updated' }).where(eq(suppliers.id, id));
```

**Delete with transaction:**
```typescript
await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

Key differences: numeric fields are strings; relational queries for simple includes; core queries for aggregations and complex joins; both type-safe