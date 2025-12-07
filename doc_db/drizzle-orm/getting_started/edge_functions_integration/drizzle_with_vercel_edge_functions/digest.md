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