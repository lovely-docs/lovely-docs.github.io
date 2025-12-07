## Prepared Statements for Query Performance

Prepared statements allow SQL concatenation to happen once, letting the database reuse precompiled binary SQL for repeated executions.

**Basic usage:**
```typescript
const prepared = db.select().from(customers).prepare("name"); // PostgreSQL requires name
await prepared.execute(); // or .all()/.get() for SQLite
```

**With dynamic values using placeholders:**
```typescript
import { sql } from "drizzle-orm";

const p = db.select().from(customers)
  .where(eq(customers.id, sql.placeholder('id')))
  .prepare();

await p.execute({ id: 10 });
await p.execute({ id: 12 });
```

Different databases have slightly different APIs (PostgreSQL/MySQL/SingleStore use `.execute()`, SQLite uses `.get()`/`.all()`).