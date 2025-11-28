## AI SDK RSC

AI SDK RSC enables building AI applications using React Server Components (RSC), which render UI on the server and stream to the client. Combined with Server Actions, this allows LLMs to generate and stream UI directly from server to client with end-to-end type-safety.

### Core Functions

**Generative UI Abstractions:**
- `streamUI`: calls a model and receives React Server Components as response
- `useUIState`: manages UI state (visual representation), similar to React's `useState`
- `useAIState`: manages AI state (context, system messages, function responses shared with model), similar to React's `useState`
- `useActions`: provides client access to Server Actions for user interactions
- `createAI`: creates a client-server context provider to wrap application tree and manage both UI and AI states

**Streamable Values:**
- `createStreamableValue`: creates a stream sending serializable data from server to client
- `readStreamableValue`: reads a streamable value on client created via `createStreamableValue`
- `createStreamableUI`: creates a stream sending UI from server to client
- `useStreamableValue`: accepts a streamable value and returns current value, error, and pending state

### Compatibility

The `@ai-sdk/rsc` package requires frameworks that support React Server Components.

### Status

AI SDK RSC is experimental. AI SDK UI is recommended for production, with a migration guide available.