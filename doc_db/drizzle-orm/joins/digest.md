## Join Types

Drizzle ORM supports: `INNER JOIN [LATERAL]`, `FULL JOIN`, `LEFT JOIN [LATERAL]`, `RIGHT JOIN`, `CROSS JOIN [LATERAL]`.

### Left Join
```typescript
const result = await db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...}, pets: {...} | null }[]
```

### Left Join Lateral
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).leftJoinLateral(subquery, sql`true`)
// Result: { user: {...}, userPets: {...} | null }[]
```

### Right Join
```typescript
const result = await db.select().from(users).rightJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...} | null, pets: {...} }[]
```

### Inner Join
```typescript
const result = await db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...}, pets: {...} }[]
```

### Inner Join Lateral
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).innerJoinLateral(subquery, sql`true`)
// Result: { user: {...}, userPets: {...} }[]
```

### Full Join
```typescript
const result = await db.select().from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// Result: { user: {...} | null, pets: {...} | null }[]
```

### Cross Join
```typescript
const result = await db.select().from(users).crossJoin(pets)
// Result: { user: {...}, pets: {...} }[]
```

### Cross Join Lateral
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
const result = await db.select().from(users).crossJoinLateral(subquery)
// Result: { user: {...}, userPets: {...} }[]
```

## Partial Select

Select specific fields to flatten response type:
```typescript
await db.select({
  userId: users.id,
  petId: pets.id,
}).from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number, petId: number | null }[]
```

When using `sql` operator with joins, explicitly type nullable fields:
```typescript
const result = await db.select({
  userId: users.id,
  petId: pets.id,
  petName1: sql`upper(${pets.name})`,
  petName2: sql<string | null>`upper(${pets.name})`,
}).from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number, petId: number | null, petName1: unknown, petName2: string | null }[]
```

Use nested select object syntax to make entire object nullable instead of individual fields:
```typescript
await db.select({
  userId: users.id,
  userName: users.name,
  pet: {
    id: pets.id,
    name: pets.name,
    upperName: sql<string>`upper(${pets.name})`
  }
}).from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// Result: { userId: number | null, userName: string | null, pet: {...} | null }[]
```

## Aliases & Self-joins

Use `alias()` for self-joins:
```typescript
import { alias } from 'drizzle-orm';
const parent = alias(user, "parent");
const result = db.select().from(user).leftJoin(parent, eq(parent.id, user.parentId))
// Result: { user: {...}, parent: {...} | null }[]
```

## Aggregating Results

Map join results to aggregate related data:
```typescript
type User = typeof users.$inferSelect;
type Pet = typeof pets.$inferSelect;

const rows = db.select({ user: users, pet: pets })
  .from(users).leftJoin(pets, eq(users.id, pets.ownerId)).all();

const result = rows.reduce<Record<number, { user: User; pets: Pet[] }>>(
  (acc, row) => {
    const user = row.user;
    const pet = row.pet;
    if (!acc[user.id]) acc[user.id] = { user, pets: [] };
    if (pet) acc[user.id].pets.push(pet);
    return acc;
  },
  {}
);
// Result: Record<number, { user: User; pets: Pet[] }>
```

## Many-to-One Example
```typescript
const cities = sqliteTable('cities', { id: integer('id').primaryKey(), name: text('name') });
const users = sqliteTable('users', { id: integer('id').primaryKey(), name: text('name'), cityId: integer('city_id').references(() => cities.id) });

const result = db.select().from(cities).leftJoin(users, eq(cities.id, users.cityId)).all();
```

## Many-to-Many Example
```typescript
const users = sqliteTable('users', { id: integer('id').primaryKey(), name: text('name') });
const chatGroups = sqliteTable('chat_groups', { id: integer('id').primaryKey(), name: text('name') });
const usersToChatGroups = sqliteTable('usersToChatGroups', { userId: integer('user_id').references(() => users.id), groupId: integer('group_id').references(() => chatGroups.id) });

db.select()
  .from(usersToChatGroups)
  .leftJoin(users, eq(usersToChatGroups.userId, users.id))
  .leftJoin(chatGroups, eq(usersToChatGroups.groupId, chatGroups.id))
  .where(eq(chatGroups.id, 1))
  .all();
```