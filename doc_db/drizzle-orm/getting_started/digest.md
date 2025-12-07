## Edge Functions Integration

Tutorials for integrating Drizzle ORM with serverless edge function platforms.

**Netlify Edge Functions:**
- With Neon: Install drizzle-orm, drizzle-kit, dotenv. Create `import_map.json` with ESM imports. Configure `netlify.toml` with deno_import_map. Define schema in `netlify/edge-functions/common/schema.ts` using pgTable. Create `drizzle.config.ts` with postgresql dialect. Run `npx drizzle-kit push`. Connect via: `const sql = neon(Netlify.env.get("DATABASE_URL")!); const db = drizzle({ client: sql });`. Deploy with `netlify init`, `netlify env:import .env`, `netlify deploy --prod`.
- With Supabase: Use postgres-js client instead. Connect via: `const queryClient = postgres(Netlify.env.get("DATABASE_URL")!); const db = drizzle({ client: queryClient });`.

**Supabase Edge Functions:**
- Prerequisites: Supabase CLI, Docker Desktop. Schema in `src/schema.ts` using pgTable. Initialize: `supabase init`, `npx drizzle-kit generate`, `supabase start`, `supabase migration up`. Create function: `supabase functions new function-name`. Add `deno.json` with imports. Connect via: `const client = postgres(Deno.env.get("SUPABASE_DB_URL")!); const db = drizzle({ client });`. Use `{ prepare: false }` for Transaction pool mode. Local test: `supabase functions serve --no-verify-jwt`. Deploy: `supabase link --project-ref=<ID>`, `supabase db push`, `supabase secrets set DATABASE_URL=<URL>`, `supabase functions deploy function-name --no-verify-jwt`.

**Vercel Edge Functions:**
Requires edge-compatible drivers (no TCP). Choose driver by database:
- Neon/Vercel Postgres: @neondatabase/serverless/@vercel/postgres
- PlanetScale MySQL: @planetscale/database
- Turso SQLite: @libsql/client

Neon/Vercel Postgres: Schema in `src/db/schema.ts` using pgTable. Generate migrations: `npx drizzle-kit generate`, `npx drizzle-kit migrate` (or `push` for prototyping). Connect in `src/db/index.ts`: `import { drizzle } from 'drizzle-orm/neon-serverless'; export const db = drizzle(process.env.POSTGRES_URL!)`. For Vercel Postgres: `import { drizzle } from 'drizzle-orm/vercel-postgres'; export const db = drizzle()`. API route in `src/app/api/route.ts` with `export const runtime = 'edge'` and `export const dynamic = 'force-dynamic'`. Deploy: `vercel`, `vercel env add POSTGRES_URL`, `vercel`.

PlanetScale MySQL: Schema using mysqlTable. Connect: `import { drizzle } from "drizzle-orm/planetscale-serverless"; export const db = drizzle(process.env.MYSQL_URL!)`.

Turso SQLite: Schema using sqliteTable. Connect: `import { drizzle } from 'drizzle-orm/libsql'; export const db = drizzle({ connection: { url: process.env.TURSO_CONNECTION_URL!, authToken: process.env.TURSO_AUTH_TOKEN! }})`.

## Database Integrations

Complete setup guides for various database providers.

**Neon Postgres (neon-http):**
Install drizzle-orm, drizzle-kit, @neondatabase/serverless, dotenv. Create `.env` with `DATABASE_URL`. Create `src/db.ts`:
```typescript
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

Define schema in `src/schema.ts` with pgTable, serial, text, integer, timestamp. Use `.references()` for foreign keys with `onDelete: 'cascade'`. Use `.$onUpdate(() => new Date())` for auto-updating timestamps. Infer types with `$inferInsert` and `$inferSelect`. Create `drizzle.config.ts` with dialect postgresql. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push` for prototyping.

Query examples: `db.insert(table).values(data)`, `db.select().from(table).where(eq(table.id, id))`, `db.update(table).set(data).where(eq(...))`, `db.delete(table).where(eq(...))`. Use `leftJoin()`, `groupBy()`, `count()`, `getTableColumns()` for aggregations and joins. Use `between()` and `sql` for date filtering.

**Nile Database (Multi-tenant):**
Install drizzle-orm, drizzle-kit, dotenv, node-postgres, express. Get connection string from Nile dashboard, add to `.env` as `NILEDB_URL`.

