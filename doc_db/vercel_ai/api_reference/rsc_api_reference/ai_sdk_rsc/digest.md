AI SDK RSC is an experimental module for building AI applications using React Server Components. It provides utilities for streaming UI and state management between client and server.

**Core Functions:**

- `streamUI`: Helper function that streams React Server Components during tool execution, enabling dynamic UI updates based on AI operations.

- `createAI`: Creates a context provider that wraps your application, managing shared state between client and language model on the server.

- `createStreamableUI`: Creates a streamable UI component that renders on the server and streams to the client, allowing progressive UI rendering.

- `createStreamableValue`: Creates a streamable value that renders on the server and streams to the client, useful for streaming non-UI data.

**State Management:**

- `getAIState`: Read-only access to AI state on the server.

- `getMutableAIState`: Read and update AI state on the server, enabling state mutations during server-side operations.

- `useAIState`: Client-side hook to access AI state from the context provider.

- `useUIState`: Client-side hook to access UI state from the context provider.

**Client-Server Communication:**

- `useActions`: Enables calling server actions from the client, facilitating client-initiated server-side operations.

**Status:** Currently experimental. The documentation recommends using AI SDK UI for production applications, with a migration guide available for transitioning from RSC to UI.