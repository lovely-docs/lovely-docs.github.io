**MySQL**: `$returningId()` retrieves inserted IDs from autoincrement or custom `$defaultFn()` primary keys.

**PostgreSQL**: `pgSequence()` defines sequences; `.generatedAlwaysAsIdentity()` replaces deprecated `serial`; `.generatedAlwaysAs()` creates generated columns with SQL expressions.

**MySQL/SQLite**: `.generatedAlwaysAs()` with `stored`/`virtual` modes; Kit limitations on modifying existing generated columns.

**Drizzle Kit**: Migrations support for sequences/identity/generated columns; `--force` flag auto-accepts data-loss; `migrations.prefix` customizes file naming (`index`, `supabase`, `unix`, `none`).