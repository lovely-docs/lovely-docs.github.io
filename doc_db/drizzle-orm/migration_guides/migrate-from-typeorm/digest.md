## Migration from TypeORM to Drizzle ORM

### Overview
Step-by-step guide to migrate a TypeORM project to Drizzle ORM. The process applies to any application type (REST API, etc.) and any supported database (example uses PostgreSQL).

### Migration Steps
1. Install Drizzle ORM & Drizzle Kit: `npm install drizzle-orm pg` and `npm install -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with database credentials and schema paths
3. Run `npx drizzle-kit introspect` to generate schema from existing database
4. Create `src/drizzle/db.ts` to initialize database connection
5. Update `src/index.ts` to run migrations on startup
6. Replace TypeORM queries with Drizzle equivalents

### Example Project Structure
Four entities with relations:
- `Supplier` (one-to-many with Product)
- `Product` (many-to-one with Supplier, one-to-many with OrderDetail)
- `Order` (one-to-many with OrderDetail)
- `OrderDetail` (join table for many-to-many Order-Product relation)

### Drizzle Config
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './src/drizzle',
  schema: './src/drizzle/schema.ts',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  verbose: true,
  strict: true,
});
```

### Database Connection
```typescript
// src/drizzle/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

export const client = new Client({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

export const db = drizzle({ client, schema });
```

```typescript
// src/index.ts
import 'dotenv/config';
import { client, db } from './drizzle/db';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

(async () => {
  await client.connect();
  await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
  // start application
})();
```

### Generated Schema (from introspection)
```typescript
import { pgTable, serial, text, integer, numeric, date, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey().notNull(),
  companyName: text('companyName').notNull(),
  city: text('city'),
  country: text('country').notNull(),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  supplierId: integer('supplierId').notNull().references(() => suppliers.id),
  unitPrice: numeric('unitPrice', { precision: 10, scale: 4 }).notNull(),
  unitsInStock: integer('unitsInStock').notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey().notNull(),
  orderDate: date('orderDate').notNull(),
  shippedDate: date('shippedDate'),
  shipAddress: text('shipAddress').notNull(),
  shipPostalCode: text('shipPostalCode'),
  shipCountry: text('shipCountry').notNull(),
});

export const orderDetails = pgTable(
  'order_details',
  {
    orderId: integer('orderId').notNull().references(() => orders.id),
    productId: integer('productId').notNull().references(() => products.id),
    quantity: integer('quantity').notNull(),
  },
  (table) => [primaryKey({ columns: [table.orderId, table.productId] })]
);

// Relational queries support
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, { fields: [products.supplierId], references: [suppliers.id] }),
  orderDetails: many(orderDetails),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  orderDetails: many(orderDetails),
}));

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders, { fields: [orderDetails.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderDetails.productId], references: [products.id] }),
}));
```

### Query Replacements

#### Insert
TypeORM:
```typescript
const repository = dataSource.getRepository(Supplier);
const suppliers = repository.create([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  { companyName: 'TestCompanyName2', city: 'TestCity2', country: 'TestCountry2' },
]);
await repository.save(suppliers);
```

Drizzle:
```typescript
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  { companyName: 'TestCompanyName2', city: 'TestCity2', country: 'TestCountry2' },
]);
```

Note: `unitPrice` field is `string` in Drizzle (handles more precision than `number`).

#### Select Single Row with Relations
TypeORM:
```typescript
const repository = dataSource.getRepository(Product);
const response = await repository.findOne({
  where: { id },
  relations: ['supplier'],
});
```

Drizzle (core query):
```typescript
import { eq } from 'drizzle-orm';
const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));
```

Drizzle (relational query):
```typescript
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

Drizzle provides strict type safety - response type matches exactly what's selected.

#### Select Multiple Rows with Filtering and Pagination
TypeORM:
```typescript
import { ILike } from 'typeorm';
const repository = dataSource.getRepository(Product);
const response = await repository.findAndCount({
  skip: 0,
  take: 10,
  where: { name: ILike(`%test%`) },
  select: ['id', 'name', 'unitPrice', 'unitsInStock'],
});
```

Drizzle (core query):
```typescript
import { ilike, sql } from 'drizzle-orm';
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db
    .select({ id: products.id, name: products.name, unitPrice: products.unitPrice, unitsInStock: products.unitsInStock })
    .from(products)
    .where(whereOptions)
    .offset(0)
    .limit(10),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` }).from(products).where(whereOptions),
]);
```

Drizzle (relational query):
```typescript
const [response, count] = await Promise.all([
  db.query.products.findMany({
    where: whereOptions,
    columns: { id: true, name: true, unitPrice: true, unitsInStock: true },
    offset: 0,
    limit: 10,
  }),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` }).from(products).where(whereOptions),
]);
```

#### Select with Aggregations and Joins
TypeORM (requires querybuilder, not type-safe):
```typescript
const response = await orderRepository
  .createQueryBuilder('order')
  .select([
    'order.id as id',
    'order.orderDate as "orderDate"',
    'order.shipCountry as "shipCountry"',
    'SUM(product.unitPrice * detail.quantity)::float as "totalPrice"',
    'SUM(detail.quantity)::int as "totalQuantity"',
    'COUNT(detail.productId)::int as "totalProducts"',
  ])
  .leftJoin('order.orderDetails', 'detail')
  .leftJoin('detail.product', 'product')
  .groupBy('order.id')
  .where('order.id = :id', { id })
  .getRawOne();
```

Drizzle (type-safe):
```typescript
import { eq, sql } from 'drizzle-orm';
const response = await db
  .select({
    id: orders.id,
    shipCountry: orders.shipCountry,
    orderDate: orders.orderDate,
    totalPrice: sql<number>`cast(sum(${orderDetails.quantity} * ${products.unitPrice}) as float)`,
    totalQuantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
    totalProducts: sql<number>`cast(count(${orderDetails.productId}) as int)`,
  })
  .from(orders)
  .where(eq(orders.id, id))
  .groupBy(orders.id)
  .leftJoin(orderDetails, eq(orderDetails.orderId, orders.id))
  .leftJoin(products, eq(products.id, orderDetails.productId));
```

Note: Aggregations not yet supported in relational queries, use core queries.

#### Update
TypeORM:
```typescript
const repository = dataSource.getRepository(Supplier);
const supplier = await repository.findOneBy({ id });
if (!supplier) throw new Error('Supplier not found');
supplier.city = 'TestCity1Updated';
supplier.country = 'TestCountry1Updated';
await repository.save(supplier);
```

Drizzle:
```typescript
import { eq } from 'drizzle-orm';
await db
  .update(suppliers)
  .set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' })
  .where(eq(suppliers.id, id));
```

#### Delete with Transaction
TypeORM:
```typescript
const queryRunner = dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
try {
  await queryRunner.manager.delete(OrderDetail, { orderId: id });
  await queryRunner.manager.delete(Order, { id });
  await queryRunner.commitTransaction();
} catch (e) {
  await queryRunner.rollbackTransaction();
  console.error(e);
} finally {
  await queryRunner.release();
}
```

Drizzle:
```typescript
import { eq } from 'drizzle-orm';
try {
  await db.transaction(async (tx) => {
    await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
    await tx.delete(orders).where(eq(orders.id, id));
  });
} catch (e) {
  console.error(e);
}
```