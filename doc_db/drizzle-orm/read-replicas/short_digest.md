## Read Replicas

Use `withReplicas(primaryDb, [replica1, replica2])` to automatically route SELECT queries to replicas and write operations to primary:

```ts
const db = withReplicas(primaryDb, [read1, read2]);
await db.select().from(usersTable); // uses replica
await db.delete(usersTable).where(...); // uses primary
await db.$primary.select().from(usersTable); // force primary
```

Implement custom replica selection with a function:
```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
  const weight = [0.7, 0.3];
  let cumulative = 0;
  const rand = Math.random();
  for (const [i, replica] of replicas.entries()) {
    cumulative += weight[i]!;
    if (rand < cumulative) return replica;
  }
  return replicas[0]!;
});
```