

## Pages

### streamui
streamUI creates streamable React UI from LLM output with tool support, returning ReactNode + AsyncIterable stream of text/tool/error/finish events; supports messages, tools with generate callbacks, and standard generation parameters.

## streamUI

Helper function to create streamable UI from LLM providers. Similar to AI SDK Core APIs with same model interfaces.

### Import
```javascript
import { streamUI } from "@ai-sdk/rsc"
```

### Parameters

**Core inputs:**
- `model` (LanguageModel): Language model to use, e.g. `openai("gpt-4.1")`
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `prompt` (string): Input prompt to generate text from
- `messages` (Array): Conversation messages - CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage, or UIMessage from useChat hook
  - CoreUserMessage content can include TextPart, ImagePart (base64/data URL/http(s) URL), or FilePart
  - CoreAssistantMessage content can include TextPart or ToolCallPart
  - CoreToolMessage content contains ToolResultPart with tool execution results
- `initial` (ReactNode, optional): Initial UI to render

**Generation options:**
- `maxOutputTokens` (number, optional): Maximum tokens to generate
- `temperature` (number, optional): Temperature setting (recommend setting either temperature or topP, not both)
- `topP` (number, optional): Nucleus sampling
- `topK` (number, optional): Sample from top K options per token
- `presencePenalty` (number, optional): Affects likelihood of repeating prompt information
- `frequencyPenalty` (number, optional): Affects likelihood of repeating same words/phrases
- `stopSequences` (string[], optional): Sequences that stop generation
- `seed` (number, optional): Integer seed for deterministic results if supported

**Tool configuration:**
- `tools` (ToolSet, optional): Tools accessible to model with:
  - `description` (string, optional): Purpose and usage details
  - `parameters` (zod schema): Typed schema for tool parameters
  - `generate` (async function or AsyncGenerator, optional): Called with tool arguments, yields React nodes as UI
- `toolChoice` (optional): How tools are selected - "auto" (default), "none", "required", or `{ "type": "tool", "toolName": string }`

**Callbacks:**
- `text` (function, optional): Callback handling generated tokens with `{ content, delta, done }`
- `onFinish` (function, optional): Called when LLM response and tool executions complete, receives `{ usage: { promptTokens, completionTokens, totalTokens }, value: ReactNode, warnings?, response? }`

**Other:**
- `maxRetries` (number, optional): Max retries, default 2, set to 0 to disable
- `abortSignal` (AbortSignal, optional): Cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (Record<string, JSONObject>, optional): Provider-specific options

### Returns

- `value` (ReactNode): User interface based on stream output
- `response` (Response, optional): Response data with optional headers
- `warnings` (Warning[], optional): Provider warnings
- `stream` (AsyncIterable<StreamPart> & ReadableStream<StreamPart>): Stream with all events:
  - `{ type: 'text-delta', textDelta: string }`: Text delta
  - `{ type: 'tool-call', toolCallId, toolName, args }`: Tool call
  - `{ type: 'error', error: Error }`: Error during execution
  - `{ type: 'finish', finishReason, usage }`: Completion with reason ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')

### Examples

1. **Render React component as function call** - Use streamUI with a model to generate and render React components based on LLM output
2. **Persist and restore UI/AI states** - Save and restore both UI state and AI state in Next.js applications
3. **Route React components** - Use language model to dynamically route between different React components
4. **Stream component updates** - Stream component updates to client in real-time

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; migration guide available.

### createai
Context provider factory for client-server AI/UI state management with server actions, SSR support, and persistence callbacks.

## createAI

Creates a client-server context provider for managing UI and AI states in your application tree.

**Status**: Experimental. AI SDK RSC is experimental; use AI SDK UI for production. Migration guide available.

**Import**:
```
import { createAI } from "@ai-sdk/rsc"
```

**Parameters**:
- `actions` (Record<string, Action>): Server-side actions callable from the client
- `initialAIState` (any): Initial AI state for the client
- `initialUIState` (any): Initial UI state for the client
- `onGetUIState` (() => UIState): Called during SSR to compare and update UI state
- `onSetAIState` ((Event) => void): Triggered when update() or done() is called by mutable AI state in actions, allowing safe database persistence
  - Event parameters:
    - `state` (AIState): Resulting AI state after update
    - `done` (boolean): Whether AI state updates are finalized

