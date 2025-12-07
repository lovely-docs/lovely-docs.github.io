## Xata HTTP Driver Support

Drizzle ORM v0.30.4 adds native support for Xata (a Postgres data platform) via `drizzle-orm/xata` package.

```ts
import { drizzle } from 'drizzle-orm/xata-http';
import { getXataClient } from './xata';

const db = drizzle(getXataClient());
const result = await db.select().from(...);
```

Alternatively, use standard `pg` or `postgres.js` drivers to connect to Xata.