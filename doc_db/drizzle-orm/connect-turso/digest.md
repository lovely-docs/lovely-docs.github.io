## Turso Cloud Integration

Turso is a libSQL-powered edge SQLite database as a service. Drizzle ORM natively supports the libSQL driver.

### Installation
```
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

### Driver Initialization
Drizzle supports all `@libsql/client` driver variations. Initialize with:

**Node.js:**
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

**Web:**
```typescript
import { drizzle } from 'drizzle-orm/libsql/web';
import { createClient } from '@libsql/client/web';

const client = createClient({ 
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

const db = drizzle({ client });
```

Alternatively, pass connection config directly:
```typescript
const db = drizzle({ connection: {
  url: process.env.DATABASE_URL, 
  authToken: process.env.DATABASE_AUTH_TOKEN 
}});
```

### Querying
```typescript
import * as s from 'drizzle-orm/sqlite-core';

const users = s.sqliteTable("users", {
  id: s.integer(),
  name: s.text(),
});

const result = await db.select().from(users);
```

Drizzle mirrors SQLite query methods: `all()`, `get()`, `values()`, `run()`.