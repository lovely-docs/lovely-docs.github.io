## HTTP Proxy Driver

Drizzle Proxy sends queries to an HTTP server which executes them on the database and returns raw data.

**Callback pattern:**
```typescript
import { drizzle } from 'drizzle-orm/pg-proxy';

const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
  return { rows: rows.data };
});
```

**Server (PostgreSQL):**
```ts
app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const result = await client.query({
    text: sql.replace(/;/g, ''),
    values: params,
    rowMode: method === 'all' ? 'array': undefined,
  });
  res.send(result.rows);
});
```

**MySQL:** Similar pattern with `mysql2/promise` connection and `rowsAsArray: method === 'all'`.

**SQLite:** Supports batch queries with a second callback for `db.batch([])` that posts to `/batch` endpoint. Batch response must be array of raw values in same order as queries.