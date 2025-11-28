

## Pages

### streamui
RSC helper to stream LLM-generated React UI with tools, messages, generation parameters, and event callbacks; returns ReactNode UI and AsyncIterable stream of text/tool/error/finish events.

## streamUI

A helper function from AI SDK RSC that creates a streamable UI from LLM providers, supporting the same model interfaces as AI SDK Core APIs.

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; see migration guide for transitioning from RSC to UI.

### Import
```
import { streamUI } from "@ai-sdk/rsc"
```

### Parameters

**Core Configuration:**
- `model` (LanguageModel): The language model to use, e.g., `openai("gpt-4.1")`
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `prompt` (string): Input prompt to generate text from
- `initial` (ReactNode, optional): Initial UI to render

**Messages:**
- `messages` (Array): Conversation history supporting CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage, or UIMessage from useChat hook
  - CoreSystemMessage: `{ role: 'system', content: string }`
  - CoreUserMessage: `{ role: 'user', content: string | Array<TextPart | ImagePart | FilePart> }`
    - TextPart: `{ type: 'text', text: string }`
    - ImagePart: `{ type: 'image', image: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType?: string }`
    - FilePart: `{ type: 'file', data: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType: string }`
  - CoreAssistantMessage: `{ role: 'assistant', content: string | Array<TextPart | ToolCallPart> }`
    - ToolCallPart: `{ type: 'tool-call', toolCallId: string, toolName: string, args: object }`
  - CoreToolMessage: `{ role: 'tool', content: Array<ToolResultPart> }`
    - ToolResultPart: `{ type: 'tool-result', toolCallId: string, toolName: string, result: unknown, isError?: boolean }`

**Generation Parameters:**
- `maxOutputTokens` (number, optional): Maximum tokens to generate
- `temperature` (number, optional): Temperature setting (set either temperature or topP, not both)
- `topP` (number, optional): Nucleus sampling (set either temperature or topP, not both)
- `topK` (number, optional): Sample from top K options per token (advanced use only)
- `presencePenalty` (number, optional): Affects likelihood of repeating information in prompt
- `frequencyPenalty` (number, optional): Affects likelihood of repeating same words/phrases
- `stopSequences` (string[], optional): Sequences that stop generation
- `seed` (number, optional): Integer seed for deterministic results if supported

**Request Control:**
- `maxRetries` (number, optional): Maximum retries, default 2; set to 0 to disable
- `abortSignal` (AbortSignal, optional): Cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers

**Tools:**
- `tools` (ToolSet): Tools accessible to the model
  - Tool: `{ description?: string, parameters: zod schema, generate?: (async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void> }`
- `toolChoice` (optional): `"auto" | "none" | "required" | { "type": "tool", "toolName": string }` - specifies how tools are selected (default: "auto")

**Callbacks:**
- `text` ((Text) => ReactNode, optional): Callback for generated tokens with `{ content: string, delta: string, done: boolean }`
- `onFinish` ((OnFinishResult) => void, optional): Called when LLM response and tool executions finish
  - OnFinishResult: `{ usage: TokenUsage, value: ReactNode, warnings?: Warning[], response?: Response }`
  - TokenUsage: `{ promptTokens: number, completionTokens: number, totalTokens: number }`
  - Response: `{ headers?: Record<string, string> }`

**Provider:**
- `providerOptions` (Record<string, JSONObject>, optional): Provider-specific options

### Returns

- `value` (ReactNode): The user interface based on stream output
- `response` (Response, optional): Response data with optional headers
- `warnings` (Warning[], optional): Warnings from model provider
- `stream` (AsyncIterable<StreamPart> & ReadableStream<StreamPart>): Stream of all events
  - StreamPart types:
    - Text delta: `{ type: 'text-delta', textDelta: string }`
    - Tool call: `{ type: 'tool-call', toolCallId: string, toolName: string, args: object }`
    - Error: `{ type: 'error', error: Error }`
    - Finish: `{ type: 'finish', finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown', usage: TokenUsage }`

### Examples

- Render React components as function calls using language model in Next.js
- Persist and restore UI/AI states in Next.js
- Route React components using language model in Next.js
- Stream component updates to client in Next.js

