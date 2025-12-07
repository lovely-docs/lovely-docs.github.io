## Headless TypeScript ORM

Drizzle is a headless TypeScript ORM designed to let you build projects your way without forcing a specific structure. Unlike traditional data frameworks, Drizzle doesn't require building projects around it.

### Core Philosophy

**SQL-like API**: If you know SQL, you know Drizzle. The library embraces SQL rather than abstracting it away, eliminating the double learning curve of learning both SQL and a framework API.

**Relational Query API**: For common scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently. Drizzle always outputs exactly 1 SQL query, making it serverless-friendly.

### Key Features

- **Dual Query APIs**: Both SQL-like and relational query interfaces
- **Schema Definition**: Define and manage database schemas in TypeScript
- **Automatic Migrations**: Generate migrations from schema changes
- **Zero Dependencies**: 31KB slim library, serverless-ready by design
- **Multi-Database Support**: PostgreSQL, MySQL, SQLite, SingleStore with native driver support
- **Type-Safe**: Full TypeScript support

### Examples

Schema definition:
```typescript
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
});

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  countryId: integer('country_id').references(() => countries.id),
});
```

SQL-like query:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

Relational query:
```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

Generated migration:
```sql
CREATE TABLE IF NOT EXISTS "countries" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256)
);

CREATE TABLE IF NOT EXISTS "cities" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(256),
  "country_id" integer
);

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" 
FOREIGN KEY ("country_id") REFERENCES "countries"("id");
```