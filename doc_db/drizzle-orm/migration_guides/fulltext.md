

## Pages

### migrate_from_prisma_to_drizzle
Step-by-step migration from Prisma to Drizzle ORM with setup (config, introspection, connection) and query examples (insert, select with joins/filtering/aggregations, update, delete with transactions).

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

### migrate-from-sequelize
Step-by-step migration from Sequelize to Drizzle ORM with introspection, schema generation, and query pattern replacements (insert, select with joins/aggregations, update, delete with transactions).

## Migration from Sequelize to Drizzle ORM

Complete guide for migrating a Sequelize project to Drizzle ORM, using PostgreSQL with a REST API example.

### Overview of Migration Steps
1. Install Drizzle ORM & Drizzle Kit
2. Setup Drizzle config file
3. Introspect your database
4. Connect Drizzle ORM to your database
5. Transition Sequelize queries to Drizzle ORM queries

### Example Project Structure
Four entities with relationships:
- `Supplier` (one-to-many) → `Product`
- `Order` (many-to-many through `OrderDetail`) ↔ `Product`

### Installation & Setup

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

**drizzle.config.ts:**
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

### Database Introspection

```bash
npx drizzle-kit introspect
```

Generates `schema.ts` with table definitions and migrations.

**Generated schema.ts example:**
```typescript
import { pgTable, varchar, serial, text, foreignKey, integer, numeric, timestamp, primaryKey } from 'drizzle-orm/pg-core';
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
  supplierId: integer('supplierId').notNull().references(() => suppliers.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  unitPrice: numeric('unitPrice').notNull(),
  unitsInStock: integer('unitsInStock').notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey().notNull(),
  orderDate: timestamp('orderDate', { withTimezone: true, mode: 'string' }).notNull(),
  shippedDate: timestamp('shippedDate', { withTimezone: true, mode: 'string' }),
  shipAddress: text('shipAddress').notNull(),
  shipPostalCode: text('shipPostalCode'),
  shipCountry: text('shipCountry').notNull(),
});

export const orderDetails = pgTable(
  'order_details',
  {
    orderId: integer('orderId').notNull().references(() => orders.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    productId: integer('productId').notNull().references(() => products.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    quantity: integer('quantity').notNull(),
  },
  (table) => [primaryKey({ columns: [table.orderId, table.productId], name: 'order_details_pkey' })]
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

### Database Connection

**src/drizzle/db.ts:**
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

**src/index.ts:**
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

### Query Migration Examples

#### Insert Queries

**Sequelize:**
```typescript
const suppliers = await Supplier.bulkCreate([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  { companyName: 'TestCompanyName2', city: 'TestCity2', country: 'TestCountry2' },
]);
```

**Drizzle ORM:**
```typescript
import { db } from '../drizzle/db';
import { suppliers } from '../drizzle/schema';

await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
  { companyName: 'TestCompanyName2', city: 'TestCity2', country: 'TestCountry2' },
]);
```

**Note:** `numeric` fields like `unitPrice` are strings in Drizzle ORM (can handle more precision than JavaScript numbers).

#### Select Queries

**Single row with join:**

Sequelize:
```typescript
const response = await Product.findByPk(id, { include: Supplier });
```

Drizzle ORM (core query):
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { products, suppliers } from '../drizzle/schema';

const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));
```

Drizzle ORM (relational query):
```typescript
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

Response type is strictly typed based on selected fields.

**Multiple rows with filtering and pagination:**

Sequelize:
```typescript
import { Op } from 'sequelize';

const { rows, count } = await Product.findAndCountAll({
  limit: 10,
  offset: 0,
  attributes: ['id', 'name', 'unitPrice', 'unitsInStock'],
  where: { name: { [Op.iLike]: `%test%` } },
});
```

Drizzle ORM (core query):
```typescript
import { ilike, sql } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { products } from '../drizzle/schema';

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

Drizzle ORM (relational query):
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

**Complex aggregation query:**

Sequelize (raw SQL):
```typescript
const response = await sequelize.query(
  `SELECT orders.id, orders."orderDate", orders."shipCountry",
    SUM(products."unitPrice" * order_details.quantity)::float AS "totalPrice",
    SUM(order_details.quantity)::int AS "totalQuantity",
    COUNT(order_details."productId")::int AS "totalProducts"
   FROM orders
   LEFT JOIN order_details ON orders.id = order_details."orderId"
   LEFT JOIN products ON order_details."productId" = products.id
   WHERE orders.id = :orderId
   GROUP BY orders.id`,
  { replacements: { orderId: id }, type: QueryTypes.SELECT }
);
```

Drizzle ORM:
```typescript
import { eq, sql } from 'drizzle-orm';
import { db } from '../drizzle/db';
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

Note: Aggregations are not supported in relational queries; use core queries instead.

#### Update Queries

Sequelize:
```typescript
const supplier = await Supplier.findByPk(1);
if (!supplier) throw new Error('Supplier not found');
supplier.set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' });
await supplier.save();
```

Drizzle ORM:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { suppliers } from '../drizzle/schema';

await db
  .update(suppliers)
  .set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' })
  .where(eq(suppliers.id, id));
```

#### Delete Queries with Transactions

Sequelize:
```typescript
const order = await Order.findByPk(id);
if (!order) throw new Error('Order not found');

await sequelize.transaction(async (t) => {
  await OrderDetail.destroy({ where: { orderId: id }, transaction: t });
  await order.destroy({ transaction: t });
});
```

Drizzle ORM:
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../drizzle/db';
import { orderDetails, orders } from '../drizzle/schema';

await db.transaction(async (tx) => {
  await tx.delete(orderDetails).where(eq(orderDetails.orderId, id));
  await tx.delete(orders).where(eq(orders.id, id));
});
```

### migrate-from-typeorm
Step-by-step migration from TypeORM to Drizzle: install packages, create config, introspect DB, connect, then replace queries (insert/select/update/delete) with Drizzle equivalents; includes full examples for core and relational queries, filtering, pagination, aggregations, and transactions.

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

