## createAI

Creates a client-server context provider for managing UI and AI states.

**Parameters**: `actions` (server actions), `initialAIState`, `initialUIState`, `onGetUIState` (SSR callback), `onSetAIState` (persistence callback with `state` and `done` properties)

**Returns**: `<AI/>` context provider

**Note**: Experimental; use AI SDK UI for production