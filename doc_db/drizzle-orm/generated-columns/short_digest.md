## Generated Columns

Auto-computed database columns based on expressions. Two types: Virtual (computed on read) and Stored (computed on write, indexed).

**PostgreSQL** (STORED only): Use `.generatedAlwaysAs()` with string, `sql` tag, or callback:
```ts
text("gen_name").generatedAlwaysAs(sql`hello "world"!`)
text("gen_name").generatedAlwaysAs((): SQL => sql`hi, ${table.name}!`)
```

**MySQL** (STORED/VIRTUAL): Same API with optional `{ mode: "stored" | "virtual" }`:
```ts
text("stored_gen").generatedAlwaysAs(sql`${users.name} || 'hello'`, { mode: "stored" })
```

**SQLite** (STORED/VIRTUAL): Same as MySQL.

**Limitations**: PostgreSQL cannot modify expressions without schema changes. MySQL/SQLite `push` cannot change expressions (must drop/recreate). Requires drizzle-orm@0.32.0+, drizzle-kit@0.23.0+.