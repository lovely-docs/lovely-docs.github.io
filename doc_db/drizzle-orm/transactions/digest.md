## Transactions

SQL transactions group one or more SQL statements into a single logical unit that either commits entirely or rolls back entirely.

### Basic Usage

```ts
const db = drizzle(...)

await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});
```

### Nested Transactions (Savepoints)

```ts
await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  await tx.transaction(async (tx2) => {
    await tx2.update(users).set({ name: "Mr. Dan" }).where(eq(users.name, "Dan"));
  });
});
```

### Rollback on Condition

```ts
await db.transaction(async (tx) => {
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  if (account.balance < 100) {
    tx.rollback()
  }
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
});
```

### Return Values

```ts
const newBalance: number = await db.transaction(async (tx) => {
  await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
  const [account] = await tx.select({ balance: accounts.balance }).from(accounts).where(eq(users.name, 'Dan'));
  return account.balance;
});
```

### Relational Queries in Transactions

```ts
const db = drizzle({ schema })
await db.transaction(async (tx) => {
  await tx.query.users.findMany({ with: { accounts: true } });
});
```

### Dialect-Specific Configuration

**PostgreSQL:**
```ts
await db.transaction(async (tx) => { /* ... */ }, {
  isolationLevel: "read committed" | "read uncommitted" | "repeatable read" | "serializable",
  accessMode: "read only" | "read write",
  deferrable: boolean,
});
```

**MySQL/SingleStore:**
```ts
await db.transaction(async (tx) => { /* ... */ }, {
  isolationLevel: "read committed" | "read uncommitted" | "repeatable read" | "serializable",
  accessMode: "read only" | "read write",
  withConsistentSnapshot: boolean,
});
```

**SQLite:**
```ts
await db.transaction(async (tx) => { /* ... */ }, {
  behavior: "deferred" | "immediate" | "exclusive",
});
```