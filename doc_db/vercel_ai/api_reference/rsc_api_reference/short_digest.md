## RSC API Reference

**Streaming:** `streamUI` (LLM-generated UI with tools), `createStreamableUI` (server-to-client UI), `createStreamableValue` (serializable values)

**State:** `createAI` (context provider), `getAIState()`/`getMutableAIState()` (server), `useAIState()`/`useUIState()` (client hooks)

**Consumption:** `readStreamableValue()` (async iterator), `useStreamableValue()` (hook with `[data, error, pending]`)

**Actions:** `useActions()` (access patched server actions)

**Message Types:** CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage with TextPart, ImagePart, FilePart, ToolCallPart, ToolResultPart

**Note:** Experimental; use AI SDK UI for production.