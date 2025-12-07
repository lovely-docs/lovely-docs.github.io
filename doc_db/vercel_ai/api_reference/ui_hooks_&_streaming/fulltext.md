

## Pages

### usechat
React/Svelte/Vue hook for conversational UI with streaming, message state management, tool calling, and transport-based request customization.

## useChat Hook

Creates a conversational UI for chatbot applications with streaming message support, automatic state management, and UI updates.

**Import:**
```javascript
import { useChat } from '@ai-sdk/react'
// or
import { Chat } from '@ai-sdk/svelte'
import { Chat } from '@ai-sdk/vue'
```

**Parameters:**

- `chat`: Existing Chat instance (optional, overrides other params)
- `transport`: ChatTransport for sending messages (defaults to DefaultChatTransport with `/api/chat`)
  - `api`: API endpoint string (default: '/api/chat')
  - `credentials`: RequestCredentials mode
  - `headers`: HTTP headers
  - `body`: Extra body object
  - `prepareSendMessagesRequest`: Function to customize request before chat API calls, receives options with `id`, `messages`, `requestMetadata`, `body`, `credentials`, `headers`, `api`, `trigger` ('submit-message' | 'regenerate-message'), `messageId`
  - `prepareReconnectToStreamRequest`: Function to customize reconnect request, receives options with `id`, `requestMetadata`, `body`, `credentials`, `headers`, `api`
- `id`: Unique chat identifier (auto-generated if not provided)
- `messages`: Initial UIMessage[] to populate conversation
- `onToolCall`: Callback when tool call received, must call addToolOutput
- `sendAutomaticallyWhen`: Function determining if messages should resubmit after stream finish or tool call
- `onFinish`: Called when assistant response finishes streaming, receives `message` (UIMessage), `messages` (UIMessage[]), `isAbort` (boolean), `isDisconnect` (boolean), `isError` (boolean), `finishReason` ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')
- `onError`: Error callback
- `onData`: Called when data part received
- `experimental_throttle`: Throttle wait in ms for updates (default: undefined/disabled)
- `resume`: Whether to resume ongoing generation stream (default: false)

**Returns:**

- `id`: Chat identifier string
- `messages`: Current UIMessage[] array
  - `id`: Message identifier
  - `role`: 'system' | 'user' | 'assistant'
  - `parts`: UIMessagePart[] for rendering
  - `metadata`: Optional metadata
- `status`: 'submitted' | 'streaming' | 'ready' | 'error'
- `error`: Error object if occurred
- `sendMessage(message: CreateUIMessage | string, options?: ChatRequestOptions)`: Send message, triggers API call
  - Options: `headers`, `body`, `data`
- `regenerate(options?: { messageId?: string })`: Regenerate last or specific assistant message
- `stop()`: Abort current streaming response
- `clearError()`: Clear error state
- `resumeStream()`: Resume interrupted stream (network error recovery)
- `addToolOutput(options: { tool: string; toolCallId: string; output: unknown } | { tool: string; toolCallId: string; state: "output-error"; errorText: string })`: Add tool result, may trigger auto-submission
- `setMessages(messages: UIMessage[] | function)`: Update messages locally without API call (optimistic updates)

**Note:** AI SDK 5.0 uses transport-based architecture and no longer manages input state internally.

### usecompletion
Hook for streaming text completions with configurable API endpoint, shared state via id, callbacks, request customization, and UI state/handlers.

## useCompletion Hook

Creates text completion capabilities with streaming support, state management, and automatic UI updates.

### Imports
- React: `import { useCompletion } from '@ai-sdk/react'`
- Svelte: `import { Completion } from '@ai-sdk/svelte'`
- Vue: `import { useCompletion } from '@ai-sdk/vue'`

### Parameters

**Endpoint & Identification:**
- `api` (string, default: '/api/completion'): API endpoint for text generation, can be relative or absolute URL
- `id` (string): Unique identifier for completion; when provided, multiple hook instances with same id share state across components

**Initial State:**
- `initialInput` (string): Optional initial prompt input
- `initialCompletion` (string): Optional initial completion result

**Callbacks:**
- `onFinish` ((prompt: string, completion: string) => void): Called when completion stream ends
- `onError` ((error: Error) => void): Called when stream encounters error

