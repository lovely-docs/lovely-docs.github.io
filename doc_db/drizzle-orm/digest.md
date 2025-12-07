This is the complete Drizzle ORM documentation covering all aspects of the library. It includes:

**Core Concepts**: Drizzle is a headless TypeScript ORM with SQL-like and relational query APIs, zero dependencies, and serverless-ready design. It supports PostgreSQL, MySQL, SQLite, and SingleStore.

**Schema Definition**: Define tables using dialect-specific functions (pgTable, mysqlTable, sqliteTable) with typed columns. Supports constraints (NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, DEFAULT), indexes, and relations. PostgreSQL supports schemas via pgSchema, MySQL schemas are databases, SQLite has no schemas.

**Column Types**: Comprehensive type system across all databases including numeric (int, serial, bigint, decimal, real), string (text, varchar, char), boolean, date/time (date, timestamp, time), JSON, arrays (PostgreSQL), and specialized types (UUID, point, geometry, vector, enum). Supports type inference with `.$type<T>()` and runtime defaults via `.$defaultFn()` and `.$onUpdate()`.

**Query APIs**: Two approaches - SQL-like syntax mirroring SQL (select/insert/update/delete with joins, filters, aggregations) and Relational Queries API for nested data fetching. Both are type-safe and generate exactly one SQL statement.

**Filtering & Operators**: Comparison (eq, ne, gt, gte, lt, lte), existence (exists, notExists), null checks (isNull, isNotNull), arrays (inArray, notInArray), ranges (between, notBetween), patterns (like, ilike), logical (not, and, or), and PostgreSQL-specific array operators (arrayContains, arrayContained, arrayOverlaps).

**Advanced Queries**: CTEs (WITH clauses), subqueries, aggregations (count, sum, avg, max, min with distinct variants), pagination (limit/offset and cursor-based), joins (left/right/inner/full/cross with lateral variants), set operations (UNION, INTERSECT, EXCEPT with ALL variants), and full-text search (PostgreSQL with tsvector/tsquery, weighted multi-column search, ranking).

**Mutations**: Insert (single/multiple rows, returning, $returningId for MySQL/SingleStore, onConflict/onDuplicate for upserts), update (with set, where, limit, orderBy, returning, FROM joins), delete (with where, limit, orderBy, returning). All support WITH clauses.

**Relationships**: Define one-to-one, one-to-many, and many-to-many relations using one() and many() operators. Relations are application-level abstractions independent from database foreign keys. Foreign key actions (CASCADE, RESTRICT, NO ACTION, SET NULL, SET DEFAULT) control delete/update behavior.

**Database Setup**: Comprehensive guides for 30+ platforms including PostgreSQL (node-postgres, postgres.js), MySQL (mysql2), SQLite (libsql, better-sqlite3, bun:sqlite, expo-sqlite, op-sqlite), serverless options (Neon, Supabase, Vercel Postgres, PlanetScale, Turso, Cloudflare D1), edge functions (Netlify, Supabase, Vercel), and specialized platforms (Xata, Nile, TiDB, PGLite, Prisma Postgres).

**Drizzle Kit**: CLI tool for migrations with commands: generate (create SQL from schema changes), migrate (apply migrations), push (sync schema directly), pull (introspect existing database), studio (local database browser), check (validate migration history), up (upgrade snapshots), export (output DDL). Configured via drizzle.config.ts with dialect, schema paths, database credentials, and optional filters.

**Migrations**: Six strategies - database-first (pull), codebase-first with direct push, SQL file generation with CLI/runtime application, manual application, or export for external tools. Supports custom migration names, empty migrations for manual SQL, and custom migrations table/schema configuration.

**Advanced Features**: 
- Prepared statements for performance with placeholders
- Transactions with nested savepoints, rollback conditions, and dialect-specific isolation levels
- Read replicas with automatic routing via withReplicas()
- Row-Level Security (PostgreSQL) with policies, roles, and provider support (Neon, Supabase)
- Batch API for LibSQL, Neon, D1 (multiple statements in single call)
- Query caching with Upstash Redis or custom implementation
- Dynamic query building with .$dynamic() for reusable functions
- Sequences (PostgreSQL) for auto-incrementing IDs
- Generated columns (PostgreSQL STORED, MySQL/SQLite STORED/VIRTUAL)
- Views (inline/standalone/raw SQL, materialized views for PostgreSQL)
- Custom types via customType() with toDriver/fromDriver mapping
- HTTP proxy driver for custom database communication
- Logging configuration with DefaultLogger or custom Logger
- Multi-project schema namespacing with pgTableCreator
- Type helpers (InferSelectModel, InferInsertModel, getTableColumns, getTableConfig)
- Mock driver for testing

**Validation Plugins**: Generate validation schemas from Drizzle tables:
- Zod (createSelectSchema, createInsertSchema, createUpdateSchema with refinements)
- Valibot (same API as Zod)
- Typebox (same API)
- Arktype (same API)
- All support field refinements and comprehensive type mappings

**Patterns & Recipes**: Conditional filtering, counting rows, column selection, parent-child queries, pagination (limit/offset and cursor-based), incrementing/decrementing, toggling booleans, bulk updates with CASE, upserts, full-text search, vector similarity search, geospatial queries (point distance, rectangular boundaries, PostGIS), timestamp defaults, empty array defaults, case-insensitive unique emails, seeding with related entities.

**Seeding**: drizzle-seed for deterministic fake data generation with seedable pRNG. 30+ generators (numeric, string, person, location, business, geometric) with options for uniqueness, ranges, arrays. Supports weighted distributions, related entity creation, and versioning for reproducible outputs.

**Ecosystem**: GraphQL schema generation (drizzle-graphql), Prisma extension for native Drizzle integration, ESLint plugin with enforce-delete-with-where and enforce-update-with-where rules.

**Migration Guides**: Step-by-step guides from Prisma, Sequelize, and TypeORM to Drizzle with query pattern replacements.

**Getting Started**: Quick start with PostgreSQL, edge function integration (Netlify, Supabase, Vercel), database provider guides (Neon, Supabase, Turso, Vercel Postgres, Xata, Nile), and complete Next.js todo app tutorial.

**Release Notes**: Evolution from v0.11.0 through v0.32.2 documenting feature additions including schema constraints, query building, drivers, timestamp handling, advanced features (pg_vector, PostGIS, prepared statements, batch API, caching, dynamic queries, sequences, generated columns).