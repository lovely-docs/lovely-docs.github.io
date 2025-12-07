## drizzle-graphql

Generate a GraphQL server from a Drizzle schema with `buildSchema()`.

### Quick Start

Install: `drizzle-graphql @apollo/server graphql` or `drizzle-graphql graphql-yoga graphql`

**Apollo Server:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dbSchema from './schema';

const db = drizzle({ client, schema: dbSchema });
const { schema } = buildSchema(db);
const server = new ApolloServer({ schema });
const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
```

**GraphQL Yoga:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import * as dbSchema from './schema';

const db = drizzle({ schema: dbSchema });
const { schema } = buildSchema(db);
const yoga = createYoga({ schema });
const server = createServer(yoga);
server.listen(4000, () => console.info('Server is running on http://localhost:4000/graphql'));
```

**Schema example:**
```ts
import { integer, serial, text, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: integer('author_id').notNull(),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

### Customizing Schema

`buildSchema()` returns `{ schema, entities }`. Use `entities` to build a custom schema with selected queries/mutations and custom resolvers:

```ts
import { buildSchema } from 'drizzle-graphql';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

const db = drizzle({ schema: dbSchema });
const { entities } = buildSchema(db);

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: entities.queries.users,
      customer: entities.queries.customersSingle,
      customUsers: {
        type: new GraphQLList(new GraphQLNonNull(entities.types.UsersItem)),
        args: {
          where: { type: entities.inputs.UsersFilters }
        },
        resolve: async (source, args, context, info) => {
          // Custom logic
          return await db.select(schema.users).where()...
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: entities.mutations,
  }),
  types: [...Object.values(entities.types), ...Object.values(entities.inputs)],
});

const yoga = createYoga({ schema });
const server = createServer(yoga);
server.listen(4000, () => console.info('Server is running on http://localhost:4000/graphql'));
```

The output is standard GraphQL SDK compatible with any library supporting it. Reuse generated types and inputs in custom fields.