## Drizzle Seed

Generate deterministic fake data with seedable pRNG for reproducible testing.

**Setup:** `npm install drizzle-seed` (requires drizzle-orm@0.36.4+)

**Basic usage:**
```ts
const db = drizzle(process.env.DATABASE_URL!);
await seed(db, { users });  // 10 users by default
```

**Options:** `count` (default 10), `seed` (pRNG seed number)

**Reset database:** `await reset(db, schema)` - uses TRUNCATE CASCADE (PostgreSQL), TRUNCATE with FOREIGN_KEY_CHECKS (MySQL), or DELETE FROM with foreign_keys pragma (SQLite)

**Refinements** - customize via `.refine((f) => ({ table: { columns: {...}, count: N, with: {...} } }))`

**Generators:** `fullName()`, `firstName()`, `lastName()`, `companyName()`, `jobTitle()`, `streetAddress()`, `city()`, `postcode()`, `state()`, `country()`, `phoneNumber()`, `date()`, `int()`, `number()`, `loremIpsum()`, `valuesFromArray()`, `weightedRandom()`, `default()`

**Weighted random** for column values and related entity counts:
```ts
f.weightedRandom([
  { weight: 0.3, value: f.int({minValue: 10, maxValue: 100}) },
  { weight: 0.7, value: f.number({minValue: 100, maxValue: 300}) }
])
```

**Limitations:** `with` doesn't infer circular references (manual selection needed), one-to-many only, no type support for Drizzle table third parameter.
