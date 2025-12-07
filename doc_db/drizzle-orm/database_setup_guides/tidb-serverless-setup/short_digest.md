## TiDB Serverless Setup

Install `@tidbcloud/serverless`, set `DATABASE_URL` env var, initialize Drizzle with the serverless driver, define schema, configure Drizzle config with `dialect: 'mysql'`, apply migrations, seed/query data, and run with tsx. Use this for HTTP-based connections; refer to MySQL guide for TCP.