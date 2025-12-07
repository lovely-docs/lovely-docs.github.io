## SQL-like Syntax
Standard SQL-like queries: `db.select().from(table).where()`, `db.insert().values()`, `db.update().set().where()`, `db.delete().where()`. Mirrors SQL exactly.

## Relational Queries API
Fetch nested data efficiently: `db.query.users.findMany({ with: { posts: true } })`. Always one SQL query, serverless-safe.

## Advanced Composition
Compose filters independently, separate subqueries into variables, build conditional queries dynamically.