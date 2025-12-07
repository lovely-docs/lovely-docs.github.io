## Sequences

PostgreSQL sequences are special single-row tables that generate unique sequential identifiers, commonly used for auto-incrementing primary keys. They provide thread-safe value generation across multiple sessions.

### Key Features

**Creation and Initialization**
- Use `CREATE SEQUENCE` to create sequences with configurable parameters

**Manipulation Functions**
- `nextval('sequence_name')`: Advances sequence and returns next value
- `currval('sequence_name')`: Returns current value for current session
- `setval('sequence_name', value)`: Sets sequence's current value
- `lastval()`: Returns last value from nextval in current session

**Ownership**
- Link sequences to table columns using `OWNED BY` clause
- Dropping table/column automatically drops associated sequence

**Cycling**
- Sequences can cycle when reaching max/min values using `CYCLE` option
- Default is `NO CYCLE`

**Caching**
- Preallocate values using `CACHE` option for performance

### Limitations

- **Gaps**: Aborted transactions or crashes create gaps in sequence values
- **Concurrency**: Values may be out of order across sessions despite uniqueness
- **No Rollback**: Sequence changes aren't rolled back on transaction failure
- **Crash Recovery**: Unlogged sequences may not restore properly after crashes

### Usage

Default behavior: increment by 1, start at 1.

```ts
import { pgSchema, pgSequence } from "drizzle-orm/pg-core";

// No params
export const customSequence = pgSequence("name");

// With params
export const customSequence = pgSequence("name", {
  startWith: 100,
  maxValue: 10000,
  minValue: 100,
  cycle: true,
  cache: 10,
  increment: 2
});

// In custom schema
export const customSchema = pgSchema('custom_schema');
export const customSequence = customSchema.sequence("name");
```

### Requirements
- drizzle-orm@0.32.0 or higher
- drizzle-kit@0.23.0 or higher
- PostgreSQL only (not supported in SQLite, MySQL, SingleStore)