**Request Configuration:**
- `headers` (Record<string, string> | Headers): Optional headers for API endpoint
- `body` (any): Optional additional body object for API endpoint
- `credentials` ('omit' | 'same-origin' | 'include', default: 'same-origin'): Credentials mode for request
- `fetch` (FetchFunction): Optional custom fetch function, defaults to global fetch
- `streamProtocol` ('text' | 'data', default: 'data'): Stream type; 'text' treats stream as text stream

**React-specific:**
- `experimental_throttle` (number): Custom throttle wait time in milliseconds for completion and data updates during streaming; undefined disables throttling

### Returns

**State:**
- `completion` (string): Current text completion
- `input` (string): Current input field value
- `error` (undefined | Error): Error thrown during completion, if any
- `isLoading` (boolean): Whether fetch operation is in progress

**State Setters:**
- `setCompletion` ((completion: string) => void): Update completion state
- `setInput` (React.Dispatch<React.SetStateAction<string>>): Update input state

**Execution:**
- `complete` ((prompt: string, options: { headers, body }) => void): Execute text completion for provided prompt
- `stop` (() => void): Abort current API request

**Event Handlers:**
- `handleInputChange` ((event: any) => void): onChange handler for input field
- `handleSubmit` ((event?: { preventDefault?: () => void }) => void): Form submission handler that resets input and appends user message

### useobject
Experimental hook for streaming and parsing JSON objects from API endpoints into typed objects using schemas; returns submit(), object, error, isLoading, stop(), clear().

## useObject Hook

Experimental React/Svelte/Vue hook for consuming text streams representing JSON objects and parsing them into typed objects based on a schema.

### Purpose
Consumes streamed JSON chunks from a backend endpoint and progressively builds a complete object matching a provided schema. Pairs with `streamObject` on the backend.

### Parameters
- **api** (string): Endpoint URL (relative or absolute) that streams JSON matching the schema as chunked text
- **schema** (Zod Schema | JSON Schema): Defines the object shape; use Zod schema or `jsonSchema()` function
- **id?** (string): Unique identifier for shared state across components; auto-generated if omitted
- **initialValue?** (DeepPartial<RESULT>): Initial object value
- **fetch?** (FetchFunction): Custom fetch implementation; defaults to global fetch
- **headers?** (Record<string, string> | Headers): Request headers
- **credentials?** (RequestCredentials): Fetch credentials mode ("omit", "same-origin", "include")
- **onError?** ((error: Error) => void): Error callback
- **onFinish?** ((result: OnFinishResult) => void): Called when streaming completes; receives `object` (typed result or undefined if invalid) and `error` (TypeValidationError if schema mismatch)

### Returns
- **submit** ((input: INPUT) => void): Calls API with input as JSON body
- **object** (DeepPartial<RESULT> | undefined): Current generated object, updated as JSON chunks arrive
- **error** (Error | unknown): API call error if present
- **isLoading** (boolean): Whether request is in progress
- **stop** (() => void): Aborts current request
- **clear** (() => void): Clears object state

### Example
```tsx
'use client';
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { z } from 'zod';

export default function Page() {
  const { object, submit, isLoading } = useObject({
    api: '/api/use-object',
    schema: z.object({ content: z.string() }),
  });

  return (
    <div>
      <button onClick={() => submit('example input')} disabled={isLoading}>
        Generate
      </button>
      {object?.content && <p>{object.content}</p>}
    </div>
  );
}
```

### converttomodelmessages
Transform useChat messages to ModelMessage objects; supports multi-modal tool responses and custom data part conversion with type safety.

## Purpose
Transforms UI messages from the `useChat` hook into `ModelMessage` objects compatible with AI core functions like `streamText`.

## Basic Usage
```ts
import { convertToModelMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

## API Signature

**Parameters:**
- `messages: Message[]` - Array of UI messages from useChat hook
- `options?: { tools?: ToolSet, convertDataPart?: (part: DataUIPart) => TextPart | FilePart | null }` - Optional configuration for tools and custom data part conversion

**Returns:** `ModelMessage[]` - Array of ModelMessage objects

## Multi-modal Tool Responses
Tools can implement `toModelOutput` method to return multi-modal content (images, text, etc.):

```ts
const screenshotTool = tool({
  parameters: z.object({}),
  execute: async () => 'imgbase64',
  toModelOutput: result => [{ type: 'image', data: result }],
});

