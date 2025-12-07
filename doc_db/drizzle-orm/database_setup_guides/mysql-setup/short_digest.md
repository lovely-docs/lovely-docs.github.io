## MySQL Setup with Drizzle

1. Install `mysql2` package
2. Set `DATABASE_URL` environment variable with MySQL connection string
3. Connect using `drizzle-orm/mysql2` package
4. Define schema, create config file with `dialect: 'mysql'`
5. Run migrations and execute queries with TypeScript/tsx

Prerequisites: dotenv, tsx, mysql2