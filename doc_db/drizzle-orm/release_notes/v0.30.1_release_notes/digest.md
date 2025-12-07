## OP-SQLite Driver Support

New driver added for OP-SQLite. Initialize with:

```ts
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);
await db.select().from(users);
```

## Fixes

- Migration hook fixed for Expo driver