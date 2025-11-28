## RSC API Reference

**Core Streaming Functions:**
- `streamUI`: Streams LLM-generated React UI with tool support. Accepts model, system prompt, messages, generation parameters, tools, and callbacks. Returns ReactNode value and AsyncIterable stream of text-delta, tool-call, error, and finish events.
- `createStreamableUI`: Server-to-client UI streaming with `update()`, `append()`, and `done()` methods. Initial UI optional.
- `createStreamableValue`: Wraps serializable values for server-to-client streaming with `update()` method.

**State Management:**
- `createAI`: Context provider factory accepting server actions, initial AI/UI states, SSR callback (`onGetUIState`), and persistence callback (`onSetAIState`).
- `getAIState()`: Retrieves current AI state, optionally extracting a specific key.
- `getMutableAIState()`: Returns mutable AI state with `update()` and `done()` methods for server-side updates.
- `useAIState()`: Hook reading/updating globally-shared AI state under `<AI/>` provider. Returns `[state]`.
- `useUIState()`: Hook for client-side UI state management. Returns `[state, setState]` tuple.

**Client-Side Consumption:**
- `readStreamableValue()`: Async iterator for consuming server-streamed values. Usage: `for await (const value of readStreamableValue(stream)) { ... }`
- `useStreamableValue()`: Hook consuming streamable values. Returns `[data, error, pending]` tuple.

**Server Action Access:**
- `useActions()`: Hook accessing patched Server Actions from clients. Returns `Record<string, Action>` dictionary.

**Message Types:**
- CoreSystemMessage: `{ role: 'system', content: string }`
- CoreUserMessage: `{ role: 'user', content: string | Array<TextPart | ImagePart | FilePart> }`
- CoreAssistantMessage: `{ role: 'assistant', content: string | Array<TextPart | ToolCallPart> }`
- CoreToolMessage: `{ role: 'tool', content: Array<ToolResultPart> }`

**Tool Definition:**
```ts
{ description?: string, parameters: zod schema, generate?: (async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void> }
```

**Generation Parameters:** maxOutputTokens, temperature, topP, topK, presencePenalty, frequencyPenalty, stopSequences, seed

**Note:** AI SDK RSC is experimental. AI SDK UI recommended for production.