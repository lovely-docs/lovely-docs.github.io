## Headless ORM Philosophy
Drizzle is a headless TypeScript ORM - a library and collection of opt-in tools that lets you build projects with it, not around it. Unlike data frameworks (Django-like, Spring-like), Drizzle doesn't force your project structure.

## SQL-Like Query API
Drizzle embraces SQL at its core. If you know SQL, you know Drizzle - zero to minimal learning curve. It provides SQL schema declaration, SQL-like queries, automatic migrations, and a relational query API.

Example - SQL-like queries:
```typescript
await db
  .select()
  .from(countries)
  .leftJoin(cities, eq(cities.countryId, countries.id))
  .where(eq(countries.id, 10))
```

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

ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE no action ON UPDATE no action;
```

## Relational Query API
For common scenarios where SQL-like queries aren't optimal, Drizzle provides a Queries API for fetching nested relational data conveniently and performantly. Always outputs exactly 1 SQL query, making it serverless-database friendly.

```typescript
const result = await db.query.users.findMany({
  with: {
    posts: true
  },
});
```

## Serverless-Ready Design
Drizzle has zero dependencies. It's dialect-specific, slim, performant, and serverless-ready by design. Supports PostgreSQL, MySQL, and SQLite through industry-standard database drivers.

## Key Characteristics
- Lightweight, performant, typesafe
- Non-intrusive to project structure
- Both SQL-like and relational query APIs
- Zero dependencies
- Serverless-ready
- Full SQL dialect support