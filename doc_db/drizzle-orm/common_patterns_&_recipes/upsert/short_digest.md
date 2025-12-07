## Upsert Query

**PostgreSQL/SQLite:** Use `.onConflictDoUpdate()` with `target` and `set` properties. Use `excluded` keyword to reference proposed row values. Support composite primary keys via array target. Use `setWhere` for conditional updates.

```ts
await db.insert(users).values({ id: 1, name: 'John' })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: 'Super John' },
  });

// Multiple rows with excluded
await db.insert(users).values(values)
  .onConflictDoUpdate({
    target: users.id,
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
  });

// Composite key
await db.insert(inventory).values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId],
    set: { quantity: sql`${inventory.quantity} + 100` },
  });
```

**MySQL:** Use `.onDuplicateKeyUpdate()` with automatic conflict detection. Use `values()` function instead of `excluded`:

```ts
await db.insert(users).values({ id: 1, name: 'John' })
  .onDuplicateKeyUpdate({ set: { name: 'Super John' } });

// Multiple rows
await db.insert(users).values(values)
  .onDuplicateKeyUpdate({
    set: { lastLogin: sql`values(${users.lastLogin})` },
  });
```