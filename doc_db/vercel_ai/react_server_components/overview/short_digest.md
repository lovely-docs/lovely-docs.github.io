## AI SDK RSC

Experimental package for building AI applications with React Server Components, enabling LLMs to generate and stream UI from server to client.

**Key Functions:**
- `streamUI`: model responds with React Server Components
- `useUIState`/`useAIState`: manage UI and AI state (like `useState`)
- `useActions`: client access to Server Actions
- `createAI`: context provider for managing UI and AI states
- `createStreamableValue`/`createStreamableUI`: stream data/UI from server to client
- `readStreamableValue`/`useStreamableValue`: consume streamed values on client

Requires React Server Components support. Production use of AI SDK UI recommended instead.