## Seeding with Partially Exposed Schema

When seeding a database with Drizzle Seed, you may encounter issues when a table has foreign key constraints but the referenced table is not exposed to the seed function.

### Problem Scenarios

**Scenario 1: Not-null foreign key without referenced table**

If you seed only the `bloodPressure` table but it has a not-null `userId` column referencing an unexposed `users` table:

```ts
import { bloodPressure } from './schema.ts';

async function main() {
  const db = drizzle(...);
  await seed(db, { bloodPressure });
}
```

With schema:
```ts
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
});

export const bloodPressure = pgTable("bloodPressure", {
	bloodPressureId: serial().primaryKey(),
	pressure: doublePrecision(),
	userId: integer().references(() => users.id).notNull(),
})
```

This throws an error: `Column 'userId' has not null constraint, and you didn't specify a table for foreign key on column 'userId' in 'bloodPressure' table.`

**Scenario 2: Nullable foreign key without referenced table**

If the `userId` column is nullable instead:
```ts
userId: integer().references(() => users.id),
```

A warning is issued: `Column 'userId' in 'bloodPressure' table will be filled with Null values because you specified neither a table for foreign key on column 'userId' nor a function for 'userId' column in refinements.`

### Solutions

1. **Remove the not-null constraint** from the foreign key column
2. **Expose the referenced table** to the seed function:
   ```ts
   await seed(db, { bloodPressure, users });
   ```
3. **Refine the column generator** to provide specific values (requires the referenced table to already have data in the database):
   ```ts
   await seed(db, { bloodPressure }).refine((funcs) => ({
     bloodPressure: {
       columns: {
         userId: funcs.valuesFromArray({ values: [1, 2] })
       }
     }
   }));
   ```
