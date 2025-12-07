## Constraints

**DEFAULT**: Specifies default value for a column if no value provided on INSERT. Can be a constant, expression, or NULL.
```typescript
integer('col').default(42)
integer('col').default(sql`'42'::integer`)
uuid('col').defaultRandom()
```

**NOT NULL**: Enforces column to not accept NULL values.
```typescript
integer('col').notNull()
```

**UNIQUE**: Ensures all values in column are different. Can be single or composite (multiple columns). Supports custom names and NULLS NOT DISTINCT (PostgreSQL 15+).
```typescript
integer('id').unique()
integer('id').unique('custom_name')
// Composite
pgTable('table', { id: integer('id'), name: text('name') }, (t) => [
  unique().on(t.id, t.name),
  unique('custom_name').on(t.id, t.name),
  unique().on(t.id).nullsNotDistinct() // PG 15+
])
```

**CHECK**: Limits value range for a column or based on multiple columns.
```typescript
pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  username: text().notNull(),
  age: integer(),
}, (table) => [
  check('age_check1', sql`${table.age} > 21`)
])
```

**PRIMARY KEY**: Uniquely identifies each record. Must be UNIQUE and NOT NULL. Only one per table, can be single or composite column.
```typescript
serial('id').primaryKey()
text('cuid').primaryKey()
// Composite
pgTable('books_to_authors', {
  authorId: integer('author_id'),
  bookId: integer('book_id'),
}, (table) => [
  primaryKey({ columns: [table.bookId, table.authorId] }),
  primaryKey({ name: 'custom_name', columns: [table.bookId, table.authorId] })
])
```

**FOREIGN KEY**: References PRIMARY KEY in another table. Prevents actions that destroy links between tables. Can be declared inline or standalone.
```typescript
// Inline
integer('author_id').references(() => user.id)

// Self-reference (requires explicit return type)
integer('parent_id').references((): AnyPgColumn => user.id)

// Standalone
pgTable('user', {
  id: serial('id'),
  name: text('name'),
  parentId: integer('parent_id'),
}, (table) => [
  foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: 'custom_fk'
  })
])

// Multicolumn
pgTable('profile', {
  id: serial('id'),
  userFirstName: text('user_first_name'),
  userLastName: text('user_last_name'),
}, (table) => [
  foreignKey({
    columns: [table.userFirstName, table.userLastName],
    foreignColumns: [user.firstName, user.lastName],
    name: 'custom_fk'
  })
])
```

## Indexes

Drizzle ORM supports `index()` and `uniqueIndex()` declarations.

**Basic usage**:
```typescript
pgTable('user', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
}, (table) => [
  index('name_idx').on(table.name),
  uniqueIndex('email_idx').on(table.email)
])
```

**PostgreSQL (0.31.0+)** supports advanced index API:
```typescript
// With .on()
index('name')
  .on(table.column1.asc(), table.column2.nullsFirst())
  .concurrently()
  .where(sql`condition`)
  .with({ fillfactor: '70' })

// With .using()
index('name')
  .using('btree', table.column1.asc(), sql`lower(${table.column2})`)
  .where(sql`condition`)
  .with({ fillfactor: '70' })
```

**MySQL** supports:
```typescript
index('name')
  .on(table.name)
  .algorythm('default' | 'copy' | 'inplace')
  .using('btree' | 'hash')
  .lock('none' | 'default' | 'exclusive' | 'shared')
```

**SQLite** supports:
```typescript
index('name')
  .on(table.name)
  .where(sql`condition`)
```

Supported across PostgreSQL, MySQL, SQLite, and SingleStore (with varying feature support).