## Getting Started with Turso Cloud

This guide walks through setting up Drizzle ORM with Turso Cloud (SQLite for production) and libsql driver.

### Prerequisites
- dotenv - environment variable management
- tsx - TypeScript file runner
- turso - SQLite for production
- libsql - SQLite fork optimized for low query latency

### Setup Steps

**Step 1: Install packages**
```bash
npm install @libsql/client
```

**Step 2: Environment variables**
Create `.env` file:
```plaintext
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```
Get these values from Turso dashboard or LibSQL Driver SDK tutorial.

**Step 3: Connect to database**
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

**Step 4: Create a table**
Define schema in `src/db/schema.ts` (details in referenced component).

**Step 5: Setup Drizzle config**
Create `drizzle.config.ts`:
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

**Step 6: Apply migrations**
Run Drizzle Kit migrations (details in referenced component).

**Step 7: Seed and query database**
Execute queries using initialized db instance (details in referenced component).

**Step 8: Run the file**
Execute with tsx runner (details in referenced component).