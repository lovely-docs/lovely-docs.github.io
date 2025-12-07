## Drizzle Kit Configuration

Define config in `drizzle.config.ts` using `defineConfig()`:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // mysql, sqlite, turso, singlestore
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: "postgres://user:password@host:port/db" },
});
```

**Key options:**
- `dialect`: Database type
- `schema`: Glob path to schema file(s)
- `out`: Migration output folder (default: `drizzle`)
- `driver`: Explicit driver selection (auto-detected from dialect)
- `dbCredentials`: Connection params (format varies by database)
- `migrations`: Log table/schema config (PostgreSQL)
- `introspect.casing`: Column casing for `pull` (`camel` or `preserve`)
- `tablesFilter`, `schemaFilter`, `extensionsFilters`: Filter what to manage
- `entities.roles`: Enable/configure role management with include/exclude/provider options
- `strict`: Confirm before `push` (default: false)
- `verbose`: Print SQL statements (default: true)
- `breakpoints`: Add statement breakpoints for MySQL/SQLite (default: true)

**Multiple configs:** Use `--config=file.ts` flag for different stages/databases.

**Connection examples:**
- PostgreSQL: `url` or `host/port/user/password/database/ssl`
- MySQL: `url` or `host/port/user/password/database/ssl`
- SQLite: `:memory:`, `sqlite.db`, or `file:sqlite.db`
- Turso: `url` + `authToken`
- D1: `driver: "d1-http"` + `accountId/databaseId/token`
- AWS Data API: `driver: "aws-data-api"` + `database/resourceArn/secretArn`
- PGLite: `driver: "pglite"` + folder `url`