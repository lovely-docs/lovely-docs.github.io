## SingleStore Integration

Drizzle ORM supports SingleStore databases through the `mysql2` driver via the `drizzle-orm/singlestore` package.

### Installation
```
npm install drizzle-orm mysql2
npm install -D drizzle-kit
```

### Driver Initialization

**Direct URI connection:**
```typescript
import { drizzle } from "drizzle-orm/singlestore";
const db = drizzle(process.env.DATABASE_URL);
```

**With connection config:**
```typescript
const db = drizzle({ connection: { uri: process.env.DATABASE_URL } });
```

**With existing mysql2 client connection:**
```typescript
import mysql from "mysql2/promise";
const connection = await mysql.createConnection({
  host: "host",
  user: "user",
  database: "database"
});
const db = drizzle({ client: connection });
```

**With existing mysql2 pool connection:**
```typescript
const poolConnection = mysql.createPool({
  host: "host",
  user: "user",
  database: "database"
});
const db = drizzle({ client: poolConnection });
```

Use single client connection for migrations with the built-in `migrate` function. Use either client or pool for queries based on requirements.

### Limitations

- Serial columns only ensure uniqueness, not auto-increment behavior
- `ORDER BY` and `LIMIT` cannot be chained
- Foreign keys not supported
- `INTERSECT ALL` and `EXCEPT ALL` operations not supported
- Nested transactions not supported
- Only one isolation level supported
- FSP option in `DATE`, `TIMESTAMP`, `DATETIME` not supported
- Relational API not supported (pending SingleStore API development)
- Additional MySQL incompatibilities may exist