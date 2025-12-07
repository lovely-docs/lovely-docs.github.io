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