## MySQL Setup

Install `drizzle-orm` and `mysql2`, then initialize:
```typescript
import { drizzle } from "drizzle-orm/mysql2";
const db = drizzle(process.env.DATABASE_URL);
// or with config: drizzle({ connection: { uri: ... } })
// or with existing connection: drizzle({ client: connection/pool })
```

Use single client connection for migrations, either client or pool for queries.