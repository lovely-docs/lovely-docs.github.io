## Setup Overview
This tutorial integrates Drizzle ORM with Netlify Edge Functions and Neon Postgres database.

## Prerequisites
- Netlify CLI installed
- Drizzle ORM and Drizzle Kit: `npm install drizzle-orm -D drizzle-kit`
- dotenv package (or Node.js v20.6.0+): `npm install dotenv`
- Optional: `npm install @netlify/edge-functions` for Context types

Note: These packages are only for local development. Edge Functions use imports from `import_map.json`.

## Configuration Steps

**1. Neon Postgres Setup**
- Log into Neon Console and select/create a project
- Use the default `neondb` database
- Copy connection string from Connect button

**2. Environment Variables**
Add to `.env`:
```
DATABASE_URL=postgres://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**3. Edge Function File Structure**
Create `netlify/edge-functions/user.ts`:
```typescript
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  return new Response("User data");
};
```

**4. Import Map**
Create `import_map.json` in project root:
```json
{
  "imports": {
    "drizzle-orm/": "https://esm.sh/drizzle-orm/",
    "@neondatabase/serverless": "https://esm.sh/@neondatabase/serverless"
  }
}
```

**5. Netlify Configuration**
Create `netlify.toml`:
```toml
[functions]
  deno_import_map = "./import_map.json"

[[edge_functions]]
  path = "/user"
  function = "user"
```

**6. Database Schema**
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

**7. Drizzle Config**
Create `drizzle.config.ts`:
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

**8. Apply Schema**
```bash
npx drizzle-kit push
```

**9. Connect to Database in Edge Function**
Update `netlify/edge-functions/user.ts`:
```typescript
import type { Context } from "@netlify/edge-functions";
import { usersTable } from "./common/schema.ts";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export default async (request: Request, context: Context) => {
  const sql = neon(Netlify.env.get("DATABASE_URL")!);
  const db = drizzle({ client: sql });
  const users = await db.select().from(usersTable);
  return new Response(JSON.stringify(users));
};
```

## Local Testing
```bash
netlify dev
```
Navigate to `/user` route. VS Code may show red underlines for imports despite correct execution; configure it when prompted or restart Deno Language Server.

## Deployment
```bash
netlify init
netlify env:import .env
netlify deploy
netlify deploy --prod  # for production
```
Access deployed function at `https://<your-site>/user`