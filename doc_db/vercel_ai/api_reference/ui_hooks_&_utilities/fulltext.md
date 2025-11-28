

## Pages

### usechat
useChat hook for streaming conversational UI with transport-based architecture, tool calling support, automatic resubmission, and granular callbacks for finish/error/data events.

## useChat Hook

Creates a conversational UI for chatbot applications with streaming message support, automatic state management, and UI updates.

### Import
- React: `import { useChat } from '@ai-sdk/react'`
- Svelte: `import { Chat } from '@ai-sdk/svelte'`
- Vue: `import { Chat } from '@ai-sdk/vue'`

### Parameters

**chat** (optional): Existing Chat instance; if provided, other parameters are ignored.

**transport** (optional): ChatTransport for sending messages. Defaults to DefaultChatTransport with `/api/chat` endpoint.
- `api`: API endpoint string (default: '/api/chat')
- `credentials`: RequestCredentials mode for fetch
- `headers`: HTTP headers as Record or Headers object
- `body`: Extra body object for requests
- `prepareSendMessagesRequest`: Function to customize request before chat API calls, receives options with id, messages, requestMetadata, body, credentials, headers, api, trigger ('submit-message' | 'regenerate-message'), messageId
- `prepareReconnectToStreamRequest`: Function to customize reconnect request, receives options with id, requestMetadata, body, credentials, headers, api

**id** (optional): Unique chat identifier; randomly generated if not provided.

**messages** (optional): Initial UIMessage[] to populate conversation.

**onToolCall** (optional): Callback `({toolCall: ToolCall}) => void | Promise<void>` invoked when tool call received; must call addToolOutput to provide result.

**sendAutomaticallyWhen** (optional): Function `(options: { messages: UIMessage[] }) => boolean | PromiseLike<boolean>` called when stream finishes or tool call added to determine if messages should resubmit. Use lastAssistantMessageIsCompleteWithToolCalls helper for common scenarios.

**onFinish** (optional): Callback `(options: OnFinishOptions) => void` when assistant response finishes streaming.
- `message`: UIMessage response
- `messages`: UIMessage[] all messages including response
- `isAbort`: boolean, true if client aborted
- `isDisconnect`: boolean, true if server disconnected (network error)
- `isError`: boolean, true if streaming errors stopped response
- `finishReason`: optional string ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')

**onError** (optional): Callback `(error: Error) => void` when error encountered.

**onData** (optional): Callback `(dataPart: DataUIPart) => void` when data part received.

**experimental_throttle** (optional): Custom throttle wait in ms for chat messages and data updates; undefined disables throttling.

**resume** (optional): boolean whether to resume ongoing chat generation stream (default: false).

### Returns

**id**: string, the chat identifier.

**messages**: UIMessage[] current chat messages.
- `id`: string, unique message identifier
- `role`: 'system' | 'user' | 'assistant'
- `parts`: UIMessagePart[] for rendering in UI
- `metadata`: optional unknown metadata

**status**: 'submitted' | 'streaming' | 'ready' | 'error' - current chat status.

**error**: Error | undefined if error occurred.

**sendMessage**: `(message: CreateUIMessage | string, options?: ChatRequestOptions) => void` sends new message and triggers API call for assistant response.
- ChatRequestOptions: `headers` (Record<string, string> | Headers), `body` (object), `data` (JSONValue)

**regenerate**: `(options?: { messageId?: string }) => void` regenerates last assistant message or specific message by messageId.

**stop**: `() => void` aborts current streaming response.

**clearError**: `() => void` clears error state.

**resumeStream**: `() => void` resumes interrupted streaming response after network error.

**addToolOutput**: `(options: { tool: string; toolCallId: string; output: unknown } | { tool: string; toolCallId: string; state: "output-error", errorText: string }) => void` adds tool result to chat, may trigger automatic submission if sendAutomaticallyWhen configured.

**setMessages**: `(messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[])) => void` updates messages locally without API call for optimistic updates.

