## Database Connection

Drizzle ORM connects to databases through drivers. Create a database instance with `drizzle(connectionString)` or `drizzle({ client })`.

```ts
import { drizzle } from "drizzle-orm/node-postgres"
const db = drizzle(process.env.DATABASE_URL);
const pool = db.$client; // access underlying driver
```

Supports PostgreSQL (Neon, Vercel Postgres, Supabase, Xata, PGLite), MySQL (PlanetScale, TiDB), SQLite (Turso, D1, Bun, Expo), and serverless runtimes.

Connection URL format: `postgresql://role:password@hostname/database`