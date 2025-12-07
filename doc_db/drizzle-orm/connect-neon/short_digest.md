## Neon Postgres Connection

Drizzle supports Neon serverless via `neon-http` (faster for single queries) and `neon-websockets` (supports sessions/transactions).

**Neon HTTP:**
```typescript
import { drizzle } from 'drizzle-orm/neon-http';
const db = drizzle(process.env.DATABASE_URL);
```

**Neon WebSockets:**
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
const db = drizzle(process.env.DATABASE_URL);
// Node.js requires ws package and neonConfig.webSocketConstructor = ws
```

**Alternative drivers:** node-postgres (`drizzle-orm/node-postgres`) or postgres.js (`drizzle-orm/postgres-js`) for serverful environments.

Install: `drizzle-orm @neondatabase/serverless` and `-D drizzle-kit`