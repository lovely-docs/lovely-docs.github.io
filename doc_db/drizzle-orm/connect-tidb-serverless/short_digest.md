## TiDB Serverless

Fully-managed DBaaS compatible with MySQL, with HTTP driver for edge environments.

**Install:** `drizzle-orm @tidbcloud/serverless` and `drizzle-kit`

**Setup:**
```typescript
import { drizzle } from 'drizzle-orm/tidb-serverless';
const db = drizzle({ connection: { url: process.env.TIDB_URL }});
```

Or with custom client:
```typescript
import { connect } from '@tidbcloud/serverless';
const client = connect({ url: process.env.TIDB_URL });
const db = drizzle({ client });
```