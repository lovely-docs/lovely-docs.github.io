## Drizzle Seed

TypeScript library for generating deterministic, realistic fake data using a seedable pseudorandom number generator (pRNG). Same seed always produces identical data, enabling reproducible testing and debugging.

**Supported databases:** PostgreSQL, SQLite, MySQL (not SingleStore)

**Requirements:** drizzle-orm@0.36.4 or higher

### Installation
```
npm install drizzle-seed
```

### Basic Usage
```ts
import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { seed } from "drizzle-seed";

const users = pgTable("users", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

const db = drizzle(process.env.DATABASE_URL!);
await seed(db, { users });  // Creates 10 users by default
```

### Options

**`count`** - Number of entities to create (default: 10)
```ts
await seed(db, schema, { count: 1000 });
```

**`seed`** - Seed number for pRNG (different numbers generate different data)
```ts
await seed(db, schema, { seed: 12345 });
```

### Reset Database
```ts
import * as schema from "./schema.ts";
import { reset } from "drizzle-seed";

const db = drizzle(process.env.DATABASE_URL!);
await reset(db, schema);
```

Reset strategies by dialect:
- **PostgreSQL:** `TRUNCATE tableName1, tableName2, ... CASCADE;`
- **MySQL:** Disables `FOREIGN_KEY_CHECKS`, runs `TRUNCATE` per table, re-enables checks
- **SQLite:** Disables `foreign_keys` pragma, runs `DELETE FROM` per table, re-enables pragma

### Refinements

Use `.refine()` callback to customize generation behavior:

```ts
await seed(db, schema).refine((f) => ({
  users: {
    columns: { name: f.fullName() },
    count: 20
  }
}));
```

Refinement properties:
- **`columns`** - Override default generator for each column
- **`count`** - Rows to insert (overrides global count)
- **`with`** - Define related entities to create (one-to-many only)

**Example 1:** Seed users with custom name generation
```ts
await seed(db, { users: schema.users }).refine((f) => ({
  users: {
    columns: { name: f.fullName() },
    count: 20
  }
}));
```

**Example 2:** Seed users with 10 posts each
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 20,
    with: { posts: 10 }
  }
}));
```

**Example 3:** Custom int range and array values
```ts
await seed(db, schema).refine((f) => ({
  users: {
    count: 5,
    columns: {
      id: f.int({ minValue: 10000, maxValue: 20000, isUnique: true })
    }
  },
  posts: {
    count: 100,
    columns: {
      description: f.valuesFromArray({
        values: ["text1", "text2", "text3"]
      })
    }
  }
}));
```

### Weighted Random

Use weighted distributions for column values and related entity counts:

**Column values with weights:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    count: 5000,
    columns: {
      unitPrice: f.weightedRandom([
        { weight: 0.3, value: f.int({ minValue: 10, maxValue: 100 }) },
        { weight: 0.7, value: f.number({ minValue: 100, maxValue: 300, precision: 100 }) }
      ])
    }
  }
}));
```

**Related entity counts with weights:**
```ts
await seed(db, schema).refine((f) => ({
  orders: {
    with: {
      details: [
        { weight: 0.6, count: [1, 2, 3] },
        { weight: 0.3, count: [5, 6, 7] },
        { weight: 0.1, count: [8, 9, 10] }
      ]
    }
  }
}));
```

### Complex Example

Full e-commerce schema with 10,000 customers, 200 employees, 50,000 orders with weighted detail counts, 1,000 suppliers, 5,000 products with weighted pricing, and order details with weighted discounts. Uses generators: `companyName()`, `fullName()`, `jobTitle()`, `streetAddress()`, `city()`, `postcode()`, `state()`, `country()`, `phoneNumber()`, `date()`, `int()`, `number()`, `loremIpsum()`, `valuesFromArray()`, `weightedRandom()`, `default()`.

### Limitations

- **`with` type inference:** TypeScript cannot properly infer table references with circular dependencies. The `with` option displays all tables; manually select the one with one-to-many relationship.
- **`with` supports one-to-many only:** Can use `users with posts` but not `posts with users`.
- **Third parameter in Drizzle tables:** No type support (works at runtime only).
