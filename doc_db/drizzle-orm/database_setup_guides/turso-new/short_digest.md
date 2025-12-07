## Turso Cloud Setup

Install `@libsql/client`, add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to `.env`, then initialize:

```typescript
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or with existing client:
```typescript
import { createClient } from '@libsql/client';
const client = createClient({ url, authToken });
const db = drizzle({ client });
```

Configure `drizzle.config.ts` with dialect `'turso'` and credentials, then apply migrations and run queries.