Cannot define inline `"use server"` in Client Components. Solutions: export from separate file with `"use server"` at top, pass from Server Component via props, or use `createAI`/`useActions` hooks.

Example: define `getAnswer()` in `actions.ts` with `'use server'` directive, then import into Client Component.