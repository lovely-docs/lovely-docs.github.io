## Custom SQL Migrations

Drizzle Kit allows you to generate empty migration files for writing custom SQL migrations that handle DDL alterations not yet supported by Drizzle Kit, or for data seeding operations.

### Generating Custom Migrations

Use the `--custom` flag with the generate command:

```shell
drizzle-kit generate --custom --name=seed-users
```

This creates a new migration file in the `drizzle` directory with a sequential number prefix:

```plaintext
📦 <project root>
 ├ 📂 drizzle
 │ ├ 📂 _meta
 │ ├ 📜 0000_init.sql 
 │ └ 📜 0001_seed-users.sql 
 ├ 📂 src
 └ …
```

### Writing Custom SQL

Write your custom SQL directly in the generated migration file:

```sql
-- ./drizzle/0001_seed-users.sql
INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```

Custom migrations are executed using the `drizzle-kit migrate` command.

### Future: JavaScript and TypeScript Migrations

Support for running custom JavaScript and TypeScript migration/seeding scripts is planned for an upcoming release.