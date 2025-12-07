## Setup Drizzle ORM with SQLite Durable Objects on Cloudflare Workers

**Prerequisites:**
- dotenv - environment variable management
- tsx - TypeScript file runner
- Cloudflare SQLite Durable Objects - embedded SQLite in Durable Objects
- wrangler - Cloudflare CLI

**Step 1: Install packages**
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit wrangler @cloudflare/workers-types
```

**Step 2: Configure wrangler.toml**
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

**Step 3: Connect Drizzle to database**
```ts
import { drizzle, type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { DurableObject } from 'cloudflare:workers'

export class MyDurableObject extends DurableObject {
	storage: DurableObjectStorage;
	db: DrizzleSqliteDODatabase;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.storage = ctx.storage;
		this.db = drizzle(this.storage, { logger: false });
	}
}
```

**Step 4: Generate wrangler types**
```bash
npx wrangler types
```
Outputs `worker-configuration.d.ts`.

**Step 5: Create table schema** (referenced from separate component)

**Step 6: Setup drizzle.config.ts**
```ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  driver: 'durable-sqlite',
});
```

**Step 7: Generate and apply migrations**
```bash
npx drizzle-kit generate
```

Add migration support to MyDurableObject:
```ts
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import migrations from '../drizzle/migrations';

export class MyDurableObject extends DurableObject {
	// ... previous code ...
	
	async migrate() {
		migrate(this.db, migrations);
	}
}
```

**Step 8: Complete example with queries**
```ts
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
			await this._migrate();
		});
	}

	async insertAndList(user: typeof usersTable.$inferInsert) {
		await this.insert(user);
		return this.select();
	}

	async insert(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
	}

	async select() {
		return this.db.select().from(usersTable);
	}

	async _migrate() {
		migrate(this.db, migrations);
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName('durable-object');
		const stub = env.MY_DURABLE_OBJECT.get(id);

		// Option A: Bundle all DB interactions in single DO call for performance
		const usersAll = await stub.insertAndList({
			name: 'John',
			age: 30,
			email: 'john@example.com',
		});
		console.log('New user created. All users: ', usersAll);

		// Option B: Individual queries (slower, each is a round-trip)
		await stub.insert({
			name: 'Jane',
			age: 28,
			email: 'jane@example.com',
		});
		const users = await stub.select();
		console.log('All users: ', users);

		return Response.json(users);
	}
}
```

**Key points:**
- Migrations must be applied from within Cloudflare Workers, not locally
- Use `ctx.blockConcurrencyWhile()` to ensure migrations complete before accepting queries
- Bundle multiple DB operations in single Durable Object call for performance (Option A)
- Individual query calls create round-trips to the DO instance (Option B)