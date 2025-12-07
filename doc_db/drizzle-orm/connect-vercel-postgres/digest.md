## Vercel Postgres Integration

Vercel Postgres is a serverless SQL database designed to integrate with Vercel Functions. Drizzle ORM natively supports both the `@vercel/postgres` serverless driver and standard PostgreSQL drivers (`postgres` or `pg`) for accessing Vercel Postgres.

### Installation

```
drizzle-orm @vercel/postgres
-D drizzle-kit
```

### Setup

1. Set up a Vercel Postgres project according to official Vercel docs
2. Initialize the driver and execute queries

### Usage

With default client:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle();
const result = await db.execute('select 1');
```

With existing driver:
```typescript
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
const db = drizzle({ client: sql });
const result = await db.execute('select 1');
```

### Key Features

- `@vercel/postgres` works in both serverful and serverless environments (including Cloudflare Workers) via websockets
- For serverful environments, can use `@vercel/postgres` or direct `postgresql://` connection with `postgres` or `pg` drivers