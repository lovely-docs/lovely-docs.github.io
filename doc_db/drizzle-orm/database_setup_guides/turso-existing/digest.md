## Setup Drizzle ORM with Turso Cloud in an existing project

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- turso - SQLite for Production
- libsql - SQLite fork optimized for low query latency

**Step 1: Install packages**
```bash
npm install @libsql/client
```

**Step 2: Setup environment variables**
Create `.env` file:
```plaintext
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Get these values from the LibSQL Driver SDK tutorial at docs.turso.tech/sdk/ts/quickstart

**Step 3: Create drizzle.config.ts**
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});
```

**Step 4: Introspect your database** - generates schema from existing database

**Step 5: Transfer introspected code to schema file** - move generated schema to `src/db/schema.ts`

**Step 6: Connect Drizzle ORM to database**
Create `src/index.ts`:
```typescript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

const db = drizzle({ 
  connection: { 
    url: process.env.TURSO_DATABASE_URL!, 
    authToken: process.env.TURSO_AUTH_TOKEN!
  }
});
```

Or with existing driver:
```typescript
import { createClient } from '@libsql/client';
const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!, 
  authToken: process.env.TURSO_AUTH_TOKEN!
});
const db = drizzle({ client });
```

**Step 7: Query the database** - use the db instance to run queries

**Step 8: Run index.ts file** - execute with tsx

**Step 9 (optional): Update table schema** - modify schema.ts and run migrations

**Step 10 (optional): Apply changes to database** - run Drizzle Kit migrations

**Step 11 (optional): Query with new fields** - use updated schema in queries