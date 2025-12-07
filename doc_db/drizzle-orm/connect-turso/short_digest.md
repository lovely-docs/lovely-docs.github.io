## Turso Cloud Setup

Install `drizzle-orm` and `@libsql/client`. Initialize driver with URL and auth token:

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const db = drizzle({ 
  client: createClient({ 
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN
  })
});

const users = sqliteTable("users", { id: integer(), name: text() });
const result = await db.select().from(users);
```

Use `drizzle-orm/libsql/web` for browser environments.