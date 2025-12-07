## Seeding with Partially Exposed Foreign Keys

When seeding a table with a foreign key constraint but the referenced table is not exposed to `seed()`:

- **Not-null FK**: Error thrown. Solutions: remove not-null constraint, expose referenced table, or refine the column generator.
- **Nullable FK**: Warning issued, column filled with nulls. Solutions: expose referenced table or refine the column generator.

Refining example (requires referenced table to have existing data):
```ts
await seed(db, { bloodPressure }).refine((funcs) => ({
  bloodPressure: {
    columns: {
      userId: funcs.valuesFromArray({ values: [1, 2] })
    }
  }
}));
```