### createai
Context provider factory for managing AI/UI states in RSC; accepts server actions, initial states, SSR callback, and persistence callback triggered on state updates

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

### createstreamableui
Server-to-client React UI streaming via `update()`, `append()`, `done()` (required), and `error()` methods; experimental RSC feature.

## Overview
`createStreamableUI` creates a stream that sends UI from the server to the client. The returned value can be rendered as a normal React node on the client side.

## Import
```
import { createStreamableUI } from "@ai-sdk/rsc"
```

## API

**Parameters:**
- `initialValue` (ReactNode, optional): The initial value of the streamable UI.

**Returns:**
- `value` (ReactNode): The streamable UI value that can be returned from a Server Action and received by the client.

**Methods:**
- `update(ReactNode)`: Replaces the current UI node with a new one. Previous node cannot be updated after appending.
- `append(ReactNode)`: Appends a new UI node to the end. Once appended, the previous UI node cannot be updated anymore.
- `done(ReactNode | null)`: Marks the UI as finalized and closes the stream. Required to be called, otherwise the response stays in loading state. After calling, UI cannot be updated or appended.
- `error(Error)`: Signals an error in the UI stream. Thrown on client side and caught by nearest error boundary.

## Note
AI SDK RSC is experimental. Use AI SDK UI for production instead.

### createstreamablevalue
Server-to-client streaming function for RSC that wraps serializable values in updatable streamable objects; experimental feature.

## createStreamableValue

Creates a stream that sends serializable values from the server to the client in RSC (React Server Components) applications.

### Import
```
import { createStreamableValue } from "@ai-sdk/rsc"
```

### Parameters
- `value` (any): Any serializable data supported by RSC, such as JSON objects.

### Returns
- `streamable`: A special value object that can be returned from Server Actions to the client. It holds the initial data and can be updated via the update method.

### Purpose
Enables bidirectional streaming of data between server and client in RSC contexts, allowing you to send initial data and update it over time without requiring a full page reload.

**Note**: AI SDK RSC is experimental. For production use, the AI SDK UI is recommended. Migration guidance is available in the migration guide.

### readstreamablevalue
Client-side async iterator for consuming server-streamed values created with createStreamableValue; takes StreamableValue parameter and yields emitted values.

## readStreamableValue

Function that reads streamable values created on the server using `createStreamableValue` from the client side.

**Purpose**: Enables client-side consumption of server-streamed values in RSC (React Server Components) applications.

**Import**:
```ts
import { readStreamableValue } from "@ai-sdk/rsc"
```

**Usage**: Call `readStreamableValue()` with a streamable value returned from a server action, then iterate over it with `for await...of` to receive each emitted value:

```ts
// Server action
async function generate() {
  'use server';
  const streamable = createStreamableValue();
  streamable.update(1);
  streamable.update(2);
  streamable.done(3);
  return streamable.value;
}

// Client component
const stream = await generate();
for await (const delta of readStreamableValue(stream)) {
  setGeneration(generation => generation + delta);
}
```

**API**:
- **Parameter**: `stream` (StreamableValue) - the streamable value to read from
- **Returns**: An async iterator containing values emitted by the streamable value

**Note**: AI SDK RSC is experimental; production use should prefer AI SDK UI.

### getaistate
getAIState() retrieves current AI state in RSC, optionally extracting a specific key from the state object; experimental feature with production recommendation to use AI SDK UI instead.

## getAIState

Retrieves the current AI state in RSC (React Server Components) context.

