## createAI

Creates a client-server context provider for managing UI and AI states in your application tree.

**Status**: Experimental. AI SDK RSC is experimental; use AI SDK UI for production instead.

**Import**: `import { createAI } from "@ai-sdk/rsc"`

**Parameters**:
- `actions` (Record<string, Action>): Server-side actions callable from the client
- `initialAIState` (any): Initial AI state for the client
- `initialUIState` (any): Initial UI state for the client
- `onGetUIState` (() => UIState): Called during SSR to compare and update UI state
- `onSetAIState` ((Event) => void): Triggered when update() or done() is called by mutable AI state in your action, allowing you to persist AI state to database. Event contains:
  - `state` (AIState): The resulting AI state after the update
  - `done` (boolean): Whether AI state updates have been finalized

**Returns**: An `<AI/>` context provider component

**Use cases**: Manage AI and UI states in Next.js applications; persist and restore UI/AI states