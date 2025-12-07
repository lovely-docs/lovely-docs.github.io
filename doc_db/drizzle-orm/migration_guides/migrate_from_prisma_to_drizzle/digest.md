## Migration Overview

Steps to migrate from Prisma to Drizzle ORM:
1. Install Drizzle ORM & Drizzle Kit
2. Setup Drizzle config file
3. Introspect your database
4. Connect Drizzle ORM to your database
5. Transition Prisma queries to Drizzle ORM queries

## Setup

**Install packages:**
```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

**Drizzle config** (`drizzle.config.ts`):
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

**Introspect database:**
```bash
npx drizzle-kit introspect
```

Generates `src/drizzle/schema.ts` with table definitions and migrations.

**Add relations to schema** (`src/drizzle/schema.ts`):
```typescript
import { relations } from 'drizzle-orm';

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

**Database connection** (`src/drizzle/db.ts`):
```typescript
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

**Run migrations** (`src/index.ts`):
```typescript
import 'dotenv/config';
import { client, db } from './drizzle/db';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

(async () => {
  await client.connect();
  await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
  // ... start application
})();
```

## Query Migration

**Insert:**
```typescript
// Prisma
await prisma.supplier.createMany({
  data: [
    { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  ],
});

// Drizzle
import { db } from '../drizzle/db';
import { suppliers } from '../drizzle/schema';

await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
]);
```

**Select single row with join:**
```typescript
// Prisma
const response = await prisma.product.findUnique({
  where: { id },
  include: { supplier: true },
});

// Drizzle - core query
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { products, suppliers } from '../drizzle/schema';

const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));

// Drizzle - relational query
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select multiple with filtering and pagination:**
```typescript
// Prisma
const [response, count] = await Promise.all([
  prisma.product.findMany({
    where: { name: { contains: 'test', mode: 'insensitive' } },
    take: 10,
    skip: 0,
    select: { id: true, name: true, unitPrice: true, unitsInStock: true },
  }),
  prisma.product.count({ where: { name: { contains: 'test', mode: 'insensitive' } } }),
]);

// Drizzle - core query
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

// Drizzle - relational query
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

**Select with aggregations:**
```typescript
// Prisma
const order = await prisma.order.findFirst({ where: { id }, select: { id: true, orderDate: true, shipCountry: true } });
const { _count, _sum } = await prisma.orderDetail.aggregate({
  where: { orderId: id },
  _sum: { quantity: true },
  _count: { orderId: true },
});
const totalPrice = await prisma.$queryRaw`SELECT SUM(unitPrice * quantity) as "totalPrice" FROM order_details WHERE "orderId" = ${id}`;

// Drizzle
import { eq, sql } from 'drizzle-orm';
import { orders, orderDetails, products } from '../drizzle/schema';

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

Note: Aggregations not yet supported in relational queries; use core queries instead.

**Update:**
```typescript
// Prisma
const supplier = await prisma.supplier.update({
  where: { id },
  data: { city: 'TestCity1Updated', country: 'TestCountry1Updated' },
});

// Drizzle
import { eq } from 'drizzle-orm';
import { suppliers } from '../drizzle/schema';

await db.update(suppliers).set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' }).where(eq(suppliers.id, id));
```

**Delete with transaction:**
```typescript
// Prisma
const orderDetailQuery = prisma.orderDetail.deleteMany({ where: { orderId: id } });
const orderQuery = prisma.order.deleteMany({ where: { id } });
await prisma.$transaction([orderDetailQuery, orderQuery]);

// Drizzle
import { eq } from 'drizzle-orm';
import { orderDetails, orders } from '../drizzle/schema';

try {
  await db.transaction(async (tx) => {
    await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
    await tx.delete(orders).where(eq(orders.id, id));
  });
} catch (e) {
  console.error(e);
}
```

**Important notes:**
- Numeric fields like `unitPrice` are strings in Drizzle (can handle more precision than JavaScript numbers)
- Relational queries provide a higher-level API similar to Prisma's `include`
- Core queries offer more control and support aggregations
- Both approaches are type-safe