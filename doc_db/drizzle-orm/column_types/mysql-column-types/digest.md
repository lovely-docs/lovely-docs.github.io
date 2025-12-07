## MySQL Column Types Reference

All MySQL column types are natively supported. Custom types can be created if needed.

**Note:** Examples use TypeScript keys as column names; database aliases and casing strategies are available via the `casing` parameter.

### Numeric Types

**Integer types:**
- `int()` - signed integer
- `tinyint()` - tiny signed integer
- `smallint()` - small signed integer
- `mediumint()` - medium signed integer
- `bigint({ mode: 'number' | 'bigint', unsigned: true })` - large integer with optional unsigned flag

**Floating point types:**
- `real()`, `real({ precision: 1, scale: 1 })` - real number with optional precision/scale
- `decimal()`, `decimal({ precision: 1, scale: 1, mode: 'number' | 'bigint' })` - decimal with precision/scale and mode
- `double()`, `double({ precision: 1, scale: 1 })` - double precision float
- `float()` - single precision float

**Special:**
- `serial()` - alias for `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`

### Binary Types

- `binary()` - fixed-length byte string, right-padded with `0x00` on insert
- `varbinary({ length: 2 })` - variable-length byte string

### String Types

- `char()` - fixed-length character string
- `varchar({ length: 2, enum: ["value1", "value2"] })` - variable-length string with optional enum for type inference (no runtime validation)
- `text({ enum: ["value1", "value2"] })` - text with optional enum for type inference

### Boolean & Date/Time Types

- `boolean()` - boolean value
- `date()` - date only
- `datetime()`, `datetime({ mode: 'date' | 'string', fsp: 0..6 })` - date and time with optional fractional seconds precision
- `time()`, `time({ fsp: 0..6 })` - time only with optional fractional seconds
- `year()` - year value
- `timestamp()`, `timestamp({ mode: 'date' | 'string', fsp: 0..6 })` - timestamp with optional `defaultNow()`

### JSON & Enum

- `json()`, `json().$type<{ foo: string }>()` - JSON with optional type inference
- `mysqlEnum(['unknown', 'known', 'popular'])` - enum type

### Column Modifiers

**Type customization:**
```typescript
int().$type<UserId>()  // branded types
json().$type<Data>()   // type inference
```

**Constraints:**
- `.notNull()` - NOT NULL constraint
- `.primaryKey()` - PRIMARY KEY constraint
- `.autoincrement()` - AUTO_INCREMENT

**Defaults:**
- `.default(3)` - static default value
- `.$defaultFn(() => createId())` - runtime default function (insert only)
- `.$onUpdate(() => null)` - runtime update function (called on update, or insert if no default)

Example combining modifiers:
```typescript
const table = mysqlTable('table', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  data: json().$type<{ foo: string }>(),
});
```