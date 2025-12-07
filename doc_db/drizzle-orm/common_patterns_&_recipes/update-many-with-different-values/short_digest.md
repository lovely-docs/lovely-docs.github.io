Update multiple rows with different values in one request using `sql` operator with `case` statement:

```ts
const sqlChunks: SQL[] = [sql`(case`];
for (const input of inputs) {
  sqlChunks.push(sql`when ${users.id} = ${input.id} then ${input.city}`);
  ids.push(input.id);
}
sqlChunks.push(sql`end)`);

const finalSql = sql.join(sqlChunks, sql.raw(' '));
await db.update(users).set({ city: finalSql }).where(inArray(users.id, ids));
```

Generates: `update users set "city" = (case when id = 1 then 'New York' ... end) where id in (...)`