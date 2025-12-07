

## Pages

### netlify_edge_functions_with_neon_postgres
Tutorial for using Drizzle ORM with Netlify Edge Functions and Neon Postgres: setup schema, configure import_map.json and netlify.toml, connect via neon() and drizzle() in edge functions, deploy with netlify CLI.

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

### netlify_edge_functions_with_supabase
Configure Drizzle ORM with Netlify Edge Functions and Supabase: set up import_map.json with ESM imports, define schema, configure drizzle.config.ts, create edge function using postgres-js client with Netlify.env.get() for DATABASE_URL, deploy via netlify CLI.

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

### supabase_edge_functions_integration
Step-by-step integration of Drizzle ORM with Supabase Edge Functions: schema definition, migrations, local development, and deployment with environment-based connection pooling.

## Setup

Prerequisites: Supabase CLI, Drizzle ORM, Drizzle Kit, Docker Desktop.

## Schema Definition

Create `src/schema.ts`:
```typescript
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})
```

## Configuration

Create `drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./supabase/migrations",
  dialect: "postgresql",
});
```

## Project Initialization

```bash
supabase init
npx drizzle-kit generate
supabase start
supabase migration up
```

## Edge Function Setup

```bash
supabase functions new drizzle-tutorial
```

Add to `supabase/functions/drizzle-tutorial/deno.json`:
```json
{
  "imports": {
    "drizzle-orm/": "npm:/drizzle-orm/",
    "postgres": "npm:postgres"
  }
}
```

## Database Connection

In `supabase/functions/drizzle-tutorial/index.ts`:
```typescript
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/postgres-js";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import postgres from "postgres";

const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull()
})

Deno.serve(async () => {
  const connectionString = Deno.env.get("SUPABASE_DB_URL")!;
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle({ client });

  await db.insert(usersTable).values({
    name: "Alice",
    age: 25
  })
  const data = await db.select().from(usersTable);

  return new Response(JSON.stringify(data))
})
```

Note: Disable prefetch with `{ prepare: false }` for Transaction pool mode.

## Local Testing

```bash
supabase functions serve --no-verify-jwt
```

Navigate to `/drizzle-tutorial` to see results.

## Deployment

Link to hosted project:
```bash
supabase link --project-ref=<REFERENCE_ID>
supabase db push
```

Set environment variable (use Transaction pooler connection string):
```bash
supabase secrets set DATABASE_URL=<CONNECTION_STRING>
```

Update function to use `DATABASE_URL` instead of `SUPABASE_DB_URL`.

Deploy:
```bash
supabase functions deploy drizzle-tutorial --no-verify-jwt
```

Each Edge Function is independent with its own `deno.json` and dependencies.

### drizzle_with_vercel_edge_functions
Setup Drizzle ORM with Vercel Edge Functions using edge-compatible drivers (Neon/Vercel Postgres, PlanetScale, or Turso); define schema, config, migrations, database connection, and API route with `runtime: 'edge'`.

## Using Drizzle ORM with Vercel Edge Functions

This tutorial covers integrating Drizzle ORM with Vercel Functions running in Edge runtime. Edge runtime has limitations compared to Node.js, so edge-compatible drivers are required.

### Prerequisites
- Vercel CLI installed
- Existing Next.js project (or create with `npx create-next-app@latest --typescript`)
- Drizzle ORM and Drizzle Kit installed (`npm install drizzle-orm -D drizzle-kit`)

### Edge-Compatible Drivers
Choose a driver based on your database:
- **Neon serverless driver**: For Neon Postgres (HTTP/WebSocket instead of TCP)
- **Vercel Postgres driver**: Built on Neon serverless driver, for Vercel Postgres
- **PlanetScale serverless driver**: For MySQL over HTTP
- **libSQL client**: For Turso database

### Neon Postgres Setup

1. Install driver: `npm install @neondatabase/serverless`

2. Create schema in `src/db/schema.ts`:
```typescript
import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

3. Create `drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

4. Set `.env`:
```
POSTGRES_URL="postgres://[user]:[password]@[host]-[region].aws.neon.tech:5432/[db-name]?sslmode=[ssl-mode]"
```

5. Generate and run migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
# Or use push for quick prototyping:
npx drizzle-kit push
```

6. Connect in `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
export const db = drizzle(process.env.POSTGRES_URL!)
```

7. Create API route in `src/app/api/hello/route.ts`:
```typescript
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge'

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)
  return NextResponse.json({ users, message: 'success' });
}
```

8. Test locally: `npx next dev` then navigate to `/api/hello`

9. Deploy: `vercel` then `vercel env add POSTGRES_URL` then `vercel` again

### Vercel Postgres Setup

1. Install: `npm install @vercel/postgres`

2. Schema and config identical to Neon (same PostgreSQL dialect)

3. Connect in `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
export const db = drizzle()
```

4. API route, testing, and deployment same as Neon

### PlanetScale (MySQL) Setup

1. Install: `npm install @planetscale/database`

2. Create schema in `src/db/schema.ts`:
```typescript
import { mysqlTable, serial, text } from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

3. Create `drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.MYSQL_URL!,
  },
});
```

4. Set `.env`:
```
MYSQL_URL="mysql://[user]:[password]@[host].[region].psdb.cloud/[db-name]?ssl={'rejectUnauthorized':[ssl-rejectUnauthorized]}"
```

5. Generate and run migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`

6. Connect in `src/db/index.ts`:
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";
export const db = drizzle(process.env.MYSQL_URL!)
```

7. API route in `src/app/api/hello/route.ts`:
```typescript
import { db } from "@/app/db/db";
import { usersTable } from "@/app/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge'

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)
  return NextResponse.json({ users, message: 'success' });
}
```

8. Test and deploy same as Neon, but use `vercel env add MYSQL_URL`

### Turso (SQLite) Setup

1. Install: `npm install @libsql/client`

2. Create schema in `src/db/schema.ts`:
```typescript
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users_table', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})
```

3. Create `drizzle.config.ts`:
```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
```

4. Set `.env`:
```
TURSO_CONNECTION_URL="libsql://[db-name].turso.io"
TURSO_AUTH_TOKEN="[auth-token]"
```

5. Generate and run migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`

6. Connect in `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}})
```

7. API route in `src/app/api/hello/route.ts`:
```typescript
import { db } from "@/app/db/db";
import { usersTable } from "@/app/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const runtime = 'edge'

export async function GET(request: Request) {
  const users = await db.select().from(usersTable)
  return NextResponse.json({ users, message: 'success' });
}
```

8. Test locally and deploy: `vercel` then `vercel env add TURSO_CONNECTION_URL` and `vercel env add TURSO_AUTH_TOKEN` then `vercel`

