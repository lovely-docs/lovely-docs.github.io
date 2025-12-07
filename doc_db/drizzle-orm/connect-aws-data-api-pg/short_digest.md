## AWS Data API Postgres

Install `drizzle-orm` and `@aws-sdk/client-rds-data`. Initialize with `drizzle()` from `drizzle-orm/aws-data-api/pg`, providing `database`, `secretArn`, and `resourceArn` either directly or via an existing RDSDataClient instance.