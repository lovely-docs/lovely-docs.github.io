**createStreamableUI** streams React UI from server to client via Server Actions.

**Import:** `import { createStreamableUI } from "@ai-sdk/rsc"`

**Methods:** `update()` replaces UI, `append()` adds UI (prevents further updates), `done()` finalizes stream (required), `error()` signals errors to error boundary.

**Note:** Experimental; use AI SDK UI for production.