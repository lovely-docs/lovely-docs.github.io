## Migration from Other ORMs to Drizzle ORM

Complete step-by-step guides for migrating from Prisma, Sequelize, and TypeORM to Drizzle ORM.

### Common Migration Steps (all guides)
1. Install Drizzle ORM & Drizzle Kit: `npm install drizzle-orm pg` and `npm install -D drizzle-kit @types/pg`
2. Create `drizzle.config.ts` with database credentials and schema paths
3. Run `npx drizzle-kit introspect` to auto-generate schema from existing database
4. Create `src/drizzle/db.ts` to initialize database connection with `drizzle()` and `Client`
5. Update `src/index.ts` to run migrations on startup using `migrate(db, { migrationsFolder })`
6. Replace ORM-specific queries with Drizzle equivalents

### Drizzle Config Template
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

### Database Connection Template
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

### Schema Relations
After introspection generates tables, add relations for relational queries:
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

### Query Migration Examples

**Insert:**
```typescript
// Prisma: await prisma.supplier.createMany({ data: [...] })
// Sequelize: await Supplier.bulkCreate([...])
// TypeORM: await repository.save(repository.create([...]))

// Drizzle:
await db.insert(suppliers).values([
  { companyName: 'TestCompanyName1', city: 'TestCity1', country: 'TestCountry1' },
]);
```

**Select single row with join:**
```typescript
// Prisma: await prisma.product.findUnique({ where: { id }, include: { supplier: true } })
// Sequelize: await Product.findByPk(id, { include: Supplier })
// TypeORM: await repository.findOne({ where: { id }, relations: ['supplier'] })

// Drizzle (core query):
import { eq } from 'drizzle-orm';
const response = await db
  .select({ product: products, supplier: suppliers })
  .from(products)
  .where(eq(products.id, id))
  .leftJoin(suppliers, eq(suppliers.id, products.supplierId));

// Drizzle (relational query - higher-level API):
const response = await db.query.products.findFirst({
  where: (products, { eq }) => eq(products.id, id),
  with: { supplier: true },
});
```

**Select multiple with filtering and pagination:**
```typescript
// Prisma: await prisma.product.findMany({ where: { name: { contains: 'test', mode: 'insensitive' } }, take: 10, skip: 0 })
// Sequelize: await Product.findAndCountAll({ where: { name: { [Op.iLike]: '%test%' } }, limit: 10, offset: 0 })
// TypeORM: await repository.findAndCount({ where: { name: ILike('%test%') }, take: 10, skip: 0 })

// Drizzle (core query):
import { ilike, sql } from 'drizzle-orm';
const whereOptions = ilike(products.name, `%test%`);
const [response, count] = await Promise.all([
  db.select({ id: products.id, name: products.name, unitPrice: products.unitPrice, unitsInStock: products.unitsInStock })
    .from(products)
    .where(whereOptions)
    .offset(0)
    .limit(10),
  db.select({ count: sql<number>`cast(count(${products.id}) as integer)` }).from(products).where(whereOptions),
]);

// Drizzle (relational query):
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

**Select with aggregations and joins:**
```typescript
// Prisma: await prisma.orderDetail.aggregate({ where: { orderId: id }, _sum: { quantity: true }, _count: { orderId: true } })
// Sequelize: await sequelize.query('SELECT SUM(...) FROM order_details WHERE orderId = :id', { replacements: { id } })
// TypeORM: await orderRepository.createQueryBuilder('order').select(['SUM(detail.quantity) as totalQuantity']).getRawOne()

// Drizzle (core query - type-safe):
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

// Note: Aggregations not yet supported in relational queries; use core queries instead.
```

**Update:**
```typescript
// Prisma: await prisma.supplier.update({ where: { id }, data: { city: 'TestCity1Updated' } })
// Sequelize: supplier.set({ city: 'TestCity1Updated' }); await supplier.save()
// TypeORM: supplier.city = 'TestCity1Updated'; await repository.save(supplier)

// Drizzle:
import { eq } from 'drizzle-orm';
await db.update(suppliers).set({ city: 'TestCity1Updated', country: 'TestCountry1Updated' }).where(eq(suppliers.id, id));
```

**Delete with transaction:**
```typescript
// Prisma: await prisma.$transaction([prisma.orderDetail.deleteMany(...), prisma.order.deleteMany(...)])
// Sequelize: await sequelize.transaction(async (t) => { await OrderDetail.destroy(..., { transaction: t }); await order.destroy(...) })
// TypeORM: await queryRunner.manager.delete(OrderDetail, ...); await queryRunner.manager.delete(Order, ...)

// Drizzle:
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

### Important Notes
- Numeric fields like `unitPrice` are strings in Drizzle (handles more precision than JavaScript numbers)
- Relational queries provide a higher-level API similar to Prisma's `include` and TypeORM's `relations`
- Core queries offer more control and support aggregations
- Both approaches are fully type-safe
- Response types are strictly typed based on selected fields