streamText({
  model: openai('gpt-4'),
  messages: convertToModelMessages(messages, {
    tools: { screenshot: screenshotTool },
  }),
});
```

## Custom Data Part Conversion
Convert custom data parts (URLs, code files, JSON configs) attached to user messages by providing a `convertDataPart` callback:

```ts
type CustomUIMessage = UIMessage<never, {
  url: { url: string; title: string; content: string };
  'code-file': { filename: string; code: string; language: string };
}>;

streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages<CustomUIMessage>(messages, {
    convertDataPart: part => {
      if (part.type === 'data-url') {
        return {
          type: 'text',
          text: `[Reference: ${part.data.title}](${part.data.url})\n\n${part.data.content}`,
        };
      }
      if (part.type === 'data-code-file') {
        return {
          type: 'text',
          text: `\`\`\`${part.data.language}\n// ${part.data.filename}\n${part.data.code}\n\`\`\``,
        };
      }
    },
  }),
});
```

**Key behaviors:**
- Only data parts that return a text or file part are included; others are ignored
- Generic parameter provides type safety for custom data parts
- Enables selective inclusion of specific data part types

### prunemessages
pruneMessages() filters ModelMessage arrays to reduce token usage by removing reasoning, tool calls, and empty messages with configurable strategies per option type.

## pruneMessages()

Filters an array of ModelMessage objects to reduce context size, remove intermediate reasoning, or trim tool calls and empty messages before sending to an LLM.

### Parameters

- `messages`: ModelMessage[] - Array of messages to prune
- `reasoning`: 'all' | 'before-last-message' | 'none' (default: 'none') - How to remove reasoning content from assistant messages
- `toolCalls`: 'all' | 'before-last-message' | 'before-last-${number}-messages' | 'none' | PruneToolCallsOption[] (default: 'none') - How to prune tool call/results/approval content; can specify strategy or per-tool list
- `emptyMessages`: 'keep' | 'remove' (default: 'remove') - Whether to keep or remove messages with empty content after pruning

### Returns

ModelMessage[] - The pruned list of messages

### Examples

```ts
import { pruneMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const prunedMessages = pruneMessages({
    messages,
    reasoning: 'before-last-message',
    toolCalls: 'before-last-2-messages',
    emptyMessages: 'remove',
  });

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: prunedMessages,
  });

  return result.toUIMessageStreamResponse();
}
```

```ts
const pruned = pruneMessages({
  messages,
  reasoning: 'all',
  toolCalls: 'before-last-message',
});
```

### Pruning Options

- **reasoning**: 'all' removes all reasoning parts; 'before-last-message' keeps reasoning only in the last message; 'none' retains all
- **toolCalls**: 'all' prunes all tool-call/result/approval chunks; 'before-last-message' prunes except in last message; 'before-last-N-messages' prunes except in last N messages; 'none' does not prune; or provide array for per-tool control
- **emptyMessages**: 'remove' (default) excludes messages with no content after pruning; 'keep' retains them

Typically used before sending context to an LLM to reduce message/token count after tool-calls and approvals.

### createuimessagestream
createUIMessageStream creates a readable stream for UI messages with writer methods (write/merge), error handling, and onFinish callback; returns ReadableStream<UIMessageChunk>.

## createUIMessageStream

Creates a readable stream for UI messages with message merging, error handling, and finish callbacks.

### Import
```tsx
import { createUIMessageStream } from "ai"
```

### Example
```tsx
const stream = createUIMessageStream({
  async execute({ writer }) {
    // Write individual message chunks
    writer.write({ type: 'text-start', id: 'example-text' });
    writer.write({ type: 'text-delta', id: 'example-text', delta: 'Hello' });
    writer.write({ type: 'text-end', id: 'example-text' });

    // Merge another stream
    const result = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt: 'Write a haiku about AI',
    });
    writer.merge(result.toUIMessageStream());
  },
  onError: error => `Custom error: ${error.message}`,
  originalMessages: existingMessages,
  onFinish: ({ messages, isContinuation, responseMessage }) => {
    console.log('Stream finished with messages:', messages);
  },
});
```

### Parameters

- **execute**: `(options: { writer: UIMessageStreamWriter }) => Promise<void> | void` - Function receiving a writer instance to write UI message chunks
  - **writer.write**: `(part: UIMessageChunk) => void` - Writes a UI message chunk to the stream
  - **writer.merge**: `(stream: ReadableStream<UIMessageChunk>) => void` - Merges another UI message stream into this stream
  - **writer.onError**: `(error: unknown) => string` - Error handler for merged streams

- **onError**: `(error: unknown) => string` - Handles errors and returns error message string (default returns error message)

- **originalMessages**: `UIMessage[] | undefined` - Original messages; if provided, enables persistence mode with message ID for response message

- **onFinish**: `(options: { messages: UIMessage[]; isContinuation: boolean; responseMessage: UIMessage }) => void | undefined` - Callback when stream finishes
  - **messages**: `UIMessage[]` - Updated list of UI messages
  - **isContinuation**: `boolean` - Whether response message continues last original message or creates new one
  - **responseMessage**: `UIMessage` - Message sent to client as response

- **generateId**: `IdGenerator | undefined` - Function to generate unique message IDs (uses default if not provided)

### Returns

`ReadableStream<UIMessageChunk>` - Readable stream emitting UI message chunks with automatic error propagation, stream merging, and cleanup.

### createuimessagestreamresponse
Creates HTTP Response streaming UI message chunks (data, text, sources, LLM output) with configurable status, headers, and SSE consumption callback.

## Purpose
Creates a Response object that streams UI messages to the client, allowing you to send structured data, text content, source information, and LLM streams in a single response.

## Parameters
- `stream` (required): ReadableStream<UIMessageChunk> - The UI message stream to send
- `status` (optional): number - HTTP status code, defaults to 200
- `statusText` (optional): string - HTTP status text
- `headers` (optional): Headers | Record<string, string> - Additional response headers
- `consumeSseStream` (optional): callback function to consume the Server-Sent Events stream

## Returns
Response object that streams UI message chunks with specified status, headers, and content.

## Example
```tsx
import { createUIMessageStream, createUIMessageStreamResponse, streamText } from 'ai';

