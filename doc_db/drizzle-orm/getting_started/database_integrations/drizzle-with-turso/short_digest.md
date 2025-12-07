## Setup

Install: `drizzle-orm`, `drizzle-kit`, `dotenv`, `@libsql/client`, Turso CLI

Turso is a SQLite-compatible database with replication and low-latency access.

## Configuration

1. Create Turso database: `turso db create drizzle-turso-db` and token: `turso db tokens create drizzle-turso-db`
2. Set `.env`: `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN`
3. Connect in `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```
4. Define schema in `src/db/schema.ts` using `sqliteTable`
5. Configure `drizzle.config.ts` with `dialect: 'turso'`
6. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate` (or `push` for prototyping)

## CRUD Operations

Insert: `db.insert(table).values(data)`
Select: `db.select().from(table).where(...).leftJoin(...).groupBy(...).orderBy(...).limit(...).offset(...)`
Update: `db.update(table).set(data).where(...)`
Delete: `db.delete(table).where(...)`