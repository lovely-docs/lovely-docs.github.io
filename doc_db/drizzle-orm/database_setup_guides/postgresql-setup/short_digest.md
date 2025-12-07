## PostgreSQL Setup

Install node-postgres (`npm install pg @types/pg`), set `DATABASE_URL` env variable, connect Drizzle to database, define schema, create `drizzle.config.ts` with dialect 'postgresql', apply migrations, seed/query data, run with tsx.