## Cloudflare D1 Setup

Install `drizzle-orm` and `drizzle-kit`. Configure D1 binding in `wrangler.json`/`wrangler.toml` with database name, ID, and migrations directory. Initialize with `drizzle(env.<BINDING_NAME>)` and use standard Drizzle queries:

```typescript
import { drizzle } from 'drizzle-orm/d1';

const db = drizzle(env.DB);
const result = await db.select().from(users).all();
```