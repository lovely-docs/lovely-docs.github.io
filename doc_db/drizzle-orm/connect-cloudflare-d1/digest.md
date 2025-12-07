## Cloudflare D1 Integration

D1 is Cloudflare's queryable relational database. Drizzle ORM fully supports D1 and Cloudflare Workers environment with SQLite-like query methods (`all`, `get`, `values`, `run`).

### Installation
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Configuration
Create `wrangler.json` or `wrangler.toml` with D1 database binding:

**wrangler.json:**
```json
{
    "name": "YOUR_PROJECT_NAME",
    "main": "src/index.ts",
    "compatibility_date": "2024-09-26",
    "compatibility_flags": ["nodejs_compat"],
    "d1_databases": [{
        "binding": "BINDING_NAME",
        "database_name": "YOUR_DB_NAME",
        "database_id": "YOUR_DB_ID",
        "migrations_dir": "drizzle/migrations"
    }]
}
```

**wrangler.toml:**
```toml
name = "YOUR_PROJECT_NAME"
main = "src/index.ts"
compatibility_date = "2022-11-07"
node_compat = true

[[ d1_databases ]]
binding = "BINDING_NAME"
database_name = "YOUR_DB_NAME"
database_id = "YOUR_DB_ID"
migrations_dir = "drizzle/migrations"
```

### Usage
```typescript
import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
    const result = await db.select().from(users).all();
    return Response.json(result);
  },
};
```

Initialize driver with `drizzle(env.<BINDING_NAME>)` and use standard Drizzle query syntax.