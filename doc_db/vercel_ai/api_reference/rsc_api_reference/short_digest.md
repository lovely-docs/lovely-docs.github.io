**Server**: `streamUI()` streams LLM-generated React UI with tool support; `createStreamableUI/Value()` for component/data streaming; `getAIState/getMutableAIState()` for state access/updates.

**Client**: `useAIState/UIState()` hooks access shared state; `useActions()` calls server actions; `useStreamableValue/readStreamableValue()` consume streams.

**Setup**: `createAI()` provider wraps app with `{ actions, initialAIState, initialUIState, onSetAIState }`.

Full example: Server action calls `streamUI()` with tools that use `createStreamableUI()`, updates mutable AI state, returns to client which renders via `useUIState()` hook.