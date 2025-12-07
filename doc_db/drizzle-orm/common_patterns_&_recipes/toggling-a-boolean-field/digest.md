## Toggle Boolean Field

To toggle a boolean column value in an update statement, use the `not()` operator with `update().set()`:

```tsx
import { eq, not } from 'drizzle-orm';

await db
  .update(table)
  .set({
    isActive: not(table.isActive),
  })
  .where(eq(table.id, 1));
```

Generates SQL: `update "table" set "is_active" = not "is_active" where "id" = 1;`

Supported on PostgreSQL, MySQL, and SQLite.

**Note:** MySQL uses `tinyint(1)` for booleans, SQLite uses integers (0 for false, 1 for true).