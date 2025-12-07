## Counting Rows

Use `count()` function to count all rows:
```ts
import { count } from 'drizzle-orm';
await db.select({ count: count() }).from(products);
// select count(*) from products;
```

Or with `sql` operator:
```ts
await db.select({ count: sql`count(*)`.mapWith(Number) }).from(products);
```

Result type: `{ count: number }[]`

## Count Non-NULL Values in a Column

```ts
await db.select({ count: count(products.discount) }).from(products);
// select count("discount") from products;
```

## Database-Specific Casting

PostgreSQL and MySQL return `count()` as bigint (interpreted as string), requiring explicit cast to integer:
```ts
const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};
await db.select({ count: customCount() }).from(products);
await db.select({ count: customCount(products.discount) }).from(products);
```

SQLite returns `count()` as integer natively:
```ts
await db.select({ count: sql<number>`count(*)` }).from(products);
await db.select({ count: sql<number>`count(${products.discount})` }).from(products);
```

## Type Specification Warning

When using `sql<number>`, you declare the expected type. Drizzle cannot perform runtime type casts—if the type generic is incorrect, the runtime value won't match. Use `.mapWith()` for runtime transformations.

## Conditional Counting

Use `.where()` to count rows matching a condition:
```ts
await db
  .select({ count: count() })
  .from(products)
  .where(gt(products.price, 100));
// select count(*) from products where price > 100
```

## Count with Joins and Aggregations

```ts
await db
  .select({
    country: countries.name,
    citiesCount: count(cities.id),
  })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id)
  .orderBy(countries.name);
// select countries.name, count("cities"."id") from countries
//   left join cities on countries.id = cities.country_id
//   group by countries.id
//   order by countries.name;
```