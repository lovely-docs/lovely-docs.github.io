## Xata Integration

Xata is a PostgreSQL database platform with features like instant copy-on-write branches, zero-downtime schema changes, data anonymization, and AI-powered performance monitoring.

### Setup

Install packages:
```
drizzle-orm postgres
-D drizzle-kit
```

Initialize driver and query:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

Or with existing postgres driver:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```