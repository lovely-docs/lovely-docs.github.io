## Drizzle with Vercel Edge Functions

Edge runtime requires edge-compatible drivers: Neon serverless (Postgres), Vercel Postgres, PlanetScale (MySQL), or libSQL (Turso).

**Neon Postgres example:**
```typescript
// schema.ts
import { pgTable, serial, text } from "drizzle-orm/pg-core";
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: text('age').notNull(),
  email: text('email').notNull().unique(),
})

// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: process.env.POSTGRES_URL! },
});

// .env
POSTGRES_URL="postgres://[user]:[password]@[host]-[region].aws.neon.tech:5432/[db-name]?sslmode=[ssl-mode]"

// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
export const db = drizzle(process.env.POSTGRES_URL!)

// src/app/api/hello/route.ts
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

Generate migrations: `npx drizzle-kit generate && npx drizzle-kit migrate`
Test: `npx next dev` → navigate to `/api/hello`
Deploy: `vercel && vercel env add POSTGRES_URL && vercel`

**Vercel Postgres:** Same setup but use `drizzle-orm/vercel-postgres` and `export const db = drizzle()`

**PlanetScale (MySQL):** Use `@planetscale/database`, `drizzle-orm/planetscale-serverless`, `mysqlTable`, dialect `"mysql"`, env var `MYSQL_URL`

**Turso (SQLite):** Use `@libsql/client`, `drizzle-orm/libsql`, `sqliteTable`, dialect `"turso"`, env vars `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`