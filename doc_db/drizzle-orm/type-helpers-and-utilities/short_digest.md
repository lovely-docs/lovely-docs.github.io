**Type Inference**: Use `$inferSelect`, `$inferInsert`, or `InferSelectModel`/`InferInsertModel` helpers to extract types from table schemas.

**Logging**: Enable with `{ logger: true }` or implement custom `Logger`/`LogWriter` interfaces for custom destinations.

**Multi-project Schemas**: Use `pgTableCreator()`, `mysqlTableCreator()`, etc. with name prefixing function; filter in config with `tablesFilter`.

**SQL Generation**: Call `.toSQL()` on queries or use standalone `QueryBuilder` to generate SQL without a database instance.

**Raw SQL**: Execute parametrized queries with `db.execute(sql\`...\`)` (PostgreSQL/MySQL/SingleStore) or `db.all/get/values/run()` (SQLite).

**Utilities**: `getTableColumns()` for typed column maps, `getTableConfig()` for table metadata, `is()` for type checking instead of instanceof.

**Mock Driver**: Create test instances with `drizzle.mock()` optionally providing schema for types.