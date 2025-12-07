**Setup:** Install drizzle-orm, drizzle-kit, dotenv, @vercel/postgres. Add POSTGRES_URL to .env.local.

**Connection** (`src/db/index.ts`):
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';
config({ path: '.env.local' });
export const db = drizzle();
```

**Schema** (`src/db/schema.ts`): Define tables with pgTable, serial IDs, text/integer/timestamp columns, foreign keys, defaults.

**Config** (`drizzle.config.ts`): Set schema path, migrations output, dialect: 'postgresql', dbCredentials with POSTGRES_URL.

**Migrations:** `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push` for prototyping.

**CRUD Examples:**
- Insert: `db.insert(table).values(data)`
- Select: `db.select().from(table).where(eq(col, val))`, with joins/groupBy/pagination
- Update: `db.update(table).set(data).where(eq(col, val))`
- Delete: `db.delete(table).where(eq(col, val))`