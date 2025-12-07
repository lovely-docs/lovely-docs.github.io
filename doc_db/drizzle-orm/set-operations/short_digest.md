## Set Operations

Six SQL set operations for combining query results:

- **UNION**: Combines results, removes duplicates
- **UNION ALL**: Combines results, keeps duplicates
- **INTERSECT**: Returns common rows, removes duplicates
- **INTERSECT ALL**: Returns common rows, keeps duplicates
- **EXCEPT**: Returns rows in first query but not second, removes duplicates
- **EXCEPT ALL**: Returns rows in first query but not second, keeps duplicates

Both function-based and method-based syntax:
```typescript
// Function-based
const result = await union(query1, query2);

// Method-based
const result = await query1.union(query2);
```

Support varies by database: PostgreSQL/MySQL/SQLite support all; SingleStore supports UNION/UNION ALL/INTERSECT/EXCEPT only (not *ALL variants for INTERSECT/EXCEPT).