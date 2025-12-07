## Defining Custom Types

Custom types in Drizzle ORM are created using the `customType` function, which allows you to define database-specific data types with TypeScript type safety.

### Core Concept

The `customType` function accepts a generic type parameter with the following properties:
- `data`: The TypeScript type for the column (e.g., `string`, `number`, `Date`)
- `driverData`: (optional) The type the database driver uses internally
- `config`: (optional) Configuration object type for the data type definition
- `notNull`: (optional) Whether the type is not null by default
- `default`: (optional) Whether the type has a default value

### CustomTypeParams Interface

The function receives a configuration object with:
- `dataType(config?)`: Returns the SQL data type string (e.g., `'text'`, `'serial'`, `'varchar(256)'`)
- `toDriver(value)`: (optional) Maps TypeScript value to driver format
- `fromDriver(value)`: (optional) Maps driver value back to TypeScript format

### Postgres Examples

**Serial**
```typescript
import { customType } from 'drizzle-orm/pg-core';

const customSerial = customType<{ data: number; notNull: true; default: true }>({
  dataType() { return 'serial'; },
});
```

**Text**
```typescript
const customText = customType<{ data: string }>({
  dataType() { return 'text'; },
});
```

**Boolean**
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; },
});
```

**JSONB with generic type**
```typescript
const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'jsonb'; },
    toDriver(value: TData): string { return JSON.stringify(value); },
  })(name);
```

**Timestamp with config**
```typescript
const customTimestamp = customType<{
  data: Date;
  driverData: string;
  config: { withTimezone: boolean; precision?: number };
}>({
  dataType(config) {
    const precision = typeof config.precision !== 'undefined' ? ` (${config.precision})` : '';
    return `timestamp${precision}${config.withTimezone ? ' with time zone' : ''}`;
  },
  fromDriver(value: string): Date { return new Date(value); },
});
```

### MySQL Examples

**Int**
```typescript
import { customType } from 'drizzle-orm/mysql-core';

const customInt = customType<{ data: number; notNull: false; default: false }>({
  dataType() { return 'int'; },
});
```

**Text** (same as Postgres)

**Boolean with driver mapping**
```typescript
const customBoolean = customType<{ data: boolean }>({
  dataType() { return 'boolean'; },
  fromDriver(value) { return typeof value === 'boolean' ? value : value === 1; },
});
```

**JSON with generic type**
```typescript
const customJson = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() { return 'json'; },
    toDriver(value: TData): string { return JSON.stringify(value); },
  })(name);
```

**Timestamp with fsp config**
```typescript
const customTimestamp = customType<{
  data: Date;
  driverData: string;
  config: { fsp: number };
}>({
  dataType(config) {
    const precision = typeof config.fsp !== 'undefined' ? ` (${config.fsp})` : '';
    return `timestamp${precision}`;
  },
  fromDriver(value: string): Date { return new Date(value); },
});
```

### Usage in Table Definition

```typescript
// Postgres
const usersTable = pgTable('users', {
  id: customSerial('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJsonb<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { withTimezone: true }).notNull().default(sql`now()`),
});

// MySQL
const usersTable = mysqlTable('userstest', {
  id: customInt('id').primaryKey(),
  name: customText('name').notNull(),
  verified: customBoolean('verified').notNull().default(false),
  jsonb: customJson<string[]>('jsonb'),
  createdAt: customTimestamp('created_at', { fsp: 2 }).notNull().default(sql`now()`),
});
```

Custom types are used identically to built-in Drizzle ORM types once defined.