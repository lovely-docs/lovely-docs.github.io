## Setup Drizzle ORM with Bun SQL in an existing project

**Prerequisites:**
- dotenv for environment variables
- Bun JavaScript toolkit
- Bun SQL native bindings for PostgreSQL

**Known Issue:** Bun v1.2.0 has concurrent statement execution issues that may cause errors when running multiple queries simultaneously.

**Installation:**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit @types/bun
```

**Setup Steps:**

1. Create `.env` file with `DATABASE_URL` variable pointing to your PostgreSQL database

2. Create `drizzle.config.ts`:
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

3. Introspect existing database to generate schema:
```bash
drizzle-kit introspect:pg
```

4. Transfer generated schema to your actual schema file

5. Connect to database in `src/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/bun';
import { sql } from 'bun:sql';

const db = drizzle(sql);
```

6. Query the database:
```typescript
const result = await db.query.users.findMany();
```

7. Run with Bun:
```bash
bun src/index.ts
```

8. (Optional) Update table schema and apply migrations with `drizzle-kit push:pg`

9. (Optional) Query with new fields after schema updates