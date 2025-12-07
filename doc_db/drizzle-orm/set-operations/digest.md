## Set Operations

SQL set operations combine results from multiple query blocks. Drizzle-orm supports: `UNION`, `UNION ALL`, `INTERSECT`, `INTERSECT ALL`, `EXCEPT`, `EXCEPT ALL`.

### Union
Removes duplicates from combined results of two queries.

```typescript
import { union } from 'drizzle-orm/pg-core'
import { users, customers } from './schema'

const result = await union(
  db.select({ name: users.name }).from(users),
  db.select({ name: customers.name }).from(customers)
).limit(10);

// Or builder pattern:
const result = await db
  .select({ name: users.name })
  .from(users)
  .union(db.select({ name: customers.name }).from(customers))
  .limit(10);
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore

### Union All
Keeps duplicates when combining results.

```typescript
import { unionAll } from 'drizzle-orm/pg-core'

const result = await unionAll(
  db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
  db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
);

// Or:
const result = await db
  .select({ transaction: onlineSales.transactionId })
  .from(onlineSales)
  .unionAll(db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales));
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore (with ORDER BY behavior differences)

### Intersect
Returns only rows present in both query results, removing duplicates.

```typescript
import { intersect } from 'drizzle-orm/pg-core'

const result = await intersect(
  db.select({ courseName: depA.courseName }).from(depA),
  db.select({ courseName: depB.courseName }).from(depB)
);

// Or:
const result = await db
  .select({ courseName: depA.courseName })
  .from(depA)
  .intersect(db.select({ courseName: depB.courseName }).from(depB));
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore

### Intersect All
Returns only rows present in both query results, keeping duplicates.

```typescript
import { intersectAll } from 'drizzle-orm/pg-core'

const result = await intersectAll(
  db.select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered }).from(regularOrders),
  db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders)
);

// Or:
const result = await db
  .select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered })
  .from(regularOrders)
  .intersectAll(db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders));
```

Supported in: PostgreSQL, MySQL (not SingleStore)

### Except
Returns rows from first query that are not in second query, removing duplicates.

```typescript
import { except } from 'drizzle-orm/pg-core'

const result = await except(
  db.select({ courseName: depA.projectsName }).from(depA),
  db.select({ courseName: depB.projectsName }).from(depB)
);

// Or:
const result = await db
  .select({ courseName: depA.projectsName })
  .from(depA)
  .except(db.select({ courseName: depB.projectsName }).from(depB));
```

Supported in: PostgreSQL, MySQL, SQLite, SingleStore

### Except All
Returns rows from first query that are not in second query, keeping duplicates.

```typescript
import { exceptAll } from 'drizzle-orm/pg-core'

const result = await exceptAll(
  db.select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered }).from(regularOrders),
  db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders)
);

// Or:
const result = await db
  .select({ productId: regularOrders.productId, quantityOrdered: regularOrders.quantityOrdered })
  .from(regularOrders)
  .exceptAll(db.select({ productId: vipOrders.productId, quantityOrdered: vipOrders.quantityOrdered }).from(vipOrders));
```

Supported in: PostgreSQL, MySQL (not SingleStore)

All operations support both import-pattern (function-based) and builder-pattern (method-based) syntax. Database-specific imports are required: `drizzle-orm/pg-core`, `drizzle-orm/mysql-core`, `drizzle-orm/sqlite-core`, `drizzle-orm/singlestore-core`.