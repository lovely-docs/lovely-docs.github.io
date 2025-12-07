**New:** Custom schema support for Postgres enums via `pgSchema('name').enum()`.

**Fixes:** D1 migrate() now uses batch API; `.onConflictDoUpdate` split into `setWhere`/`targetWhere`; `.onConflictDoNothing` where clause placement fixed; AWS Data API array handling fixed.