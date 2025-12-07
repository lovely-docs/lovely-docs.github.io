## Setup
```ts
import { upstashCache } from "drizzle-orm/cache/upstash";
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({ url: "", token: "", global: true, config: { ex: 60 } })
});
```

## Usage
- **`global: false` (default):** Use `.$withCache()` to opt-in per query
  - `.$withCache({ config: { ex: 60 } })` - custom TTL
  - `.$withCache({ tag: 'key' })` - custom cache key
  - `.$withCache({ autoInvalidate: false })` - eventual consistency
- **`global: true`:** All queries cached by default, use `.$withCache(false)` to disable
- **Manual invalidation:** `db.$cache.invalidate({ tables: users })` or `{ tags: "key" }`

## Custom Cache
Extend `Cache` class with `strategy()`, `get(key)`, `put(key, response, tables, config)`, and `onMutate(params)` methods.

## Limitations
No support for: raw queries, batch operations, transactions, relational queries, better-sqlite3/Durable Objects/expo sqlite, AWS Data API, views