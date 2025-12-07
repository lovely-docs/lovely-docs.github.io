## TiDB Cloud Serverless Driver Support

Added support for TiDB Cloud Serverless driver in v0.31.2.

**Usage:**

```ts
import { connect } from '@tidbcloud/serverless';
import { drizzle } from 'drizzle-orm/tidb-serverless';

const client = connect({ url: '...' });
const db = drizzle(client);
await db.select().from(...);
```

Initialize a TiDB Cloud Serverless client with a connection URL, pass it to `drizzle()` from the `tidb-serverless` module, then use standard Drizzle ORM queries.