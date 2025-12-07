## Overview
Open source TypeScript ORM with fully typed SQL schema in-code. Supports PostgreSQL with MySQL and SQLite coming soon.

## Schema Definition
Define tables as classes extending `PgTable` with typed columns:
```ts
export const popularityEnum = createEnum({ alias: 'popularity', values: ['unknown', 'known', 'popular'] });

export class CountriesTable extends PgTable<CountriesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  nameIndex = this.uniqueIndex(this.name)
  public tableName(): string { return 'countries'; }
}

export class CitiesTable extends PgTable<CitiesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  countryId = this.int("country_id").foreignKey(CountriesTable, (country) => country.id)
  popularity = this.type(popularityEnum, "popularity")
  public tableName(): string { return 'cities'; }
}
```

## Connection & Basic Queries
```ts
import { drizzle } from 'drizzle-orm'

export class UsersTable extends PgTable<UsersTable> {
  public id = this.serial('id').primaryKey();
  public fullName = this.text('full_name');
  public phone = this.varchar('phone', { size: 256 });
  public tableName(): string { return 'users'; }
}
export type User = InferType<UsersTable>

const db = await drizzle.connect("postgres://user:password@host:port/db");
const usersTable = new UsersTable(db);
const users: User[] = await usersTable.select().execute();
```

## Filtering & Selection
```ts
// WHERE with filters
await table.select().where(eq(table.id, 42)).execute();
await table.select().where(and([eq(table.id, 42), eq(table.name, "Dan")])).execute();
await table.select().where(or([eq(table.id, 42), eq(table.id, 1)])).execute();

// Partial select
const result = await table.select({
  mapped1: table.id,
  mapped2: table.name,
}).execute();

// Pagination & ordering
await table.select().limit(10).offset(10).execute()
await table.select().orderBy((table) => table.name, Order.ASC).execute()
await table.select().orderBy((table) => table.name, Order.DESC).execute()
```

## Insert, Update, Delete
```ts
await usersTable.insert({ name: "Andrew", createdAt: new Date() }).execute();
await usersTable.insertMany([
  { name: "Andrew", createdAt: new Date() },
  { name: "Dan", createdAt: new Date() }
]).execute();
await usersTable.update().where(eq(usersTable.name, 'Dan')).set({ name: 'Mr. Dan' }).execute();
await usersTable.delete().where(eq(usersTable.name, 'Dan')).execute();
```

## Joins
Fully typed joins prevent mistakes at compile time:
```ts
const result = await citiesTable.select()
  .leftJoin(usersTable, (cities, users) => eq(cities.userId, users.id))
  .where((cities, users) => eq(cities.id, 1))
  .execute();
const citiesWithUsers: { city: City, user: User }[] = result.map((city, user) => ({ city, user }));
```

## Many-to-Many Relationships
```ts
export class UsersTable extends PgTable<UsersTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name");
}
export class ChatGroupsTable extends PgTable<ChatGroupsTable> {
  id = this.serial("id").primaryKey();
}
export class ManyToManyTable extends PgTable<ManyToManyTable> {
  userId = this.int('user_id').foreignKey(UsersTable, (table) => table.id, { onDelete: 'CASCADE' });
  groupId = this.int('group_id').foreignKey(ChatGroupsTable, (table) => table.id, { onDelete: 'CASCADE' });
}

const usersWithUserGroups = await manyToManyTable.select()
  .leftJoin(usersTable, (manyToMany, users) => eq(manyToManyTable.userId, users.id))
  .leftJoin(chatGroupsTable, (manyToMany, _users, chatGroups) => eq(manyToManyTable.groupId, chatGroups.id))
  .where((manyToMany, _users, userGroups) => eq(userGroups.id, 1))
  .execute();
```

## Migrations
CLI tool generates migrations automatically from TypeScript schema, handling renames and deletes with prompts.

Schema:
```ts
export class UsersTable extends PgTable<UsersTable> {
  public id = this.serial("id").primaryKey();
  public fullName = this.varchar("full_name", { size: 256 });
  public fullNameIndex = this.index(this.fullName);
  public tableName(): string { return "users"; }
}
export class AuthOtpTable extends PgTable<AuthOtpTable> {
  public id = this.serial("id").primaryKey();
  public phone = this.varchar("phone", { size: 256 });
  public userId = this.int("user_id").foreignKey(UsersTable, (t) => t.id);
  public tableName(): string { return "auth_otp"; }
}
```

Generated SQL:
```sql
CREATE TABLE IF NOT EXISTS auth_otp (
    "id" SERIAL PRIMARY KEY,
    "phone" character varying(256),
    "user_id" INT
);
CREATE TABLE IF NOT EXISTS users (
    "id" SERIAL PRIMARY KEY,
    "full_name" character varying(256)
);
DO $$ BEGIN
 ALTER TABLE auth_otp ADD CONSTRAINT auth_otp_user_id_fkey FOREIGN KEY ("user_id") REFERENCES users(id);
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
CREATE INDEX IF NOT EXISTS users_full_name_index ON users (full_name);
```