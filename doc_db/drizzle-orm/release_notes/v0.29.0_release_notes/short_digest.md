## Key features in v0.29.0

**MySQL unsigned bigint:**
```ts
bigint('id', { mode: 'number', unsigned: true })
```

**Dynamic query building** - use `.$dynamic()` to invoke methods multiple times:
```ts
const query = db.select().from(users).$dynamic();
query = query.where(...).limit(...); // multiple invocations allowed
```

**Custom constraint names:**
```ts
primaryKey({ name: 'composite_key', columns: [...] })
foreignKey({ name: 'fkName', columns: [...], foreignColumns: [...] })
```

**Read replicas:**
```ts
const db = withReplicas(primaryDb, [read1, read2]);
db.select()... // reads from replica
db.delete()... // writes to primary
```

**Set operators:** `union()`, `intersect()`, `except()` with ALL variants

**Proxy drivers:** MySQL and PostgreSQL HTTP proxy drivers for custom implementations

**D1 Batch API:** Execute multiple queries in one batch with `db.batch([...])`

**Drizzle Kit 0.20.0:** `defineConfig`, D1 in Studio, auto env vars, custom constraint names