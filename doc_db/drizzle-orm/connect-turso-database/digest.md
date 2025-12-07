## Turso Database Integration

Turso is a small database designed for the AI age. To connect Drizzle ORM to Turso:

**Installation:**
```
npm install drizzle-orm@beta @tursodatabase/database
npm install -D drizzle-kit@beta
```

**Basic usage - direct connection:**
```typescript
import { drizzle } from 'drizzle-orm/tursodatabase/database';
const db = drizzle('sqlite.db');
const result = await db.execute('select 1');
```

**Using existing driver instance:**
```typescript
import { Database } from '@tursodatabase/drivers';
import { drizzle } from 'drizzle-orm/tursodatabase/database';

const client = new Database('sqlite.db');
const db = drizzle({ client });
const result = await db.execute('select 1');
```

Prerequisites: familiarity with database connection basics in Drizzle, and knowledge of Turso Database and its JavaScript driver.