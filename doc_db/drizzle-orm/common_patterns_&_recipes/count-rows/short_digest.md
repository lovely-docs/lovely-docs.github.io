## Count Rows

Count all rows with `count()`:
```ts
await db.select({ count: count() }).from(products);
// or with sql: sql`count(*)`.mapWith(Number)
```

Count non-NULL column values:
```ts
await db.select({ count: count(products.discount) }).from(products);
```

PostgreSQL/MySQL require casting to integer (SQLite returns integer natively):
```ts
sql<number>`cast(count(*) as integer)` // PostgreSQL/MySQL
sql<number>`count(*)` // SQLite
```

With conditions, joins, and grouping:
```ts
await db
  .select({ country: countries.name, citiesCount: count(cities.id) })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .where(gt(products.price, 100))
  .groupBy(countries.id);
```

Note: `sql<number>` declares expected type only; use `.mapWith()` for runtime transformations.