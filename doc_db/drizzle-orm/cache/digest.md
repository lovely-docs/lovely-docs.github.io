## Overview
Drizzle sends every query to the database by default with no automatic caching. Caching is opt-in using an `explicit` strategy (`global: false`) by default, or can be enabled globally with `global: true`.

## Upstash Integration

Quick setup with automatic environment variable configuration:
```ts
import { upstashCache } from "drizzle-orm/cache/upstash";
const db = drizzle(process.env.DB_URL!, { cache: upstashCache() });
```

With explicit credentials and options:
```ts
const db = drizzle(process.env.DB_URL!, {
  cache: upstashCache({
    url: '<UPSTASH_URL>',
    token: '<UPSTASH_TOKEN>',
    global: true,  // cache all queries by default
    config: { ex: 60 }  // 60 second TTL
  })
});
```

## Cache Config
```ts
type CacheConfig = {
  ex?: number;  // expiration in seconds
  hexOptions?: "NX" | "nx" | "XX" | "xx" | "GT" | "gt" | "LT" | "lt";  // HEXPIRE options
};
```

## Usage Examples

**With `global: false` (default, opt-in):**
```ts
const db = drizzle(process.env.DB_URL!, { cache: upstashCache({ url: "", token: "" }) });

// Won't use cache
const res = await db.select().from(users);

// Use cache with .$withCache()
const res = await db.select().from(users).$withCache();

// Options for .$withCache()
.$withCache({ config: { ex: 60 } })  // custom TTL
.$withCache({ tag: 'custom_key' })  // custom cache key
.$withCache({ autoInvalidate: false })  // disable auto-invalidation for eventual consistency

// Mutations still trigger cache invalidation
await db.insert(users).value({ email: "test@example.com" });
```

**With `global: true`:**
```ts
const db = drizzle(process.env.DB_URL!, { cache: upstashCache({ url: "", token: "", global: true }) });

// All queries use cache by default
const res = await db.select().from(users);

// Disable cache for specific query
const res = await db.select().from(users).$withCache(false);

// Manual invalidation
await db.$cache.invalidate({ tables: users });
await db.$cache.invalidate({ tables: [users, posts] });
await db.$cache.invalidate({ tables: "usersTable" });
await db.$cache.invalidate({ tags: "custom_key" });
```

## Custom Cache Implementation

Extend the `Cache` class with `strategy()`, `get()`, `put()`, and `onMutate()` methods:
```ts
import Keyv from "keyv";

export class TestGlobalCache extends Cache {
  private globalTtl: number = 1000;
  private usedTablesPerKey: Record<string, string[]> = {};

  constructor(private kv: Keyv = new Keyv()) {
    super();
  }

  override strategy(): "explicit" | "all" {
    return "all";  // or "explicit"
  }

  override async get(key: string): Promise<any[] | undefined> {
    return (await this.kv.get(key)) ?? undefined;
  }

  override async put(
    key: string,
    response: any,
    tables: string[],
    config?: CacheConfig,
  ): Promise<void> {
    const ttl = config?.px ?? (config?.ex ? config.ex * 1000 : this.globalTtl);
    await this.kv.set(key, response, ttl);
    for (const table of tables) {
      const keys = this.usedTablesPerKey[table];
      if (keys === undefined) {
        this.usedTablesPerKey[table] = [key];
      } else {
        keys.push(key);
      }
    }
  }

  override async onMutate(params: {
    tags: string | string[];
    tables: string | string[] | Table<any> | Table<any>[];
  }): Promise<void> {
    const tagsArray = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tablesArray = Array.isArray(params.tables) ? params.tables : params.tables ? [params.tables] : [];
    const keysToDelete = new Set<string>();

    for (const table of tablesArray) {
      const tableName = is(table, Table) ? getTableName(table) : (table as string);
      const keys = this.usedTablesPerKey[tableName] ?? [];
      for (const key of keys) keysToDelete.add(key);
    }

    for (const tag of tagsArray) {
      await this.kv.delete(tag);
    }
    for (const key of keysToDelete) {
      await this.kv.delete(key);
    }
  }
}

const db = drizzle(process.env.DB_URL!, { cache: new TestGlobalCache() });
```

## Limitations

**Not supported:**
- Raw queries: `db.execute(sql\`select 1\`)`
- Batch operations in d1 and libsql
- Transactions
- Relational queries: `db.query.users.findMany()`
- better-sqlite3, Durable Objects, expo sqlite
- AWS Data API drivers
- Views