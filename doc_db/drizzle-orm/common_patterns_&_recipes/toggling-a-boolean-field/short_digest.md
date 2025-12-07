Toggle a boolean column using `not(table.column)` in `update().set()`:

```tsx
import { eq, not } from 'drizzle-orm';

await db.update(table).set({ isActive: not(table.isActive) }).where(eq(table.id, 1));
```

Works on PostgreSQL, MySQL, and SQLite.