const response = createUIMessageStreamResponse({
  status: 200,
  statusText: 'OK',
  headers: { 'Custom-Header': 'value' },
  stream: createUIMessageStream({
    execute({ writer }) {
      // Write custom data
      writer.write({ type: 'data', value: { message: 'Hello' } });
      
      // Write text content
      writer.write({ type: 'text', value: 'Hello, world!' });
      
      // Write source information
      writer.write({
        type: 'source-url',
        value: {
          type: 'source',
          id: 'source-1',
          url: 'https://example.com',
          title: 'Example Source',
        },
      });
      
      // Merge with LLM stream
      const result = streamText({
        model: 'anthropic/claude-sonnet-4.5',
        prompt: 'Say hello',
      });
      writer.merge(result.toUIMessageStream());
    },
  }),
});
```

### pipeuimessagestreamtoresponse
pipeUIMessageStreamToResponse pipes ReadableStream<UIMessageChunk> to ServerResponse with status/headers and optional consumeSseStream callback

## Purpose
Pipes streaming UI message data to a Node.js ServerResponse object for server-side streaming responses.

## Usage
```tsx
import { pipeUIMessageStreamToResponse } from "ai";

pipeUIMessageStreamToResponse({
  response: serverResponse,
  status: 200,
  statusText: 'OK',
  headers: {
    'Custom-Header': 'value',
  },
  stream: myUIMessageStream,
  consumeSseStream: ({ stream }) => {
    console.log('Consuming SSE stream:', stream);
  },
});
```

## Parameters
- `response` (ServerResponse): Node.js ServerResponse object to pipe data to
- `stream` (ReadableStream<UIMessageChunk>): The UI message stream to pipe
- `status` (number): HTTP status code for the response
- `statusText` (string): HTTP status text for the response
- `headers` (Headers | Record<string, string>): Additional response headers
- `consumeSseStream` (optional function): Callback to independently consume the SSE stream; receives a teed copy of the stream

### readuimessagestream
readUIMessageStream converts UIMessageChunk streams to AsyncIterableStream<UIMessage> for terminal UIs, custom client consumption, or RSCs; accepts optional starting message, error handler, and termination flag.

## readUIMessageStream

Transforms a stream of `UIMessageChunk`s into an `AsyncIterableStream` of `UIMessage`s.

Useful for non-Chat use cases like terminal UIs, custom client-side stream consumption, or React Server Components.

### Import
```tsx
import { readUIMessageStream } from 'ai';
```

### Parameters
- `message` (UIMessage, optional): The last assistant message to use as a starting point when resuming conversation. Otherwise undefined.
- `stream` (ReadableStream<UIMessageChunk>): The stream of UIMessageChunk objects to read.
- `onError` ((error: unknown) => void, optional): Called when an error occurs during stream processing.
- `terminateOnError` (boolean, optional): Whether to terminate the stream on error. Defaults to false.

### Returns
An `AsyncIterableStream` of `UIMessage`s. Each stream part represents a different state of the same message as it is being completed.

### inferuitools
Type helper that maps a ToolSet to inferred input/output types for each tool, enabling type-safe tool usage in UI messages.

## InferUITools

Type helper that infers input and output types from a `ToolSet` for type-safe tool usage in `UIMessage`s.

### Import
```tsx
import { InferUITools } from 'ai';
```

### API Signature

**Type Parameters:**
- `TOOLS` (ToolSet): The tool set to infer types from.

**Returns:** A mapped type with shape:
```typescript
{
  [NAME in keyof TOOLS & string]: {
    input: InferToolInput<TOOLS[NAME]>;
    output: InferToolOutput<TOOLS[NAME]>;
  };
}
```

### Example

```tsx
import { InferUITools } from 'ai';
import { z } from 'zod';

