## getMutableAIState

Get a mutable copy of the AI state for server-side updates.

**Import:**
```
import { getMutableAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (optional, string): Returns the value of the specified key in the AI state if it's an object.

**Returns:** The mutable AI state object with the following methods:
- `update(newState: any)`: Updates the AI state with new state without finalizing.
- `done(newState: any)`: Updates the AI state with new state, marks it as finalized, and closes the stream.

**Use case:** Persist and restore AI and UI states in Next.js applications by updating the mutable state on the server side.

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production applications.