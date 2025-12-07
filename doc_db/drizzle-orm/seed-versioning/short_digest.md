## Versioning

Specify version to maintain deterministic outputs while accessing new features:
```ts
await seed(db, schema, { version: '2' });
```

Generators have independent versions; mixing versions is supported.

## Version 2 Changes

**`interval({ isUnique: true })`**: Fixed normalization issue where `1 minute 60 seconds` and `2 minutes 0 seconds` were treated as distinct but normalized to same value in PostgreSQL.

**`string()` generators**: Now respect column length constraints for unique string generation (e.g., `varchar(20)`).

Affects tables with unique interval/text columns or explicit generator usage in `.refine()`.