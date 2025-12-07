## Setup Drizzle with Cloudflare D1

Configure wrangler.toml with D1 database binding, connect via `drizzle(env.<BINDING_NAME>)`, create schema, setup drizzle.config.ts with D1-HTTP driver and Cloudflare credentials, apply migrations, then query with `db.select().from(table).all()`.

**Key config:**
```typescript
// drizzle.config.ts
defineConfig({
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});

// Usage
const db = drizzle(env.DB);
const result = await db.select().from(users).all();
```