### Breaking Changes in AI SDK 5.0
useChat now uses transport-based architecture and no longer manages input state internally. See migration guide for details.

### usecompletion
Hook for streaming text completions with input/output state management, form handlers, and configurable API endpoint, stream protocol, and request options.

## useCompletion Hook

Creates text completion capabilities with streaming support from AI providers. Manages state for input and completion, automatically updates UI as responses arrive.

### Imports
- React: `import { useCompletion } from '@ai-sdk/react'`
- Svelte: `import { Completion } from '@ai-sdk/svelte'`
- Vue: `import { useCompletion } from '@ai-sdk/vue'`

### Parameters

**api** (string, default: '/api/completion'): Endpoint for text generation, can be relative or absolute URL.

**id** (string): Unique identifier for the completion. When provided, multiple `useCompletion` hooks with the same id share state across components, useful for displaying the same stream in multiple places.

**initialInput** (string): Optional initial prompt input value.

**initialCompletion** (string): Optional initial completion result value.

**onFinish** ((prompt: string, completion: string) => void): Callback when completion stream ends.

**onError** ((error: Error) => void): Callback when stream encounters an error.

**headers** (Record<string, string> | Headers): Optional headers for API request.

**body** (any): Optional additional body object for API request.

**credentials** ('omit' | 'same-origin' | 'include', default: 'same-origin'): Sets credentials mode for the request.

**streamProtocol** ('text' | 'data', default: 'data'): Stream type - 'text' treats as text stream, 'data' for data stream.

**fetch** (FetchFunction): Custom fetch function, defaults to global fetch.

**experimental_throttle** (number, React only): Throttle wait time in milliseconds for UI updates during streaming. Undefined disables throttling.

### Returns

**completion** (string): Current text completion value.

**complete** ((prompt: string, options: { headers, body }) => void): Execute text completion for given prompt.

**error** (undefined | Error): Error from completion process if any.

**setCompletion** ((completion: string) => void): Update completion state.

**stop** (() => void): Abort current API request.

**input** (string): Current input field value.

**setInput** (React.Dispatch<React.SetStateAction<string>>): Update input state.

**handleInputChange** ((event: any) => void): onChange handler for input field to control its value.

**handleSubmit** ((event?: { preventDefault?: () => void }) => void): Form submission handler that resets input and appends user message.

**isLoading** (boolean): Flag indicating if fetch operation is in progress.

### useobject
React/Svelte/Vue hook for streaming and parsing JSON objects with schema validation; pairs with backend streamObject; returns submit function, current object state, error/loading status, and control methods.

## Purpose
`experimental_useObject()` is a React/Svelte/Vue hook that consumes text streams representing JSON objects and parses them into complete objects based on a schema. It pairs with the backend `streamObject` function.

## Basic Usage
```tsx
'use client';
import { experimental_useObject as useObject } from '@ai-sdk/react';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/use-object',
    schema: z.object({ content: z.string() }),
  });

  return (
    <div>
      <button onClick={() => submit('example input')}>Generate</button>
      {object?.content && <p>{object.content}</p>}
    </div>
  );
}
```

