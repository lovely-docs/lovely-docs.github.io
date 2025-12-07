## Getting Started with Cloudflare D1

Setup guide for using Drizzle ORM with Cloudflare D1 serverless SQL database.

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- Cloudflare D1 - serverless SQL database
- wrangler - Cloudflare CLI

**Step 1: Install packages**
Install drizzle-orm and required dependencies.

**Step 2: Configure wrangler.toml**
```toml
name = "YOUR PROJECT NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "DB"
database_name = "YOUR DB NAME"
database_id = "YOUR DB ID"
migrations_dir = "drizzle"
```

**Step 3: Connect to database**
```typescript
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
  },
};
```

**Step 4: Create a table**
Define your schema (referenced from separate component).

**Step 5: Setup drizzle.config.ts**
```typescript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

**Step 6: Apply migrations**
Run migrations to update database schema.

**Step 7: Query the database**
```typescript
const db = drizzle(env.<BINDING_NAME>);
const result = await db.select().from(users).all()
return Response.json(result);
```

**Step 8: Run the application**
Execute the index.ts file.