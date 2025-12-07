## Setup Drizzle with existing SingleStore database

**Prerequisites:** dotenv, tsx, mysql2

**Steps:**
1. Install mysql2
2. Set `DATABASE_URL` in .env
3. Create drizzle.config with dialect='singlestore'
4. Introspect database to generate schema
5. Move introspected schema to schema file
6. Connect to database with mysql2 driver
7. Query database
8. Run with tsx
9-11. (Optional) Update schema and apply changes