## Parameters
- **api** (string): Endpoint that streams JSON matching the schema as chunked text. Can be relative (`/path`) or absolute URL.
- **schema** (Zod Schema | JSON Schema): Defines the shape of the complete object. Pass Zod schema or JSON schema via `jsonSchema` function.
- **id?** (string): Unique identifier for shared state across components. Auto-generated if omitted.
- **initialValue?** (DeepPartial<RESULT>): Initial object value.
- **fetch?** (FetchFunction): Custom fetch function. Defaults to global fetch.
- **headers?** (Record<string, string> | Headers): Headers for API call.
- **credentials?** (RequestCredentials): Fetch credentials mode: "omit", "same-origin", or "include".
- **onError?** ((error: Error) => void): Error callback.
- **onFinish?** ((result: OnFinishResult) => void): Called when streaming finishes. Result contains `object` (typed per schema, may be undefined if invalid) and `error` (TypeValidationError if object doesn't match schema).

## Returns
- **submit** ((input: INPUT) => void): Calls API with input as JSON body.
- **object** (DeepPartial<RESULT> | undefined): Current generated object value, updated as API streams JSON chunks.
- **error** (Error | unknown): Error object if API call fails.
- **isLoading** (boolean): Whether request is in progress.
- **stop** (() => void): Aborts current API request.
- **clear** (() => void): Clears object state.

## Notes
- Experimental feature, available only in React, Svelte, and Vue.
- Object is typed according to the provided schema.
- Streaming updates allow progressive object building as chunks arrive.

### converttomodelmessages
Converts useChat messages to ModelMessage objects; supports multi-modal tool responses via toModelOutput and custom data part conversion with type-safe generics for URL/code attachments.

## convertToModelMessages()

Transforms UI messages from the `useChat` hook into `ModelMessage` objects compatible with AI core functions like `streamText`.

### Basic Usage

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

### API Signature

**Parameters:**
- `messages` (Message[]): Array of UI messages from useChat hook
- `options` (optional): Configuration object with:
  - `tools?: ToolSet`: Enable multi-modal tool responses
  - `convertDataPart?: (part: DataUIPart) => TextPart | FilePart | null`: Transform custom data parts

**Returns:** ModelMessage[] array

### Multi-modal Tool Responses

Tools can return non-text content by implementing `toModelOutput` method:

```ts
import { tool } from 'ai';
import { z } from 'zod';

const screenshotTool = tool({
  parameters: z.object({}),
  execute: async () => 'imgbase64',
  toModelOutput: result => [{ type: 'image', data: result }],
});

const result = streamText({
  model: openai('gpt-4'),
  messages: convertToModelMessages(messages, {
    tools: { screenshot: screenshotTool },
  }),
});
```

### Custom Data Part Conversion

By default, data parts are filtered out. Use `convertDataPart` callback to include them:

```ts
type CustomUIMessage = UIMessage<
  never,
  {
    url: { url: string; title: string; content: string };
    'code-file': { filename: string; code: string; language: string };
  }
>;

const result = streamText({
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

**Use Cases:**
- **URL attachments**: Users attach URLs with fetched content formatted for the model
- **Code files**: Users reference code files as context in conversations
- **Selective inclusion**: Only data parts returning text/file parts are included; others ignored

**Type Safety:** Generic parameter ensures full type safety for custom data parts:

```ts
type MyUIMessage = UIMessage<
  unknown,
  {
    url: { url: string; content: string };
    config: { key: string; value: string };
  }
>;

convertToModelMessages<MyUIMessage>(messages, {
  convertDataPart: part => {
    if (part.type === 'data-url') {
      return { type: 'text', text: part.data.url };
    }
    return null;
  },
});
```

### prunemessages
Filters ModelMessage arrays to reduce token count by removing reasoning, tool calls, and empty messages with configurable strategies per category.

## Purpose
`pruneMessages()` filters and reduces an array of `ModelMessage` objects to optimize context size before sending to an LLM. Common use cases include reducing token count, removing intermediate reasoning, and trimming tool calls and empty messages.

## API Signature
```ts
pruneMessages(options: {
  messages: ModelMessage[]
  reasoning?: 'all' | 'before-last-message' | 'none'
  toolCalls?: 'all' | 'before-last-message' | 'before-last-${number}-messages' | 'none' | PruneToolCallsOption[]
  emptyMessages?: 'keep' | 'remove'
}): ModelMessage[]
```

## Parameters
- **messages**: Array of ModelMessage objects to prune (required)
- **reasoning**: Controls removal of reasoning content from assistant messages
  - `'all'`: Remove all reasoning parts
  - `'before-last-message'`: Keep reasoning only in the last message
  - `'none'`: Retain all reasoning (default)
- **toolCalls**: Prunes tool-call, tool-result, and tool-approval chunks
  - `'all'`: Remove all tool-related content
  - `'before-last-message'`: Remove except in last message
  - `'before-last-N-messages'`: Remove except in last N messages
  - `'none'`: Do not prune
  - Or pass array of `PruneToolCallsOption[]` for per-tool control
- **emptyMessages**: `'keep'` or `'remove'` (default: `'remove'`) - whether to keep messages with no content after pruning

## Returns
Array of pruned `ModelMessage` objects

## Example
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

## Use Cases
- Reduce token consumption by removing reasoning from all but the last message
- Remove tool calls except those in recent messages
- Clean up empty messages after pruning
- Fine-grained control per tool using array option

### createuimessagestream
Function creating a readable stream for UI messages with writer API for emitting chunks, merging streams, error handling, and onFinish callbacks; chunks use consistent IDs across text-start/delta/end lifecycle.

## createUIMessageStream

Creates a readable stream for UI messages with support for message merging, error handling, and completion callbacks.

### Core Functionality

The function accepts an execute function that receives a writer instance to emit UI message chunks. It returns a `ReadableStream<UIMessageChunk>` that handles error propagation, stream merging, and cleanup automatically.

### Writer API

The writer instance provides:
- `write(part: UIMessageChunk)` - Emits a UI message chunk to the stream
- `merge(stream: ReadableStream<UIMessageChunk>)` - Merges another UI message stream into this one
- `onError(error: unknown)` - Error handler for merged streams

### Message Chunks

Messages are written as a sequence of chunks with consistent IDs:
- `text-start` - Begin a text message with an id
- `text-delta` - Append text content with the same id
- `text-end` - Complete the text message with the same id

### Configuration Parameters

- `execute` - Required function receiving the writer to produce message chunks
- `onError` - Optional error handler returning an error message string (defaults to error.message)
- `originalMessages` - Optional array of existing UIMessage objects; when provided, enables persistence mode and generates an ID for the response message
- `onFinish` - Optional callback invoked when streaming completes, receiving:
  - `messages` - Updated UIMessage array
  - `isContinuation` - Boolean indicating if response extends the last original message or creates a new one
  - `responseMessage` - The UIMessage sent to client
- `generateId` - Optional custom ID generator function (uses default if not provided)

### Example

```tsx
const stream = createUIMessageStream({
  async execute({ writer }) {
    writer.write({ type: 'text-start', id: 'msg-1' });
    writer.write({ type: 'text-delta', id: 'msg-1', delta: 'Hello' });
    writer.write({ type: 'text-end', id: 'msg-1' });
    
    const result = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt: 'Write a haiku about AI',
    });
    writer.merge(result.toUIMessageStream());
  },
  onError: error => `Custom error: ${error.message}`,
  originalMessages: existingMessages,
  onFinish: ({ messages, isContinuation, responseMessage }) => {
    console.log('Stream finished:', messages);
  },
});
```

### createuimessagestreamresponse
Creates HTTP Response streaming UI message chunks with custom data, text, sources, and merged LLM streams via writer.write() and writer.merge().

## Purpose
Creates a Response object that streams UI messages to the client, enabling server-side streaming of structured UI data combined with LLM outputs.

## Parameters
- `stream` (required): ReadableStream<UIMessageChunk> - The UI message stream to send to the client
- `status` (optional): number - HTTP status code, defaults to 200
- `statusText` (optional): string - HTTP status text
- `headers` (optional): Headers | Record<string, string> - Additional response headers
- `consumeSseStream` (optional): callback function - Optional handler to consume the Server-Sent Events stream

## Returns
Response object that streams UI message chunks with specified status, headers, and content.

## Usage Example
```tsx
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from 'ai';

