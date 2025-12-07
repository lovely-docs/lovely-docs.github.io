## SingleStore Column Types

All native types supported: numeric (`int`, `bigint`, `decimal`, `float`, etc.), binary (`binary`, `varbinary`), string (`char`, `varchar`, `text`), boolean, date/time (`date`, `datetime`, `time`, `year`, `timestamp`), `json`, and `enum`.

**Examples**:
```typescript
import { int, varchar, json, singlestoreTable } from "drizzle-orm/singlestore-core";

const table = singlestoreTable('table', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 100 }),
  data: json().$type<{ foo: string }>(),
  created: timestamp().defaultNow(),
  status: varchar({ enum: ["active", "inactive"] })
});
```

**Column modifiers**: `.notNull()`, `.default(value)`, `.$defaultFn(fn)`, `.$onUpdate(fn)`, `.primaryKey()`, `.autoincrement()`, `.$type<T>()` for type inference.

**Special**: `serial()` = `BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE`; `enum` and `varchar`/`text` support `enum` config for type inference (no runtime check); `json` supports `.$type<T>()` for compile-time type safety.