## Cloudflare D1 HTTP API with Drizzle Kit

Configure Drizzle Kit to work with Cloudflare D1 using HTTP API instead of direct database connections.

### Prerequisites
- Drizzle Kit v0.21.3 or higher
- Drizzle Studio
- Drizzle Chrome Extension
- Cloudflare account with deployed D1 database
- API token with D1 edit permissions

### Configuration

Set up `drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

Key settings:
- `dialect: 'sqlite'` - D1 uses SQLite
- `driver: 'd1-http'` - Use HTTP API driver
- `dbCredentials` - Requires three environment variables

### Getting Credentials

1. **accountId**: Workers & Pages → Overview → copy Account ID from right sidebar
2. **databaseId**: Open your D1 database → copy Database ID
3. **token**: My profile → API Tokens → create new token with D1 edit permissions

### Supported Commands

After configuration, you can run: `migrate`, `push`, `introspect`, and `studio` commands via Cloudflare D1 HTTP API.

### Browser Access

Use the Drizzle Chrome Extension to browse and manage Cloudflare D1 databases directly in the Cloudflare admin panel.