**Returns**: An `<AI/>` context provider component

**Examples**:
- Managing AI and UI states in Next.js
- Persisting and restoring UI/AI states in Next.js

### createstreamableui
createStreamableUI: stream React components from server to client with update/append/done/error methods; done() call required to close stream.

## createStreamableUI

Server-side function that creates a stream for sending React UI components from server to client. The client receives and renders the streamed UI as normal React nodes.

**Import:**
```
import { createStreamableUI } from "@ai-sdk/rsc"
```

**Parameters:**
- `initialValue` (ReactNode, optional): Initial UI value

**Returns:**
- `value` (ReactNode): The streamable UI that can be returned from a Server Action and received by the client

**Methods:**
- `update(ReactNode)`: Replace current UI node with a new one
- `append(ReactNode)`: Append a new UI node; previous node becomes immutable after append
- `done(ReactNode | null)`: Finalize and close the stream; required to call, otherwise response stays in loading state
- `error(Error)`: Signal an error in the stream; thrown on client and caught by nearest error boundary

**Example:** Render a React component during a tool call (see examples/next-app/tools/render-interface-during-tool-call)

### createstreamablevalue
Server-to-client streaming function for serializable data in RSC; returns updateable streamable object for Server Actions.

## createStreamableValue

Creates a server-to-client stream for sending serializable data values.

**Import:**
```
import { createStreamableValue } from "@ai-sdk/rsc"
```

**Parameters:**
- `value` (any): Any serializable data supported by RSC (e.g., JSON)

**Returns:**
- A streamable object that can be returned from Server Actions to the client. It holds the initial data and can be updated via an update method.

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; see migration guide for RSC to UI migration.

### readstreamablevalue
readStreamableValue: async iterator for consuming server-streamed values created with createStreamableValue in RSC; takes StreamableValue parameter, yields values via for-await-of loop.

## readStreamableValue

Reads streamable values created on the server using `createStreamableValue` from the client side.

**Purpose**: Enables client-side consumption of server-streamed values in RSC (React Server Components) applications.

**Import**:
```ts
import { readStreamableValue } from "@ai-sdk/rsc"
```

**Usage**: Returns an async iterator that yields values emitted by the streamable. Iterate with `for await...of` to process each streamed value.

**Example**:
```ts
// Server (app/actions.ts)
async function generate() {
  'use server';
  const streamable = createStreamableValue();
  streamable.update(1);
  streamable.update(2);
  streamable.done(3);
  return streamable.value;
}

// Client (app/page.tsx)
import { readStreamableValue } from '@ai-sdk/rsc';

export default function Page() {
  const [generation, setGeneration] = useState('');
  return (
    <button onClick={async () => {
      const stream = await generate();
      for await (const delta of readStreamableValue(stream)) {
        setGeneration(gen => gen + delta);
      }
    }}>
      Generate
    </button>
  );
}
```

**API**:
- **Parameter**: `stream` (StreamableValue) - the streamable value to read
- **Returns**: AsyncIterator yielding values from the streamable

**Note**: AI SDK RSC is experimental; use AI SDK UI for production.

### getaistate
getAIState() retrieves current AI state in RSC; accepts optional key parameter for object property access.

## getAIState

Retrieves the current AI state in RSC (React Server Components) context.

