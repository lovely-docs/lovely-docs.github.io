## Setup Drizzle with SQLite Durable Objects

**Install:** `npm install drizzle-orm dotenv` and `-D drizzle-kit wrangler @cloudflare/workers-types`

**wrangler.toml:** Configure Durable Object binding, migrations, and SQL file rules.

**Connect:** Create MyDurableObject class extending DurableObject, initialize `this.db = drizzle(this.storage)`.

**Config:** Create drizzle.config.ts with dialect 'sqlite' and driver 'durable-sqlite'.

**Migrate:** Run `npx drizzle-kit generate`, then call `migrate(this.db, migrations)` in DO constructor with `ctx.blockConcurrencyWhile()`.

**Query example:**
```ts
export class MyDurableObject extends DurableObject {
	db: DrizzleSqliteDODatabase;
	
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
		this.db = drizzle(ctx.storage);
		ctx.blockConcurrencyWhile(async () => {
			await migrate(this.db, migrations);
		});
	}
	
	async insert(user: typeof usersTable.$inferInsert) {
		await this.db.insert(usersTable).values(user);
	}
	
	async select() {
		return this.db.select().from(usersTable);
	}
}

export default {
	async fetch(request: Request, env: Env) {
		const stub = env.MY_DURABLE_OBJECT.get(env.MY_DURABLE_OBJECT.idFromName('do'));
		await stub.insert({ name: 'John', age: 30, email: 'john@example.com' });
		return Response.json(await stub.select());
	}
}
```

Bundle multiple DB operations in single DO call for performance.