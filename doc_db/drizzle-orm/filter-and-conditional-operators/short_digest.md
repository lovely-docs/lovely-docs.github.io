## Filter and Conditional Operators

Comparison: `eq`, `ne`, `gt`, `gte`, `lt`, `lte` - compare values or columns
```typescript
db.select().from(table).where(eq(table.column, 5)); // = 5
db.select().from(table).where(gt(table.column, 5)); // > 5
```

Existence: `exists`, `notExists` - check subquery results
```typescript
db.select().from(table).where(exists(db.select().from(table2)));
```

Null: `isNull`, `isNotNull` - check null values
```typescript
db.select().from(table).where(isNull(table.column));
```

Array: `inArray`, `notInArray` - check membership in array or subquery
```typescript
db.select().from(table).where(inArray(table.column, [1, 2, 3]));
```

Range: `between`, `notBetween` - check value range
```typescript
db.select().from(table).where(between(table.column, 2, 7));
```

String: `like`, `ilike` (PostgreSQL only), `notIlike` - pattern matching
```typescript
db.select().from(table).where(like(table.column, "%pattern%"));
```

Logical: `not`, `and`, `or` - combine conditions
```typescript
db.select().from(table).where(and(gt(table.column, 5), lt(table.column, 7)));
```

PostgreSQL arrays: `arrayContains`, `arrayContained`, `arrayOverlaps` - array element operations
```typescript
db.select().from(posts).where(arrayContains(posts.tags, ['Typescript', 'ORM']));
```