const tools = {
  weather: {
    description: 'Get the current weather',
    parameters: z.object({
      location: z.string().describe('The city and state'),
    }),
    execute: async ({ location }) => `The weather in ${location} is sunny.`,
  },
  calculator: {
    description: 'Perform basic arithmetic',
    parameters: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    execute: async ({ operation, a, b }) => {
      const ops = { add: (x, y) => x + y, subtract: (x, y) => x - y, multiply: (x, y) => x * y, divide: (x, y) => x / y };
      return ops[operation](a, b);
    },
  },
};

type MyUITools = InferUITools<typeof tools>;
// Result: {
//   weather: { input: { location: string }; output: string };
//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };
// }
```

### Related
- `InferUITool` - Infer types for a single tool
- `useChat` - Chat hook that supports typed tools

### inferuitool
Type helper extracting input/output types from tool definitions for type-safe UI message integration.

## InferUITool

Type helper that infers input and output types from a tool definition.

**Purpose**: Ensures type safety when working with individual tools in `UIMessage`s.

**Import**:
```tsx
import { InferUITool } from 'ai';
```

**Type Parameters**:
- `TOOL`: The tool to infer types from

**Returns**: A type with shape:
```typescript
{
  input: InferToolInput<TOOL>;
  output: InferToolOutput<TOOL>;
}
```

**Example**:
```tsx
import { InferUITool } from 'ai';
import { z } from 'zod';

const weatherTool = {
  description: 'Get the current weather',
  parameters: z.object({
    location: z.string().describe('The city and state'),
  }),
  execute: async ({ location }) => {
    return `The weather in ${location} is sunny.`;
  },
};

type WeatherUITool = InferUITool<typeof weatherTool>;
// Results in: { input: { location: string }; output: string; }
```

**Related**: `InferUITools` (for tool sets), `ToolUIPart` (tool part type for UI messages)

### ui_hooks_reference
Framework-agnostic UI toolkit with hooks (useChat, useCompletion, useObject) and streaming utilities for React/Svelte/Vue.js; Vue.js lacks useObject support.

AI SDK UI is a framework-agnostic toolkit for building interactive chat, completion, and assistant applications.

**Core Hooks:**
- `useChat`: Hook for chat interface interactions with language models
- `useCompletion`: Hook for completion interface interactions with language models
- `useObject`: Hook for consuming streamed JSON objects

**Utility Functions:**
- `convertToModelMessages`: Converts useChat messages to ModelMessages for AI functions
- `pruneMessages`: Prunes model messages from a list of model messages
- `createUIMessageStream`: Creates a UI message stream to stream additional data to the client
- `createUIMessageStreamResponse`: Creates a response object to stream UI messages to the client
- `pipeUIMessageStreamToResponse`: Pipes a UI message stream to a Node.js ServerResponse object
- `readUIMessageStream`: Transforms a stream of UIMessageChunk objects into an AsyncIterableStream of UIMessage objects

**Framework Support:**
- React: Full support for useChat, useCompletion, useObject
- Svelte: Full support for useChat (Chat), useCompletion (Completion), useObject (StructuredObject)
- Vue.js: Support for useChat and useCompletion, but not useObject

Contributions are welcome to implement missing features for non-React frameworks.

