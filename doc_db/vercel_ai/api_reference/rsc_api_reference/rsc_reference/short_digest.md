## AI SDK RSC (Experimental)

Reference for React Server Components integration. **Warning**: Experimental; use AI SDK UI for production.

**Server Functions**: `streamUI` (stream RSCs on tool execution), `createAI` (context provider for client-server state), `createStreamableUI` (server-rendered UI streamed to client), `createStreamableValue` (server-rendered data streamed to client), `getAIState` (read AI state), `getMutableAIState` (read/update AI state).

**Client Hooks**: `useAIState` (access AI state), `useUIState` (access UI state), `useActions` (call server actions).