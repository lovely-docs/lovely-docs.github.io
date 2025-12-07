## SQLite Cloud Setup

Install `drizzle-orm@beta` and `@sqlitecloud/drivers`.

Initialize with connection string: `drizzle(process.env.SQLITE_CLOUD_CONNECTION_STRING)` or with client instance: `drizzle({ client: new Database(...) })`.

Execute queries: `db.execute('select 1')`