**Import:**
```
import { getAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (string, optional): Returns the value of the specified key in the AI state if the state is an object.

**Returns:**
The AI state value.

**Usage:**
Call `getAIState()` to access the current AI state. Optionally pass a key to extract a specific property from the state object.

**Note:** AI SDK RSC is experimental. The recommended approach for production is AI SDK UI, with a migration guide available.

### getmutableaistate
getMutableAIState: server-side function to get/update AI state with update() and done() methods; RSC experimental, use UI SDK for production.

## getMutableAIState

Get a mutable copy of the AI state for server-side updates.

**Import:**
```
import { getMutableAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (optional, string): Returns the value of the specified key in the AI state if it's an object.

**Returns:** The mutable AI state object with the following methods:
- `update(newState: any)`: Updates the AI state with new state without finalizing.
- `done(newState: any)`: Updates the AI state with new state, marks it as finalized, and closes the stream.

**Use case:** Persist and restore AI and UI states in Next.js applications by updating the mutable state on the server side.

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production applications.

### useaistate
Hook that reads/updates globally-shared AI state (system messages, function responses) under `<AI/>` provider; returns [state].

Hook for reading and updating AI state in RSC applications. The AI state is shared globally across all `useAIState` hooks under the same `<AI/>` provider. Intended to contain context and information shared with the AI model, including system messages, function responses, and other relevant data.

Import: `import { useAIState } from "@ai-sdk/rsc"`

Returns: A single element array where the first element is the current AI state.

Note: AI SDK RSC is experimental; AI SDK UI is recommended for production use.

### useactions
useActions hook accesses patched Server Actions from clients, returning action dictionary; prevents direct-access errors.

Hook for accessing Server Actions from client components in RSC (React Server Components). Returns a dictionary of server actions that have been patched through context.

**Purpose**: Enables client-side access to server actions while avoiding "Cannot find Client Component" errors that occur when accessing server actions directly.

**Import**: `import { useActions } from "@ai-sdk/rsc"`

**Returns**: `Record<string, Action>` - a dictionary mapping action names to their corresponding server action functions.

**Key Detail**: Server actions must be accessed through this hook because they are patched when passed through context. Direct access bypasses this patching and causes errors.

**Use Cases**: Building interfaces that require user interactions with the server, managing AI and UI states in Next.js, routing React components using a language model.

**Status**: Currently experimental. Production use should prefer AI SDK UI instead, with migration guide available.

### useuistate
Client-side hook for managing UI state as visual representation of AI state; returns [state, setState] tuple supporting functions and React nodes.

Hook for reading and updating UI state on the client side. The UI state is the visual representation of AI state and can contain functions, React nodes, and other data.

Returns an array similar to useState with two elements: the current UI state and a function to update it.

Import: `import { useUIState } from "@ai-sdk/rsc"`

Note: AI SDK RSC is experimental; AI SDK UI is recommended for production. Migration guide available for transitioning from RSC to UI.

Example use case: Managing AI and UI states in Next.js applications.

### usestreamablevalue
React hook consuming streamable values, returns [data, error, pending] tuple for handling streamed data with loading/error states.

React hook that consumes streamable values created with `createStreamableValue`. Returns a tuple of `[data, error, pending]` where data is the current streamed value, error is any exception thrown during streaming, and pending is a boolean indicating if the stream is still in progress.

Import: `import { useStreamableValue } from "@ai-sdk/rsc"`

Usage example:
```tsx
function MyComponent({ streamableValue }) {
  const [data, error, pending] = useStreamableValue(streamableValue);

  if (pending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {data}</div>;
}
```

Typical use case is consuming streamable values passed as component props from server-side streaming operations. Note: AI SDK RSC is experimental; AI SDK UI is recommended for production.

### render_(removed)
Removed RSC function that streamed LLM-generated UI with tool support; replaced by streamUI.

The `render` function has been removed in AI SDK 4.0. It was a helper function from the RSC module that created streamable UI from LLM providers, supporting the same model interfaces as AI SDK Core APIs.

**Status**: Deprecated and removed. Users should migrate to `streamUI` instead.

**What it did**: Created a streamable UI from language model responses with support for tools and streaming text callbacks.

**Parameters**:
- `model` (string): Model identifier, must be OpenAI SDK compatible
- `provider`: Provider client (OpenAI was the only available provider)
- `initial` (optional, ReactNode): Initial UI to render
- `messages` (array): Conversation messages with roles (system, user, assistant, tool) and content. Assistant messages could include tool_calls with id, type, and function details. Tool messages included toolCallId to reference the call.
- `functions` or `tools` (optional, ToolSet): Tools accessible to the model, each with description, parameters (zod schema), and optional async render function
- `text` (optional, callback): Handled generated tokens with content, delta, and done flag
- `temperature` (optional, number): Model temperature setting

**Return**: Any valid ReactNode

**Migration**: The function was replaced by `streamUI` with updated message specification. AI SDK RSC is experimental; AI SDK UI is recommended for production.

