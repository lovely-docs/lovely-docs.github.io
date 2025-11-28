AI SDK RSC (experimental) provides utilities for streaming React Server Components and managing client-server state:

**Streaming:** `streamUI` (streams RSCs on tool execution), `createStreamableUI` (progressive UI rendering), `createStreamableValue` (stream non-UI data)

**State:** `createAI` (context provider), `getAIState`/`getMutableAIState` (server), `useAIState`/`useUIState` (client)

**Communication:** `useActions` (call server actions from client)

Recommended to use AI SDK UI for production instead.