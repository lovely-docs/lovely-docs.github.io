## Setup

Prerequisites: Netlify CLI, drizzle-orm, drizzle-kit, dotenv (or Node.js v20.6.0+), optionally @netlify/edge-functions for types.

Create Supabase project, get connection string from dashboard (Connect > Transaction pooler), add to `.env`:
```
DATABASE_URL=<YOUR_DATABASE_URL>
```

## Project Structure

Create `netlify/edge-functions/` directory for edge functions.

Create `import_map.json` in project root:
```json
{
  "imports": {
    "drizzle-orm/": "https://esm.sh/drizzle-orm/",
    "postgres": "https://esm.sh/postgres"
  }
}
```

Create `netlify.toml`:
```toml
[functions]
  deno_import_map = "./import_map.json"

[[edge_functions]]
  path = "/user"
  function = "user"
```

## Schema and Configuration

Create `netlify/edge-functions/common/schema.ts`:
```typescript
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
})
```

Create `drizzle.config.ts` in project root:
```typescript
import 'dotenv/config';
import type { Config } from "drizzle-kit";

export default {
  schema: './netlify/edge-functions/common/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

Apply schema: `npx drizzle-kit push`

## Edge Function

Create `netlify/edge-functions/user.ts`:
```typescript
import type { Context } from "@netlify/edge-functions";
import { usersTable } from "./common/schema.ts";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export default async (request: Request, context: Context) => {
  const queryClient = postgres(Netlify.env.get("DATABASE_URL")!);
  const db = drizzle({ client: queryClient });
  const users = await db.select().from(usersTable);
  return new Response(JSON.stringify(users));
};
```

Access environment variables via `Netlify.env.get()`. Request and Response types are global.

## Testing and Deployment

Local testing: `netlify dev` - navigate to `/user` route.

Initialize project: `netlify init`

Import env vars: `netlify env:import .env`

Deploy: `netlify deploy` (draft) or `netlify deploy --prod` (production)

Access deployed function at `<deployed-url>/user`