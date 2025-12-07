## Setup
Install `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `dotenv`. Add `DATABASE_URL` to `.env.local`.

## Database
Create `src/db/drizzle.ts` with `drizzle(process.env.DATABASE_URL!)`. Define schema in `src/db/schema.ts` with todo table (id, text, done). Create `drizzle.config.ts` with schema path and PostgreSQL dialect. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate`.

## Server Actions
Create `src/actions/todoAction.ts` with "use server" functions: `getData()`, `addTodo(id, text)`, `deleteTodo(id)`, `toggleTodo(id)`, `editTodo(id, text)`. Use `db.select().from(todo)`, `db.insert(todo).values()`, `db.delete(todo).where(eq(todo.id, id))`, `db.update(todo).set().where()`. Call `revalidatePath("/")` after mutations.

## Components
Create `src/types/todoType.ts` with type definition. Build `Todo` component (client) with checkbox, editable text input, edit/save/delete buttons. Build `AddTodo` component with input and add button. Build `Todos` component (client) managing state, calling server actions, rendering todo list. Update `src/app/page.tsx` to fetch data and render `Todos`.