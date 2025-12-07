## HTTP Proxy Driver

Drizzle Proxy allows implementing custom driver communication with databases. The HTTP proxy pattern sends queries from Drizzle ORM to an HTTP server, which executes them on the database and returns raw data for Drizzle to map.

### How It Works

1. Drizzle ORM builds a query
2. HTTP Proxy Driver sends the built query to an HTTP server
3. Server executes the query on the database
4. Server returns raw results back to the proxy
5. Drizzle maps the data and returns results

### Callback Function Pattern

Drizzle supports an async callback function for executing SQL:

```typescript
import { drizzle } from 'drizzle-orm/pg-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

**Parameters:**
- `sql`: Query string with placeholders
- `params`: Array of parameters
- `method`: One of `run`, `all`, `values`, or `get` depending on the SQL statement

**Return value:** Must be `{rows: string[][]}` or `{rows: string[]}` (use `string[]` when method is `get`)

### Server Implementation Example (PostgreSQL)

```ts
import { Client } from 'pg';
import express from 'express';

const app = express();
app.use(express.json());
const client = new Client('postgres://postgres:postgres@localhost:5432/postgres');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, ''); // prevent multiple queries

  try {
    const result = await client.query({
      text: sqlBody,
      values: params,
      rowMode: method === 'all' ? 'array': undefined,
    });
    res.send(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### MySQL Implementation

```ts
import * as mysql from 'mysql2/promise';
import express from 'express';

const app = express();
app.use(express.json());
const connection = await mysql.createConnection('mysql://root:mysql@127.0.0.1:5432/drizzle');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result = await connection.query({
      sql: sqlBody,
      values: params,
      rowsAsArray: method === 'all',
      typeCast: function(field: any, next: any) {
        if (field.type === 'TIMESTAMP' || field.type === 'DATETIME' || field.type === 'DATE') {
          return field.string();
        }
        return next();
      },
    });
    if (method === 'all') {
      res.send(result[0]);
    } else if (method === 'execute') {
      res.send(result);
    }
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### SQLite with Batch Support

```typescript
import { drizzle } from 'drizzle-orm/sqlite-proxy';

type ResponseType = { rows: any[][] | any[] }[];

const db = drizzle(
  async (sql, params, method) => {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  },
  async (queries: { sql: string, params: any[], method: 'all' | 'run' | 'get' | 'values'}[]) => {
    const result: ResponseType = await axios.post('http://localhost:3000/batch', { queries });
    return result;
  }
);
```

Batch response must be an array of raw values in the same order as sent queries.

### Table Declaration Example

```typescript
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

const users = sqliteTable('users', {
  id: text('id'),
  textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
  intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
});
```