**Import:**
```
import { getAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (string, optional): Returns the value of the specified key in the AI state if it's an object.

**Returns:** The AI state.

**Note:** AI SDK RSC is experimental. For production use, AI SDK UI is recommended. Migration guide available.

**Example:** Render a React component during a tool call made by a language model in Next.js (see examples/next-app/tools/render-interface-during-tool-call).

### getmutableaistate
getMutableAIState() returns mutable AI state with update() and done() methods for server-side state management in RSC (experimental).

## getMutableAIState

Get a mutable copy of the AI state for server-side updates.

**Import:**
```
import { getMutableAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (optional, string): Returns the value of the specified key in the AI state if it's an object.

**Returns:** Mutable AI state object with methods:
- `update(newState: any)`: Updates the AI state with new state
- `done(newState: any)`: Updates the AI state, marks it as finalized, and closes the stream

**Example:** Persist and restore AI and UI states in Next.js (see state-management/save-and-restore-states example)

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; migration guide available.

### useaistate
useAIState hook reads/updates globally-shared AI state (system messages, function responses) under <AI/> provider; returns [state]; from @ai-sdk/rsc (experimental)

Hook for reading and updating AI state in RSC applications. The AI state is shared globally across all `useAIState` hooks under the same `<AI/>` provider.

**Purpose**: Enables access to shared context and information passed to the AI model, including system messages, function responses, and other relevant data.

**Import**: `import { useAIState } from "@ai-sdk/rsc"`

**Returns**: A single-element array where the first element is the current AI state.

**Note**: AI SDK RSC is experimental; AI SDK UI is recommended for production use.

### useactions
useActions hook accesses patched Server Actions from client; returns Record<string, Action>; required to avoid "Cannot find Client Component" errors.

## useActions Hook

A client-side hook for accessing Server Actions from the AI SDK RSC. Required for proper integration because Server Actions are patched when passed through context; accessing them directly causes "Cannot find Client Component" errors.

**Import:**
```javascript
import { useActions } from "@ai-sdk/rsc"
```

**Returns:** `Record<string, Action>` - a dictionary of server actions.

**Use Cases:**
- Building interfaces requiring user interactions with the server
- Managing AI and UI states in Next.js applications
- Routing React components using a language model

**Note:** AI SDK RSC is experimental; AI SDK UI is recommended for production. Migration guide available.

### useuistate
useUIState hook: read/update client-side UI state (functions, React nodes, data) as visual representation of AI state; returns [state, setState] array; RSC experimental, use AI SDK UI for production.

Hook for reading and updating UI state in RSC applications. Returns an array similar to useState with current UI state as first element and update function as second element. UI state is client-side only and can contain functions, React nodes, and other data, serving as the visual representation of AI state.

**Note:** AI SDK RSC is experimental; AI SDK UI is recommended for production. Migration guide available.

**Import:**
```
import { useUIState } from "@ai-sdk/rsc"
```

**Example:** Managing AI and UI states in Next.js applications (see state-management/ai-ui-states example).

### usestreamablevalue
React hook consuming streamable values, returns [data, error, pending] tuple for handling streamed component data.

React hook for consuming streamable values created with `createStreamableValue`.

**Purpose**: Unwraps a streamable value and provides access to its current data, error state, and pending status.

**Import**:
```tsx
import { useStreamableValue } from "@ai-sdk/rsc"
```

**Usage**:
```tsx
function MyComponent({ streamableValue }) {
  const [data, error, pending] = useStreamableValue(streamableValue);

  if (pending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {data}</div>;
}
```

**Returns**: Array tuple with three elements:
1. `data` - The current value from the stream
2. `error` - Error object if thrown during streaming, otherwise undefined
3. `pending` - Boolean indicating if the value is still being streamed

**Note**: AI SDK RSC is experimental; AI SDK UI is recommended for production.

### rsc_reference
Experimental RSC API reference: server-side streamUI/createAI/createStreamableUI/createStreamableValue/getAIState/getMutableAIState; client-side useAIState/useUIState/useActions hooks.

## Overview

AI SDK RSC (React Server Components) is an experimental feature for building AI applications. The documentation warns that it's not production-ready and recommends using AI SDK UI instead, with a migration guide available.

## Core Functions

**streamUI** - Helper function that streams React Server Components during tool execution, enabling dynamic UI updates from server-side AI operations.

**createAI** - Context provider that wraps your application and manages shared state between client and server, connecting the language model with your UI.

**createStreamableUI** - Creates a UI component that can be rendered on the server and streamed to the client, allowing progressive rendering of complex components.

**createStreamableValue** - Creates a streamable value (non-UI data) that can be rendered on the server and streamed to the client, useful for streaming data alongside UI.

**getAIState** - Server-side function to read the current AI state (read-only access).

**getMutableAIState** - Server-side function to read and update the AI state, allowing modifications to the AI context during execution.

**useAIState** - Client-side hook to access the AI state from the context provider created by createAI.

**useUIState** - Client-side hook to access the UI state from the context provider, managing client-side UI updates.

**useActions** - Client-side hook to call server actions from the client, enabling client-to-server communication for AI operations.

