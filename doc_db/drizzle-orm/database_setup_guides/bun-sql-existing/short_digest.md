**Install:** `npm install drizzle-orm dotenv` + `npm install -D drizzle-kit @types/bun`

**Setup:** Create `.env` with `DATABASE_URL`, configure `drizzle.config.ts` with PostgreSQL dialect, introspect database with `drizzle-kit introspect:pg`

**Connect:** `const db = drizzle(sql)` from `drizzle-orm/bun` and `bun:sql`

**Query:** `await db.query.users.findMany()`

**Run:** `bun src/index.ts`

**Note:** Bun v1.2.0 has concurrent statement execution issues