## Versioning System

`drizzle-seed` uses versioning to maintain deterministic outputs while allowing access to new features. When you upgrade `drizzle-seed`, you can choose which version to use, ensuring existing seeded data remains unchanged if needed.

Specify version in seed call:
```ts
await seed(db, schema, { version: '2' });
```

## How It Works

Each generator has independent versions. When a generator changes, only that generator gets a new version number. You can mix generators from different versions:

| Generator | V1 | V2 | V3 (latest) |
|-----------|----|----|------------|
| LastNameGen | V1 | V2 | - |
| FirstNameGen | V1 | - | V3 |

Examples:
```ts
// Uses latest version of all generators
await seed(db, schema);

// Uses V2 of lastName, V1 of firstName
await seed(db, schema, { version: '2' });

// Uses V1 of all generators
await seed(db, schema, { version: '1' });
```

## Version History

| API Version | NPM Version | Changed Generators |
|-------------|-------------|-------------------|
| v1 | 0.1.1 | - |
| v2 (LTS) | 0.2.1 | `string()`, `interval({ isUnique: true })` |

## Version 2 Changes

### Unique `interval` Generator

**Problem**: Old version generated intervals like `1 minute 60 seconds` and `2 minutes 0 seconds` as distinct values. PostgreSQL normalizes `1 minute 60 seconds` to `2 minutes 0 seconds`, causing unique constraint violations.

**Affected if**: Table has unique `interval` column or using `f.interval({ isUnique: true })` in refine.

Example affected code:
```ts
const intervals = pgTable("intervals", {
    interval: interval().unique()
});

await seed(db, { intervals });
```

### `string` Generators (unique and non-unique)

**Improvement**: Now generates unique strings respecting column length constraints (e.g., `varchar(20)`).

**Affected if**: Table has text-like columns with length parameters or unique text columns, or using `f.string()` / `f.string({ isUnique: true })` in refine.

Example affected code:
```ts
const strings = pgTable("strings", {
    string1: char({ length: 256 }).unique(),
    string2: varchar({ length: 256 }),
    string3: text().unique(),
});

await seed(db, { strings });
```

Explicit usage in refine:
```ts
await seed(db, { strings }).refine((f) => ({
    strings: {
        columns: {
            string1: f.string({ isUnique: true }),
            string2: f.string(),
            string3: f.string({ isUnique: true }),
        }
    }
}));
```

Works across PostgreSQL, MySQL, and SQLite with appropriate column types for each database.