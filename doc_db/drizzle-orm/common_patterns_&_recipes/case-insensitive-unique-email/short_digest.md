Create unique case-insensitive email indexes by wrapping the email column in a `lower()` function within `uniqueIndex()`. Implementation differs slightly per database:

**PostgreSQL & SQLite:**
```ts
export function lower(col: AnyPgColumn): SQL {
  return sql`lower(${col})`;
}

uniqueIndex('emailUniqueIndex').on(lower(table.email))
```

**MySQL (8.0.13+):**
```ts
export function lower(col: AnyMySqlColumn): SQL {
  return sql`(lower(${col}))`;  // parentheses required
}

uniqueIndex('emailUniqueIndex').on(lower(table.email))
```

Query with: `where(eq(lower(users.email), email.toLowerCase()))`