## Cloudflare Durable Objects SQLite Setup

Drizzle ORM fully supports Cloudflare Durable Objects SQLite databases in Cloudflare Workers environment.

### Prerequisites
- Database connection basics with Drizzle
- Cloudflare SQLite Durable Objects - SQLite database embedded within a Durable Object

### Installation
```
npm install drizzle-orm
npm install -D drizzle-kit
```

### Configuration

Create `wrangler.toml` with Durable Object bindings and migrations:
```toml
name = "sqlite-durable-objects"
main = "src/index.ts"
compatibility_date = "2024-11-12"
compatibility_flags = [ "nodejs_compat" ]

[[durable_objects.bindings]]
name = "MY_DURABLE_OBJECT"
class_name = "MyDurableObject"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyDurableObject"]

[[rules]] 
type = "Text"
globs = ["**/*.sql"]
fallthrough = true
```

### Usage

Initialize driver and create Durable Object class:
```typescript
import { drizzle, DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';
import { usersTable } from './db/schema';

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase<any>;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });

		ctx.blockConcurrencyWhile(async () => {
			await migrate(this.db, migrations);
		});
	}

	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
		return this.db.select().from(usersTable);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const id = env.MY_DURABLE_OBJECT.idFromName('durable-object');
		const stub = env.MY_DURABLE_OBJECT.get(id);

		const users = await stub.insertAndList({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});
		return Response.json(users);
	}
}
```

### Performance Notes
- Bundle all database interactions within a single Durable Object call for maximum performance
- Each individual query call is a round-trip to the Durable Object instance
- Run migrations during initialization with `blockConcurrencyWhile()` to prevent concurrent access before migrations complete