Create `src/db/db.ts`:
```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from "drizzle-orm";
import { AsyncLocalStorage } from "async_hooks";

export const db = drizzle(process.env.NILEDB_URL);
export const tenantContext = new AsyncLocalStorage<string | undefined>();

export function tenantDB<T>(cb: (tx: any) => T | Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    const tenantId = tenantContext.getStore();
    if (tenantId) {
      await tx.execute(sql`set local nile.tenant_id = '${sql.raw(tenantId)}'`);
    }
    return cb(tx);
  }) as Promise<T>;
}
```

Run `npx drizzle-kit pull` to introspect Nile's built-in tenants table. In Express, use middleware to extract tenant ID from URL and store in tenantContext: `app.use('/api/tenants/:tenantId/*', (req, res, next) => { tenantContext.run(req.params.tenantId, next); })`. Wrap all queries with `tenantDB()` to automatically set nile.tenant_id in transaction context—no explicit WHERE tenant_id needed. Nile handles data isolation at database level.

**Supabase (postgres-js):**
Install drizzle-orm, drizzle-kit, dotenv, postgres. Create Supabase project, get connection string with pooling enabled, add to `.env` as `DATABASE_URL`.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Schema and migrations same as Neon. Create `drizzle.config.ts` with dialect postgresql. Generate migrations with `npx drizzle-kit generate`, run with `npx drizzle-kit migrate`, or use Supabase CLI: `supabase init`, `supabase link`, `supabase db push`. Queries identical to Neon examples.

**Turso (SQLite via libSQL):**
Install drizzle-orm, drizzle-kit, dotenv, @libsql/client. Signup with `turso auth signup`, create database with `turso db create drizzle-turso-db`, create token with `turso db tokens create drizzle-turso-db`. Add to `.env`:
```
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=
```

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { config } from 'dotenv';

config({ path: '.env' });
export const db = drizzle({ connection: {
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
}});
```

Define schema with sqliteTable instead of pgTable. Use `integer('id').primaryKey()` instead of serial(). Use `text('created_at').default(sql`(CURRENT_TIMESTAMP)`)` for timestamps. Use `integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => new Date())` for auto-update. Create `drizzle.config.ts` with dialect turso. For date filtering, use `gt(postsTable.createdAt, sql`(datetime('now','-24 hour'))`)` instead of between().

**Vercel Postgres:**
Install drizzle-orm, drizzle-kit, dotenv, @vercel/postgres. Add `POSTGRES_URL` to `.env.local` from Vercel dashboard.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { config } from 'dotenv';

config({ path: '.env.local' });
export const db = drizzle();
```

Schema and migrations same as Neon/Supabase. Queries identical.

**Xata (PostgreSQL):**
Install drizzle-orm, drizzle-kit, dotenv, postgres. Create Xata database, get PostgreSQL connection string from dashboard, add to `.env` as `DATABASE_URL`.

Create `src/db/index.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

config({ path: '.env' });
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
```

Schema and migrations same as Supabase. Xata features: branch-based development for isolated environments, zero-downtime schema changes, data anonymization, AI-powered performance monitoring.

## Todo App with Neon Postgres

Complete Next.js todo app tutorial.

Install dependencies: drizzle-orm, drizzle-kit, @neondatabase/serverless, dotenv. Create `.env.local` with Neon connection string.

Create `src/db/drizzle.ts`:
```typescript
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: ".env" });
export const db = drizzle(process.env.DATABASE_URL!);
```

Create `src/db/schema.ts`:
```typescript
import { integer, text, boolean, pgTable } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
  id: integer("id").primaryKey(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
});
```

Create `drizzle.config.ts`:
```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Generate and run migrations: `npx drizzle-kit generate` then `npx drizzle-kit migrate`, or `npx drizzle-kit push`.

Create `src/actions/todoAction.ts` with "use server" directive:
```typescript
"use server";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { todo } from "@/db/schema";

export const getData = async () => {
  const data = await db.select().from(todo);
  return data;
};

export const addTodo = async (id: number, text: string) => {
  await db.insert(todo).values({ id, text });
};

export const deleteTodo = async (id: number) => {
  await db.delete(todo).where(eq(todo.id, id));
  revalidatePath("/");
};

export const toggleTodo = async (id: number) => {
  await db.update(todo).set({ done: not(todo.done) }).where(eq(todo.id, id));
  revalidatePath("/");
};

export const editTodo = async (id: number, text: string) => {
  await db.update(todo).set({ text }).where(eq(todo.id, id));
  revalidatePath("/");
};
```

Create `src/types/todoType.ts`:
```typescript
export type todoType = {
  id: number;
  text: string;
  done: boolean;
};
```

Create `src/components/todo.tsx` (client component with edit/delete/toggle functionality):
```typescript
"use client";
import { ChangeEvent, FC, useState } from "react";
import { todoType } from "@/types/todoType";

interface Props {
  todo: todoType;
  changeTodoText: (id: number, text: string) => void;
  toggleIsTodoDone: (id: number, done: boolean) => void;
  deleteTodoItem: (id: number) => void;
}

const Todo: FC<Props> = ({
  todo,
  changeTodoText,
  toggleIsTodoDone,
  deleteTodoItem,
}) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);
  const [isDone, setIsDone] = useState(todo.done);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleIsDone = async () => {
    toggleIsTodoDone(todo.id, !isDone);
    setIsDone((prev) => !prev);
  };

  const handleEdit = () => setEditing(true);

  const handleSave = async () => {
    changeTodoText(todo.id, text);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setText(todo.text);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this todo?")) {
      deleteTodoItem(todo.id);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-gray-200 border-solid border rounded-lg">
      <input
        type="checkbox"
        className="text-blue-200 rounded-sm h-4 w-4"
        checked={isDone}
        onChange={handleIsDone}
      />
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        readOnly={!editing}
        className={`${
          todo.done ? "line-through" : ""
        } outline-none read-only:border-transparent focus:border border-gray-200 rounded px-2 py-1 w-full`}
      />
      <div className="flex gap-1 ml-auto">
        {editing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-green-50 rounded px-2 w-14 py-1"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-400 text-blue-50 rounded w-14 px-2 py-1"
          >
            Edit
          </button>
        )}
        {editing ? (
          <button
            onClick={handleCancel}
            className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
          >
            Close
          </button>
        ) : (
          <button
            onClick={handleDelete}
            className="bg-red-400 w-16 text-red-50 rounded px-2 py-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Todo;
```

Create `src/components/addTodo.tsx`:
```typescript
"use client";
import { ChangeEvent, FC, useState } from "react";

interface Props {
  createTodo: (value: string) => void;
}

const AddTodo: FC<Props> = ({ createTodo }) => {
  const [input, setInput] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleAdd = async () => {
    createTodo(input);
    setInput("");
  };

  return (
    <div className="w-full flex gap-1 mt-2">
      <input
        type="text"
        className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
        onChange={handleInput}
        value={input}
      />
      <button
        className="flex items-center justify-center bg-green-600 text-green-50 rounded px-2 h-9 w-14 py-1"
        onClick={handleAdd}
      >
        Add
      </button>
    </div>
  );
};

export default AddTodo;
```

Create `src/components/todos.tsx`:
```typescript
"use client";
import { FC, useState } from "react";
import { todoType } from "@/types/todoType";
import Todo from "./todo";
import AddTodo from "./addTodo";
import { addTodo, deleteTodo, editTodo, toggleTodo } from "@/actions/todoAction";

interface Props {
  todos: todoType[];
}

const Todos: FC<Props> = ({ todos }) => {
  const [todoItems, setTodoItems] = useState<todoType[]>(todos);

  const createTodo = (text: string) => {
    const id = (todoItems.at(-1)?.id || 0) + 1;
    addTodo(id, text);
    setTodoItems((prev) => [...prev, { id, text, done: false }]);
  };

  const changeTodoText = (id: number, text: string) => {
    setTodoItems((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
    editTodo(id, text);
  };

  const toggleIsTodoDone = (id: number) => {
    setTodoItems((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
    toggleTodo(id);
  };

  const deleteTodoItem = (id: number) => {
    setTodoItems((prev) => prev.filter((todo) => todo.id !== id));
    deleteTodo(id);
  };

  return (
    <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
      <div className="text-5xl font-medium">To-do app</div>
      <div className="w-full flex flex-col mt-8 gap-2">
        {todoItems.map((todo) => (
          <Todo
            key={todo.id}
            todo={todo}
            changeTodoText={changeTodoText}
            toggleIsTodoDone={toggleIsTodoDone}
            deleteTodoItem={deleteTodoItem}
          />
        ))}
      </div>
      <AddTodo createTodo={createTodo} />
    </main>
  );
};

export default Todos;
```

Update `src/app/page.tsx`:
```typescript
import { getData } from "@/actions/todoAction";
import Todos from "@/components/todos";

export default async function Home() {
  const data = await getData();
  return <Todos todos={data} />;
}
```