Execute SQL statements in transactions with automatic commit/rollback. Supports nested transactions (savepoints), conditional rollback, return values, and dialect-specific isolation levels and access modes.

**Basic:**
```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
});
```

**With config (PostgreSQL example):**
```ts
await db.transaction(async (tx) => { /* ... */ }, {
  isolationLevel: "read committed",
  accessMode: "read write",
  deferrable: true,
});
```