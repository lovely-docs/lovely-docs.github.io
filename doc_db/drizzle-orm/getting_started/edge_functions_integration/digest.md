## Edge Functions Integration with Drizzle ORM

Tutorials for integrating Drizzle ORM with serverless edge function platforms: Netlify Edge Functions, Supabase Edge Functions, and Vercel Edge Functions.

### Netlify Edge Functions

**With Neon Postgres:**
- Setup: Install drizzle-orm, drizzle-kit, dotenv
- Create `import_map.json` with ESM imports for drizzle-orm and @neondatabase/serverless
- Configure `netlify.toml` with deno_import_map and edge function paths
- Define schema in `netlify/edge-functions/common/schema.ts` using pgTable
- Create `drizzle.config.ts` pointing to schema with postgresql dialect
- Run `npx drizzle-kit push` to apply schema
- In edge function, connect via: `const sql = neon(Netlify.env.get("DATABASE_URL")!); const db = drizzle({ client: sql });`
- Deploy with `netlify init`, `netlify env:import .env`, `netlify deploy --prod`

**With Supabase:**
- Same setup as Neon but use postgres-js client instead
- `import_map.json` imports drizzle-orm and postgres from esm.sh
- Connect via: `const queryClient = postgres(Netlify.env.get("DATABASE_URL")!); const db = drizzle({ client: queryClient });`
- Access environment variables via `Netlify.env.get()`

### Supabase Edge Functions

- Prerequisites: Supabase CLI, Docker Desktop
- Schema in `src/schema.ts` using pgTable
- `drizzle.config.ts` with schema path and postgresql dialect
- Initialize: `supabase init`, `npx drizzle-kit generate`, `supabase start`, `supabase migration up`
- Create function: `supabase functions new function-name`
- Add `deno.json` with imports for drizzle-orm and postgres
- In function index.ts, connect via: `const client = postgres(Deno.env.get("SUPABASE_DB_URL")!); const db = drizzle({ client });`
- Use `{ prepare: false }` option for Transaction pool mode
- Local test: `supabase functions serve --no-verify-jwt`
- Deploy: `supabase link --project-ref=<ID>`, `supabase db push`, `supabase secrets set DATABASE_URL=<URL>`, `supabase functions deploy function-name --no-verify-jwt`

### Vercel Edge Functions

Requires edge-compatible drivers (no TCP connections). Choose based on database:
- Neon Postgres: @neondatabase/serverless
- Vercel Postgres: @vercel/postgres (built on Neon)
- PlanetScale MySQL: @planetscale/database
- Turso SQLite: @libsql/client

**Neon/Vercel Postgres Setup:**
- Schema in `src/db/schema.ts` using pgTable
- `drizzle.config.ts` with postgresql dialect and POSTGRES_URL credential
- Generate migrations: `npx drizzle-kit generate`, `npx drizzle-kit migrate` (or `push` for prototyping)
- Connect in `src/db/index.ts`: `import { drizzle } from 'drizzle-orm/neon-serverless'; export const db = drizzle(process.env.POSTGRES_URL!)`
- For Vercel Postgres: `import { drizzle } from 'drizzle-orm/vercel-postgres'; export const db = drizzle()`
- API route in `src/app/api/route.ts` with `export const runtime = 'edge'` and `export const dynamic = 'force-dynamic'`
- Deploy: `vercel`, `vercel env add POSTGRES_URL`, `vercel`

**PlanetScale MySQL Setup:**
- Schema using mysqlTable instead of pgTable
- `drizzle.config.ts` with mysql dialect and MYSQL_URL credential
- Connect: `import { drizzle } from "drizzle-orm/planetscale-serverless"; export const db = drizzle(process.env.MYSQL_URL!)`
- Deploy with `vercel env add MYSQL_URL`

**Turso SQLite Setup:**
- Schema using sqliteTable
- `drizzle.config.ts` with turso dialect, TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN credentials
- Connect: `import { drizzle } from 'drizzle-orm/libsql'; export const db = drizzle({ connection: { url: process.env.TURSO_CONNECTION_URL!, authToken: process.env.TURSO_AUTH_TOKEN! }})`
- Deploy with `vercel env add TURSO_CONNECTION_URL` and `vercel env add TURSO_AUTH_TOKEN`