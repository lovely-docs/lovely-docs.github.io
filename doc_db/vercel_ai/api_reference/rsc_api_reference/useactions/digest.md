Hook for accessing Server Actions from client components in RSC (React Server Components). Returns a dictionary of server actions that have been patched through context.

**Purpose**: Enables client-side access to server actions while avoiding "Cannot find Client Component" errors that occur when accessing server actions directly.

**Import**: `import { useActions } from "@ai-sdk/rsc"`

**Returns**: `Record<string, Action>` - a dictionary mapping action names to their corresponding server action functions.

**Key Detail**: Server actions must be accessed through this hook because they are patched when passed through context. Direct access bypasses this patching and causes errors.

**Use Cases**: Building interfaces that require user interactions with the server, managing AI and UI states in Next.js, routing React components using a language model.

**Status**: Currently experimental. Production use should prefer AI SDK UI instead, with migration guide available.