## Xata HTTP Driver Support

Xata is a Postgres data platform focused on reliability, scalability, and developer experience. Drizzle ORM v0.30.4 adds native support for the Xata driver via the `drizzle-orm/xata` package. The Xata Postgres service is currently in beta.

### Installation

```
npm install drizzle-orm @xata.io/client
npm install -D drizzle-kit
```

### Usage with Xata Client

Use the Xata generated client obtained by running `xata init` CLI command:

```ts
import { drizzle } from 'drizzle-orm/xata-http';
import { getXataClient } from './xata';

const xata = getXataClient();
const db = drizzle(xata);
const result = await db.select().from(...);
```

### Alternative Drivers

You can also connect to Xata using standard `pg` or `postgres.js` drivers instead of the native Xata driver.