## Database Setup Guides

Comprehensive setup instructions for integrating Drizzle ORM with 30+ databases and platforms.

### Supported Databases

**SQL Databases:**
- PostgreSQL (node-postgres, postgres.js)
- MySQL (mysql2)
- SQLite (libsql, better-sqlite3, bun:sqlite, expo-sqlite, op-sqlite)
- SingleStore (mysql2)

**Serverless/Cloud Platforms:**
- Neon (serverless Postgres via HTTP/WebSocket)
- Supabase (managed PostgreSQL)
- Vercel Postgres (serverless Postgres)
- PlanetScale (serverless MySQL via HTTP)
- TiDB Serverless (distributed SQL via HTTP)
- Turso (SQLite for production via libsql)
- SQLite Cloud (cloud SQLite)
- Xata (PostgreSQL)
- Nile (multi-tenant PostgreSQL)

**Edge/Specialized:**
- Cloudflare D1 (serverless SQLite)
- Cloudflare Workers with SQLite Durable Objects
- Bun SQL (native PostgreSQL bindings)
- Bun SQLite (native SQLite bindings)
- Expo SQLite (React Native)
- OP-SQLite (React Native)
- PGLite (in-process PostgreSQL)
- Gel (database)

### Common Setup Pattern

Each guide follows this workflow:

1. **Install packages** - Database driver + drizzle-orm + drizzle-kit
2. **Environment variables** - DATABASE_URL or equivalent connection string
3. **Drizzle config** - `drizzle.config.ts` with dialect and credentials
4. **Schema** - Define tables using Drizzle schema API or introspect existing database
5. **Migrations** - Generate and apply with `drizzle-kit generate/push`
6. **Connection** - Initialize Drizzle client with appropriate driver
7. **Queries** - Execute CRUD operations

### Example: PostgreSQL Setup

```typescript
// Install: npm install pg drizzle-orm
// npm install -D drizzle-kit @types/pg

// .env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  schema: './src/schema.ts',
});

// src/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
const db = drizzle(client);

// src/schema.ts
import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  age: integer(),
  email: text().notNull().unique(),
});

// Usage
await db.insert(users).values({ name: 'John', age: 30, email: 'john@example.com' });
const allUsers = await db.select().from(users);
await db.update(users).set({ age: 31 }).where(eq(users.email, 'john@example.com'));
await db.delete(users).where(eq(users.email, 'john@example.com'));
```

### Example: SQLite Setup

```typescript
// Install: npm install @libsql/client drizzle-orm
// npm install -D drizzle-kit

// .env
DB_FILE_NAME=file:local.db

// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'sqlite',
  dbCredentials: { url: process.env.DB_FILE_NAME! },
  schema: './src/schema.ts',
});

// src/db.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: process.env.DB_FILE_NAME! });
const db = drizzle(client);

// src/schema.ts
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: integer(),
  email: text().notNull().unique(),
});
```

### Introspection for Existing Databases

For existing databases, use introspection to auto-generate schema:
```bash
npx drizzle-kit introspect:pg  # PostgreSQL
npx drizzle-kit introspect:mysql  # MySQL
npx drizzle-kit introspect:sqlite  # SQLite
```

### Known Issues

- **Bun v1.2.0**: Concurrent statement execution issues with Bun SQL (track oven-sh/bun#16774)
- **Cloudflare D1**: Migrations must be applied from within Workers, not locally; use `ctx.blockConcurrencyWhile()` for Durable Objects
- **Turso/Neon**: HTTP drivers faster for single queries; WebSocket drivers support sessions and transactions

### Multi-Tenant Patterns

Nile guides show tenant-aware schema patterns with `tenant_id` columns and built-in tenants table for multi-tenant applications.

### React Native Support

Expo SQLite and OP-SQLite guides include metro/babel configuration and `useMigrations` hook for applying migrations in React Native apps.