## Bun SQL Integration

Drizzle ORM natively supports Bun's SQL module for PostgreSQL database connections.

**Prerequisites:**
- Database connection basics with Drizzle
- Bun runtime (fast all-in-one JavaScript runtime)
- Bun SQL - native PostgreSQL bindings

**Installation:**
```
npm install drizzle-orm
npm install -D drizzle-kit
```

**Basic usage - auto-initialize driver:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';

const db = drizzle(process.env.DATABASE_URL);
const result = await db.select().from(...);
```

**With existing driver:**
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/bun-sql';
import { SQL } from 'bun';

const client = new SQL(process.env.DATABASE_URL!);
const db = drizzle({ client });
```

Bun SQL integration is noted as "crazy fast".