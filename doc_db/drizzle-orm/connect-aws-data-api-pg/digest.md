## AWS Data API Postgres Connection

Connect Drizzle ORM to AWS RDS Aurora PostgreSQL using AWS Data API.

**Prerequisites:**
- Database connection basics with Drizzle
- AWS Data API (Aurora RDS)
- AWS SDK v3

**Installation:**
```
npm install drizzle-orm @aws-sdk/client-rds-data
npm install -D drizzle-kit
```

**Setup - Option 1 (Auto-create client):**
```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';

const db = drizzle({ 
  connection: {
    database: process.env['DATABASE']!,
    secretArn: process.env['SECRET_ARN']!,
    resourceArn: process.env['RESOURCE_ARN']!,
  }
});

await db.select().from(...);
```

**Setup - Option 2 (Provide existing RDSDataClient):**
```typescript
import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { RDSDataClient } from '@aws-sdk/client-rds-data';

const rdsClient = new RDSDataClient({ region: 'us-east-1' });

const db = drizzle(rdsClient, {
  database: process.env['DATABASE']!,
  secretArn: process.env['SECRET_ARN']!,
  resourceArn: process.env['RESOURCE_ARN']!,
});

await db.select().from(...);
```

Three required connection properties: `database`, `secretArn`, `resourceArn`. Additional RDSDataClient properties can be specified in the connection object.