## New Features

**Custom schema support for Postgres enums:**
```ts
import { pgSchema } from 'drizzle-orm/pg-core';

const mySchema = pgSchema('mySchema');
const colors = mySchema.enum('colors', ['red', 'green', 'blue']);
```

## Fixes

**D1 migrate() function:** Changed to use batch API for better performance.

**Postgres `.onConflictDoUpdate` method:** Split `where` clause into `setWhere` and `targetWhere` to support both where cases in on conflict clause.
```ts
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    targetWhere: sql`name <> 'John Doe'`,
    set: { name: sql`excluded.name` }
  });
  
await db.insert(employees)
  .values({ employeeId: 123, name: 'John Doe' })
  .onConflictDoUpdate({
    target: employees.employeeId,
    set: { name: 'John Doe' },
    setWhere: sql`name <> 'John Doe'`
  });
```

**Postgres `.onConflictDoNothing` method:** Fixed query generation for `where` clause placement.

**AWS Data API driver:** Fixed multiple issues including inserting and updating array values.