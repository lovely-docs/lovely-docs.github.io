## Update Multiple Rows with Different Values in Single Request

Update multiple rows with different values for each row using a single SQL request with `sql` operator and `case` statement.

**Approach:**
- Use `sql` operator to build a `case` statement dynamically
- Combine with `.update().set()` and `.where(inArray())` methods
- Supported on PostgreSQL, MySQL, and SQLite

**Example:**
```ts
import { SQL, inArray, sql } from 'drizzle-orm';
import { users } from './schema';

const inputs = [
  { id: 1, city: 'New York' },
  { id: 2, city: 'Los Angeles' },
  { id: 3, city: 'Chicago' },
];

if (inputs.length === 0) return;

const sqlChunks: SQL[] = [];
const ids: number[] = [];

sqlChunks.push(sql`(case`);

for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}

sqlChunks.push(sql`end)`);

const finalSql: SQL = sql.join(sqlChunks, sql.raw(' '));

await db.update(users).set({ city: finalSql }).where(inArray(users.id, ids));
```

**Generated SQL:**
```sql
update users set "city" = 
  (case when id = 1 then 'New York' when id = 2 then 'Los Angeles' when id = 3 then 'Chicago' end)
where id in (1, 2, 3)
```

**Key Points:**
- Ensure inputs array is not empty before executing
- Use `sql.join()` to combine SQL chunks with proper spacing
- Filter with `inArray()` to target only the rows being updated