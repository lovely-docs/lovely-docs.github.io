## Upsert Query

Supported on PostgreSQL, MySQL, and SQLite.

### PostgreSQL and SQLite

Use `.onConflictDoUpdate()` method:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });
```

For multiple rows, use the `excluded` keyword to reference the proposed row:

```ts
const values = [
  { id: 1, lastLogin: new Date() },
  { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  { id: 3, lastLogin: new Date(Date.now() + 1000 * 60 * 120) },
];

await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
  });
```

Custom function to update specific columns:

```ts
const buildConflictUpdateColumns = <T extends PgTable | SQLiteTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    const colName = cls[column].name;
    acc[column] = sql.raw(`excluded.${colName}`);
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

Composite primary key (multiple targets):

```ts
await db
  .insert(inventory)
  .values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId],
    set: { quantity: sql`${inventory.quantity} + 100` },
  });
```

Conditional update with `setWhere`:

```ts
const excludedPrice = sql.raw(`excluded.${products.price.name}`);
const excludedStock = sql.raw(`excluded.${products.stock.name}`);

await db
  .insert(products)
  .values(data)
  .onConflictDoUpdate({
    target: products.id,
    set: {
      price: excludedPrice,
      stock: excludedStock,
      lastUpdated: sql.raw(`excluded.${products.lastUpdated.name}`)
    },
    setWhere: or(
      sql`${products.stock} != ${excludedStock}`,
      sql`${products.price} != ${excludedPrice}`
    ),
  });
```

Preserve specific columns by using `sql`:

```ts
await db
  .insert(users)
  .values(data)
  .onConflictDoUpdate({
    target: users.id,
    set: { ...data, email: sql`${users.email}` }, // leave email unchanged
  });
```

### MySQL

Use `.onDuplicateKeyUpdate()` method. MySQL automatically determines conflict target from primary key and unique indexes:

```ts
await db
  .insert(users)
  .values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });
```

For multiple rows, use `values()` function:

```ts
const values = [
  { id: 1, lastLogin: new Date() },
  { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  { id: 3, lastLogin: new Date(Date.now() + 1000 * 60 * 120) },
];

await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: {
      lastLogin: sql`values(${users.lastLogin})`,
    },
  });
```

Custom function for specific columns:

```ts
const buildConflictUpdateColumns = <T extends MySqlTable, Q extends keyof T['_']['columns']>(
  table: T,
  columns: Q[],
) => {
  const cls = getTableColumns(table);
  return columns.reduce((acc, column) => {
    acc[column] = sql`values(${cls[column]})`;
    return acc;
  }, {} as Record<Q, SQL>);
};

await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: buildConflictUpdateColumns(users, ['lastLogin', 'active']),
  });
```

Preserve specific columns:

```ts
await db
  .insert(users)
  .values(data)
  .onDuplicateKeyUpdate({
    set: { ...data, email: sql`${users.email}` }, // leave email unchanged
  });
```