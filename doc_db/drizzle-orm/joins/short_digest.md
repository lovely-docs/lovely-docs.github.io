## Join Types
`leftJoin()`, `rightJoin()`, `innerJoin()`, `fullJoin()`, `crossJoin()` with optional `Lateral` variants. Lateral joins accept subqueries.

## Partial Select
Select specific fields to flatten response and control nullability:
```typescript
await db.select({ userId: users.id, petId: pets.id })
  .from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// { userId: number, petId: number | null }[]
```

Use nested objects to make entire object nullable instead of individual fields:
```typescript
await db.select({
  userId: users.id,
  pet: { id: pets.id, name: pets.name }
}).from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// { userId: number | null, pet: {...} | null }[]
```

With `sql` operator, explicitly type nullable fields: `sql<string | null>`

## Aliases & Self-joins
```typescript
const parent = alias(user, "parent");
db.select().from(user).leftJoin(parent, eq(parent.id, user.parentId))
```

## Aggregating Results
Use `.reduce()` to transform flat join results into nested structures.

## Many-to-One & Many-to-Many Examples
Standard patterns using multiple joins with foreign key references.