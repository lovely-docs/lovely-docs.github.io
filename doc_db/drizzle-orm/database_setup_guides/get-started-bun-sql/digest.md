## Setup Drizzle ORM with Bun and PostgreSQL via Bun:SQL

**Prerequisites:**
- Bun JavaScript toolkit
- Bun SQL native bindings for PostgreSQL

**⚠️ Known Issue:** Bun v1.2.0 has concurrent statement execution issues; track the fix on GitHub issue oven-sh/bun#16774

**Installation:**
```bash
npm install drizzle-orm
npm install -D drizzle-kit @types/bun
```

**Setup Steps:**

1. **Environment variables:** Set `DATABASE_URL` with your PostgreSQL connection string

2. **Connect to database:** Use Bun's SQL bindings with Drizzle ORM (details in ConnectBun component)

3. **Create table:** Define schema using Drizzle (details in CreateTable component)

4. **Configure Drizzle:** Create drizzle.config.ts with dialect set to 'postgresql' and DATABASE_URL environment variable

5. **Apply migrations:** Run migrations to sync schema with database

6. **Seed and query:** Write queries using Drizzle ORM with 'bun-sql' dialect

7. **Execute:** Run TypeScript file with `bun src/index.ts`