const response = createUIMessageStreamResponse({
  status: 200,
  statusText: 'OK',
  headers: {
    'Custom-Header': 'value',
  },
  stream: createUIMessageStream({
    execute({ writer }) {
      // Write custom data
      writer.write({
        type: 'data',
        value: { message: 'Hello' },
      });

      // Write text content
      writer.write({
        type: 'text',
        value: 'Hello, world!',
      });

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

The example demonstrates writing custom data, text content, source information, and merging LLM streams into a single UI message stream response.

### pipeuimessagestreamtoresponse
Pipes ReadableStream<UIMessageChunk> to ServerResponse with HTTP metadata and optional teed stream consumption callback.

## Purpose
Pipes streaming UI message data to a Node.js ServerResponse object, enabling server-side streaming of AI responses.

## Parameters
- `response` (ServerResponse): The Node.js ServerResponse object to pipe data to
- `stream` (ReadableStream<UIMessageChunk>): The UI message stream to pipe
- `status` (number): HTTP status code for the response
- `statusText` (string): HTTP status text for the response
- `headers` (Headers | Record<string, string>): Additional response headers
- `consumeSseStream` (optional function): Callback to independently consume the SSE stream; receives a teed copy of the stream

## Usage
```tsx
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

The function handles the complete piping operation including status, headers, and optional independent stream consumption via the teed stream pattern.

### readuimessagestream
readUIMessageStream converts UIMessageChunk streams to AsyncIterableStream<UIMessage> with optional error handling and message resumption; useful for terminal UIs, custom clients, and RSCs.

## readUIMessageStream

Transforms a stream of `UIMessageChunk`s into an `AsyncIterableStream` of `UIMessage`s.

**Import:**
```tsx
import { readUIMessageStream } from 'ai';
```

**Parameters:**
- `message` (UIMessage, optional): The last assistant message to use as a starting point when the conversation is resumed. Otherwise undefined.
- `stream` (ReadableStream<UIMessageChunk>): The stream of UIMessageChunk objects to read.
- `onError` ((error: unknown) => void, optional): A function that is called when an error occurs during stream processing.
- `terminateOnError` (boolean, optional): Whether to terminate the stream if an error occurs. Defaults to false.

**Returns:**
An `AsyncIterableStream` of `UIMessage`s. Each stream part represents a different state of the same message as it is being completed.

**Use cases:** Terminal UIs, custom stream consumption on the client, React Server Components (RSC), and scenarios outside of Chat.

### inferuitools
Type helper that extracts input/output types from a ToolSet for type-safe UI tool handling; maps each tool to {input, output} types inferred from Zod schemas and execute functions.

## InferUITools

A TypeScript type helper that infers input and output types from a `ToolSet`, enabling type-safe tool usage in `UIMessage`s.

### Import
```tsx
import { InferUITools } from 'ai';
```

### Type Parameters
- `TOOLS` (ToolSet): The tool set to infer types from

### Returns
Maps each tool in the tool set to its inferred input and output types with the shape:
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
    execute: async ({ location }) => {
      return `The weather in ${location} is sunny.`;
    },
  },
  calculator: {
    description: 'Perform basic arithmetic',
    parameters: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    execute: async ({ operation, a, b }) => {
      switch (operation) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide': return a / b;
      }
    },
  },
};

type MyUITools = InferUITools<typeof tools>;
// Results in:
// {
//   weather: { input: { location: string }; output: string };
//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };
// }
```

### Related
- `InferUITool` - Infer types for a single tool
- `useChat` - Chat hook that supports typed tools

### inferuitool
Type helper extracting input/output types from tools for type-safe UIMessage handling

## InferUITool

A type helper that infers the input and output types of a tool for use in UIMessages.

### Import
```tsx
import { InferUITool } from 'ai';
```

### Type Parameters
- `TOOL`: The tool to infer types from

### Returns
A type with the shape:
```typescript
{
  input: InferToolInput<TOOL>;
  output: InferToolOutput<TOOL>;
}
```

### Example
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

### Related Types
- `InferUITools` - for inferring types from a tool set
- `ToolUIPart` - tool part type for UI messages

