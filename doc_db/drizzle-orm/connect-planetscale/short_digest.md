## PlanetScale Integration

Serverless MySQL platform access via HTTP using `drizzle-orm/planetscale-serverless` package.

**Install:** `drizzle-orm @planetscale/database` and `drizzle-kit`

**Usage:**
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";

const db = drizzle({ connection: {
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
}});

// Or with existing client:
import { Client } from "@planetscale/database";
const client = new Client({ host, username, password });
const db = drizzle({ client });
```