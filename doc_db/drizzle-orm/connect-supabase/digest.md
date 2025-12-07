## Supabase Integration

Supabase is an open source Firebase alternative for building secure and performant Postgres backends with minimal configuration.

### Installation

```
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Basic Setup

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(process.env.DATABASE_URL);
const allUsers = await db.select().from(...);
```

### With Existing Driver

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL)
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

### Connection Pooling Configuration

When using Supabase's connection pooler in "Transaction" pool mode, disable prepared statements:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(process.env.DATABASE_URL, { prepare: false })
const db = drizzle({ client });
const allUsers = await db.select().from(...);
```

Use the Connection Pooler for serverless environments and Direct Connection for long-running servers.