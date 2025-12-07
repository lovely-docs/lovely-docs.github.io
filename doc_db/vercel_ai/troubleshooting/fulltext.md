

## Pages

### azure-stream-slow
Azure OpenAI slow streaming: change Azure content filter to "Asynchronous Filter" or use smoothStream() transformation

## Azure OpenAI Slow to Stream

When using OpenAI hosted on Azure, streaming may be slow and arrive in large chunks.

### Cause
This is a Microsoft Azure issue.

### Solutions

1. **Update Content Filtering Settings**: In Azure AI Studio, navigate to "Shared resources" > "Content filters", create a new content filter, and change the "Streaming mode (Preview)" under "Output filter" from "Default" to "Asynchronous Filter".

2. **Use smoothStream transformation**: Apply the `smoothStream` transformation to stream each word individually:

```tsx
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

### client-side_function_calls_not_invoked
Fix for v3.0.20+: add empty `experimental_onFunctionCall` callback to `OpenAIStream` options to restore client-side function call forwarding.

**Issue**: After upgrading to AI SDK v3.0.20 or newer, client-side function calls are no longer invoked when using `OpenAIStream`.

**Solution**: Add a stub for `experimental_onFunctionCall` to `OpenAIStream` to enable correct forwarding of function calls to the client:

```tsx
const stream = OpenAIStream(response, {
  async experimental_onFunctionCall() {
    return;
  },
});
```

### server_actions_in_client_components
Cannot inline `"use server"` in Client Components; export from separate file, pass via props from Server Component, or use `createAI`/`useActions` hooks.

## Problem
Inline `"use server"` annotated Server Actions cannot be defined directly in Client Components.

## Solutions
Three approaches to use Server Actions in Client Components:

1. **Export from separate file**: Define Server Actions in a dedicated file with `"use server"` at the top, then import into Client Component.

2. **Pass through props**: Define Server Actions in a Server Component and pass them down as props to Client Components.

3. **Use createAI and useActions hooks**: Implement a combination of `createAI` and `useActions` hooks to access Server Actions.

## Example
```ts
// actions.ts
'use server';

import { generateText } from 'ai';

export async function getAnswer(question: string) {
  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: question,
  });

  return { answer: text };
}
```

This Server Action can then be imported and used in a Client Component.

### strange-stream-output
AI SDK 3.0.20+ stream protocol outputs raw data format; use streamText().toTextStreamResponse() to get plain text stream.

## Issue
When using custom client code with `StreamingTextResponse` in AI SDK version 3.0.20+, the UI streams raw protocol data like `0: "Je"`, `0: " suis"` instead of plain text.

## Root Cause
AI SDK 3.0.20 switched to a stream data protocol that sends different stream parts to support data, tool calls, etc. The raw protocol response is being displayed instead of parsed text.

## Solutions

**Option 1: Use streamText with toTextStreamResponse()**
```tsx
export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const result = streamText({
    model: openai.completion('gpt-3.5-turbo-instruct'),
    maxOutputTokens: 2000,
    prompt,
  });
  
  return result.toTextStreamResponse();
}
```
This sends a raw text stream instead of the protocol-encoded stream.

**Option 2: Pin to version 3.0.19**
Downgrade to the previous version to keep the raw text stream behavior.

### streamable_ui_errors
Streamable UI errors in server actions are caused by using .ts instead of .tsx file extension; rename to .tsx to enable JSX support.

## Streamable UI Component Errors

When working with streamable UIs in server actions, you may encounter errors such as:
- Variable Not Found
- Cannot find `div`
- `Component` refers to a value, but is being used as a type

**Solution:** These errors typically occur because the file has a `.ts` extension instead of `.tsx`. Streamable UI components require JSX support, which is only enabled in `.tsx` files. Rename your file to use the `.tsx` extension to resolve these issues.

### tool_invocation_missing_result_error
Fix "ToolInvocation must have a result" error by either adding `execute` function to tool or using `useChat` with `addToolOutput` for client-side result handling.

## Issue
When using `generateText()` or `streamText()`, the error "ToolInvocation must have a result" occurs when a tool without an `execute` function is called.

## Cause
Tools require a result before the model can continue. Without a result, the conversation state becomes invalid.

## Solutions

**Option 1: Server-side execution with `execute` function**
```tsx
const tools = {
  weather: tool({
    description: 'Get the weather in a location',
    parameters: z.object({
      location: z.string().describe('The city and state, e.g. "San Francisco, CA"'),
    }),
    execute: async ({ location }) => {
      return { temperature: 72, conditions: 'sunny', location };
    },
  }),
};
```

**Option 2: Client-side execution with `useChat` and `addToolOutput`**
```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';

const { messages, sendMessage, addToolOutput } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  onToolCall: async ({ toolCall }) => {
    if (toolCall.toolName === 'getLocation') {
      try {
        const result = await getLocationData();
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: result,
        });
      } catch (err) {
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          state: 'output-error',
          errorText: 'Failed to get location',
        });
      }
    }
  },
});

// For interactive UI:
const { messages, sendMessage, addToolOutput } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
});

// In JSX:
<button
  onClick={() =>
    addToolOutput({
      tool: 'myTool',
      toolCallId,
      output: { /* result */ },
    })
  }
>
  Confirm
</button>
```

Each tool call must have a corresponding result before the conversation can continue.

### streaming_not_working_when_deployed
Add Transfer-Encoding: chunked and Connection: keep-alive headers to toUIMessageStreamResponse() when streaming fails in deployed environments.

When streaming works locally but fails in deployed environments, the full response is returned all at once instead of being streamed. This is caused by deployment environment configuration issues.

To fix streaming in deployed apps, add HTTP headers to the response:

```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Transfer-Encoding': 'chunked',
    Connection: 'keep-alive',
  },
});
```

The `Transfer-Encoding: chunked` header enables chunked transfer encoding, and `Connection: keep-alive` maintains the connection for streaming.

### streaming_not_working_when_proxied
Disable response compression on streaming endpoints by setting 'Content-Encoding': 'none' header to fix streaming in proxied environments.

## Problem
Streaming doesn't work in local development or proxied deployments. Instead of streaming responses, the full response is returned after a delay.

## Root Cause
Proxy middleware configured to compress responses breaks streaming.

## Solution
Add `'Content-Encoding': 'none'` header to disable compression on streaming responses:

```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Content-Encoding': 'none',
  },
});
```

### timeout_on_vercel
Fix streaming timeouts on Vercel by increasing maxDuration via route export (Next.js) or vercel.json config; Hobby plan capped at 300s, Pro/Enterprise at 800s.

## Issue
Streaming responses get cut off and timeouts occur when deploying to Vercel, despite working locally.

## Root Cause
Vercel's Fluid Compute has a default function duration of 5 minutes (300 seconds) across all plans.

## Solution
Increase the `maxDuration` setting for longer-running processes.

### Next.js (App Router)
Add to your route file:
```tsx
export const maxDuration = 600;
```

### Other Frameworks
Set in `vercel.json`:
```json
{
  "functions": {
    "api/chat/route.ts": {
      "maxDuration": 600
    }
  }
}
```

## Plan Limits
- **Hobby**: Up to 300 seconds (5 minutes)
- **Pro**: Up to 800 seconds (~13 minutes)
- **Enterprise**: Up to 800 seconds (~13 minutes)

Note: Setting `maxDuration` above 300 seconds requires Pro or Enterprise plan.

### unclosed_streams
Call .done() to close streamable UI streams and prevent slow updates

## Problem
Streamable UI created with `createStreamableUI` can be slow to update if the stream is not properly closed.

## Solution
Call the `.done()` method on the stream to close it. This ensures the stream is properly finalized and updates are flushed.

## Example
```tsx
import { createStreamableUI } from '@ai-sdk/rsc';

const submitMessage = async () => {
  'use server';
  const stream = createStreamableUI('1');
  stream.update('2');
  stream.append('3');
  stream.done('4'); // Close the stream
  return stream.value;
};
```

### usechat_failed_to_parse_stream
useChat/useCompletion "Failed to parse stream" error in SDK 3.0.20+: use streamProtocol: 'text' parameter for raw text streams

## Issue
`useChat` or `useCompletion` throws "Failed to parse stream string. Invalid code" error in AI SDK version 3.0.20 or newer.

## Root Cause
AI SDK 3.0.20+ switched to a stream data protocol that supports data, tool calls, etc. The error occurs when:
- Backend uses an older version of AI SDK
- Custom provider supplies a raw text stream
- Using raw LangChain stream results

## Solution
Set the `streamProtocol` parameter to `'text'` to use raw text stream processing instead of the new protocol:

```tsx
const { messages, append } = useChat({ streamProtocol: 'text' });
```

This applies to both `useChat` and `useCompletion` hooks.

### server-action-plain-objects-error
Server Actions can't return non-serializable objects from streamText/streamObject; use createStreamableValue and extract only serializable data.

## Problem
When using `streamText` or `streamObject` with Server Actions, you get an error: `"only plain objects and a few built ins can be passed from client components"`. This occurs because these functions return non-serializable objects with methods and complex structures that cannot be passed from Server Actions to Client Components.

## Solution
Extract only serializable data from the Server Action result instead of returning the entire object. Use `createStreamableValue` to wrap the data so it can be safely passed to the client.

The key is ensuring only serializable data (like plain text) crosses the Server Action boundary, not objects with methods or complex internal structures.

### usechat_no_response
useChat tool calls logged but no model response: convert messages with convertToModelMessages() before streamText()

## Problem
When using `useChat`, tool calls and tool results appear in server logs, but the model doesn't respond with anything.

## Solution
Convert incoming messages to `ModelMessage` format using the `convertToModelMessages` function before passing them to `streamText`.

### Example
```tsx
import { openai } from '@ai-sdk/openai';
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

The key change is wrapping the incoming `messages` with `convertToModelMessages()` before passing to `streamText()`. This ensures the message format is compatible with the model.

### usechat_custom_request_options
useChat requires DefaultChatTransport for custom headers/body/credentials; use request-level options for dynamic values, hook-level for static; request options override hook options.

## Problem
The `useChat` hook no longer supports direct `headers`, `body`, and `credentials` options on the hook itself.

## Solutions

**Option 1: Request-Level Configuration (Recommended for Dynamic Values)**
Pass options when calling `sendMessage`:
```tsx
const { messages, sendMessage } = useChat();

sendMessage(
  { text: input },
  {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'X-Request-ID': generateRequestId(),
    },
    body: {
      temperature: 0.7,
      max_tokens: 100,
      user_id: getCurrentUserId(),
      sessionId: getCurrentSessionId(),
    },
  },
);
```

**Option 2: Hook-Level Configuration with Static Values**
Use `DefaultChatTransport` for values that don't change:
```tsx
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: {
      'X-API-Version': 'v1',
      'X-App-ID': 'my-app',
    },
    body: {
      model: 'gpt-5.1',
      stream: true,
    },
    credentials: 'include',
  }),
});
```

**Option 3: Hook-Level Configuration with Functions**
Use functions for dynamic values at hook level (request-level preferred):
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: () => ({
      Authorization: `Bearer ${getAuthToken()}`,
      'X-User-ID': getCurrentUserId(),
    }),
    body: () => ({
      sessionId: getCurrentSessionId(),
      preferences: getUserPreferences(),
    }),
    credentials: () => (isAuthenticated() ? 'include' : 'same-origin'),
  }),
});
```

## Combining Hook and Request Level Options
Request-level options override hook-level options:
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: { 'X-API-Version': 'v1' },
    body: { model: 'gpt-5.1' },
  }),
});

sendMessage(
  { text: input },
  {
    headers: { 'X-API-Version': 'v2', 'X-Request-ID': '123' },
    body: { model: 'gpt-5-mini', temperature: 0.5 },
  },
);
```

For dynamic component state, use request-level configuration. For hook-level functions with changing state, consider using `useRef` to store current values.

### typescript-performance-zod
Zod compatibility issue with AI SDK 5 causes TypeScript performance degradation; fix with Zod 4.1.8+ or `moduleResolution: "nodenext"` in tsconfig.json

## TypeScript Performance Issues with Zod

When using AI SDK 5 with Zod, you may encounter:
- TypeScript server crashes or hangs
- Extremely slow type checking in files importing AI SDK functions
- "Type instantiation is excessively deep and possibly infinite" errors
- IDE becoming unresponsive

### Root Cause
AI SDK 5 has specific compatibility requirements with Zod versions. Using the standard import path (`import { z } from 'zod'`) can cause TypeScript's type inference to become excessively complex due to different module resolution settings causing Zod declarations to load twice, leading to expensive structural comparisons.

### Solutions

**Primary: Upgrade Zod**
```bash
pnpm add zod@^4.1.8
```
Zod 4.1.8+ includes a fix for the module resolution issue.

**Alternative: Update TypeScript Configuration**
If upgrading Zod isn't possible, update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "nodenext"
  }
}
```
This resolves performance issues while keeping the standard Zod import.

### usechat-error-occurred-masking
Error messages masked by default in toDataStreamResponse; use getErrorMessage callback with toUIMessageStreamResponse or onError with createDataStreamResponse to expose details.

## Problem
When using `useChat`, generic "An error occurred" error messages appear instead of detailed error information.

## Root Cause
Error messages from `streamText` are masked by default when using `toDataStreamResponse` for security reasons to prevent leaking sensitive information to the client.

## Solution
Use the `getErrorMessage` function to forward error details to the client or log errors.

### Error Handler Implementation
```tsx
export function errorHandler(error: unknown) {
  if (error == null) {
    return 'unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
```

### With streamText and toUIMessageStreamResponse
```tsx
const result = streamText({
  // ...
});

return result.toUIMessageStreamResponse({
  getErrorMessage: errorHandler,
});
```

### With createDataStreamResponse
```tsx
const response = createDataStreamResponse({
  // ...
  async execute(dataStream) {
    // ...
  },
  onError: errorHandler,
});
```

### repeated_assistant_messages_in_usechat
Fix duplicate assistant messages in useChat by passing originalMessages to toUIMessageStreamResponse() to reuse message IDs instead of generating new ones.

## Problem
When using `useChat` with `streamText` on the server, assistant messages appear duplicated in the UI - showing both previous and new messages, or the same message multiple times. This occurs because `toUIMessageStreamResponse` generates new message IDs for each message.

## Solution
Pass the original messages array to `toUIMessageStreamResponse` using the `originalMessages` option. This allows the method to reuse existing message IDs instead of generating new ones, ensuring the client updates existing messages rather than creating duplicates.

## Example
```tsx
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
    tools: {
      weather: {
        description: 'Get the weather for a location',
        parameters: z.object({
          location: z.string(),
        }),
        execute: async ({ location }) => {
          return { temperature: 72, condition: 'sunny' };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => {
      saveChat({ id, messages });
    },
  });
}
```

### stream-abort-onfinish-callback
Fix onFinish not executing on stream abort by adding consumeSseStream: consumeStream to toUIMessageStreamResponse config; use isAborted parameter to handle abort-specific cleanup.

## Problem
When using `toUIMessageStreamResponse` with an `onFinish` callback, the callback doesn't execute when the stream is aborted because the abort handler immediately terminates the response.

## Solution
Add `consumeStream` to the `toUIMessageStreamResponse` configuration to ensure abort events are properly captured and forwarded to the `onFinish` callback.

## Example
```tsx
import { consumeStream } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log('Stream was aborted');
      } else {
        console.log('Stream completed normally');
      }
    },
    consumeSseStream: consumeStream, // Enables onFinish to be called on abort
  });
}
```

The `isAborted` parameter in the `onFinish` callback indicates whether the stream was aborted, allowing for abort-specific cleanup operations.

### tool_calling_with_structured_outputs
Tool calling with structured outputs requires generateText/streamText + output option; adjust stopWhen step count to include structured output generation step.

## Problem
`generateObject` and `streamObject` don't support tool calling. To combine tool calling with structured outputs, you must use `generateText` or `streamText` with the `output` option instead.

## Key Detail
When using `output` with tool calling, structured output generation counts as an additional execution step. This affects the `stopWhen` condition.

## Solution
Adjust `stopWhen` to account for the extra step:

```tsx
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      sentiment: z.enum(['positive', 'neutral', 'negative']),
    }),
  }),
  tools: {
    analyze: tool({
      description: 'Analyze data',
      inputSchema: z.object({
        data: z.string(),
      }),
      execute: async ({ data }) => {
        return { result: 'analyzed' };
      }),
    },
  },
  stopWhen: stepCountIs(3), // tool call + tool result + structured output
  prompt: 'Analyze the data and provide a summary',
});
```

The `stopWhen: stepCountIs(3)` accounts for: tool call execution, tool result processing, and structured output generation. Increment your intended step count by at least 1 to accommodate the structured output step.

### abort-breaks-resumable-streams
useChat's resume and abort features are mutually exclusive; choose one based on whether you need stream persistence across reloads or manual stop capability.

## Issue

`useChat` with `resume: true` for stream resumption is incompatible with abort functionality. When a page is closed, refreshed, or `stop()` is called, the browser sends an abort signal that breaks the resumption mechanism.

```tsx
const { messages, stop } = useChat({
  id: chatId,
  resume: true, // Conflicts with abort
});
// Closing tab triggers abort, preventing stream resumption
```

## Workaround

Choose one approach based on requirements:

**Option 1: Stream resumption without abort**
```tsx
const { messages, sendMessage } = useChat({
  id: chatId,
  resume: true,
});
```

**Option 2: Abort without stream resumption**
```tsx
const { messages, sendMessage, stop } = useChat({
  id: chatId,
  resume: false,
});
```

The team is exploring solutions but currently both features cannot be used together.

### streamtext-silent-failures
streamText doesn't throw errors; use onError callback to log them since errors become part of the stream to prevent server crashes.

## streamText Silent Failures

`streamText` starts streaming immediately without waiting for the model, which means errors become part of the stream rather than being thrown. This prevents server crashes but can make debugging difficult since errors won't surface as exceptions.

To capture and log errors, use the `onError` callback:

```tsx
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  onError({ error }) {
    console.error(error); // your error logging logic here
  },
});
```

The stream will only contain error parts if something goes wrong, so monitoring the `onError` callback is essential for troubleshooting.

### streaming-status-delay
useChat status changes to "streaming" on connection before text arrives; conditionally show loader by checking if last assistant message has content parts

## Problem
When using `useChat`, the status immediately changes to "streaming" but no text appears for several seconds.

## Root Cause
The status changes to "streaming" as soon as the server connection is established and streaming begins, including metadata streaming before LLM tokens arrive.

## Solution
Create a custom loading state that checks if the last assistant message contains actual content:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';

export default function Page() {
  const { messages, status } = useChat();
  const lastMessage = messages.at(-1);
  
  const showLoader =
    status === 'streaming' &&
    lastMessage?.role === 'assistant' &&
    lastMessage?.parts?.length === 0;

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null,
          )}
        </div>
      ))}
      {showLoader && <div>Loading...</div>}
    </>
  );
}
```

Alternative: check for specific part types:
```tsx
const showLoader =
  status === 'streaming' &&
  lastMessage?.role === 'assistant' &&
  !lastMessage?.parts?.some(part => part.type === 'text');
```

### usechat_stale_body_data
useChat body parameter captures values at initialization; pass dynamic values to sendMessage's second argument instead, or use useRef with hook-level function config.

## Problem
When passing dynamic information via the `body` parameter to `useChat`, the data becomes stale because the body configuration is captured once during hook initialization and doesn't update with component re-renders.

```tsx
// Problematic - body values stay at initial render
const [temperature, setTemperature] = useState(0.7);
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: { temperature }, // Always 0.7, never updates
  }),
});
```

## Solution 1: Request-level options (recommended)
Pass dynamic values as the second argument to `sendMessage` instead of hook-level configuration. Request-level options are evaluated on each call and take precedence.

```tsx
const [temperature, setTemperature] = useState(0.7);
const [userId, setUserId] = useState('user123');
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

sendMessage(
  { text: input },
  {
    body: {
      temperature, // Current value at request time
      userId,
    },
  },
);
```

## Solution 2: Hook-level with functions and refs
If hook-level configuration is needed, use functions that return values. For component state, access current values via `useRef`:

```tsx
const temperatureRef = useRef(0.7);
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: () => ({
      temperature: temperatureRef.current,
      sessionId: getCurrentSessionId(),
    }),
  }),
});
```

## Server-side handling
Destructure custom fields from the request body:

```tsx
export async function POST(req: Request) {
  const { messages, temperature, userId } = await req.json();
  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
    temperature,
  });
  return result.toUIMessageStreamResponse();
}
```

### ontoolcall_type_narrowing
Fix TypeScript type errors in onToolCall by checking toolCall.dynamic to narrow toolName type from string to specific static tool names before passing to addToolOutput.

## Problem

When using `onToolCall` callback with TypeScript and both static and dynamic tools, passing `toolCall.toolName` directly to `addToolOutput` causes a type error because TypeScript cannot narrow the type from generic `string` to the specific literal types of your static tools.

```tsx
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    addToolOutput({
      tool: toolCall.toolName, // Error: Type 'string' is not assignable to '"getWeatherInformation" | "yourOtherTool"'
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

## Solution

Check `toolCall.dynamic` first to enable type narrowing:

```tsx
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    if (toolCall.dynamic) {
      return;
    }
    // Now TypeScript knows this is a static tool
    addToolOutput({
      tool: toolCall.toolName, // No error
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

The same approach applies to the deprecated `addToolResult` method.

### unsupported-model-version-error
AI SDK 5 requires v2 specification; error occurs when provider packages aren't updated to 2.0.0+; update ai@5.0.0+, @ai-sdk/*@2.0.0+, @ai-sdk/provider@2.0.0+, zod@4.1.8+.

## Issue
When migrating to AI SDK 5, you may encounter `AI_UnsupportedModelVersionError` stating that your model uses an unsupported version:
```
AI_UnsupportedModelVersionError: Unsupported model version v1 for provider "ollama.chat" and model "gamma3:4b".
AI SDK 5 only supports models that implement specification version "v2".
```

This occurs because your provider package implements the older v1 model specification.

## Root Cause
AI SDK 5 requires all provider packages to implement specification version v2. Upgrading to AI SDK 5 without updating provider packages leaves them on v1 specification, causing the error.

## Solution
Update all `@ai-sdk/*` provider packages to compatible versions:

```bash
pnpm install ai@latest @ai-sdk/openai@latest @ai-sdk/anthropic@latest
```

Required versions for AI SDK 5 compatibility:
- `ai` package: `5.0.0` or later
- `@ai-sdk/*` packages: `2.0.0` or later (e.g., `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`)
- `@ai-sdk/provider` package: `2.0.0` or later
- `zod` package: `4.1.8` or later

For third-party or custom providers, verify v2 support by:
1. Checking provider's package.json for `@ai-sdk/provider` peer dependency version `2.0.0` or later
2. Reviewing provider's changelog or migration guide
3. Checking provider's repository for AI SDK 5 support

### object-generation-failed-with-openai
OpenAI structured outputs reject Zod schemas with `.nullish()` or `.optional()`; use `.nullable()` instead.

## NoObjectGeneratedError with OpenAI Structured Outputs

When using `generateObject` or `streamObject` with OpenAI's structured output generation, you may encounter a `NoObjectGeneratedError` with finish reason `content-filter`. This occurs when your Zod schema contains incompatible types.

### Problematic Code
```typescript
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullish(), // ❌ not supported
    email: z.string().optional(), // ❌ not supported
    age: z.number().nullable(), // ✅ supported
  }),
  prompt: 'Generate a user profile',
});
// Error: NoObjectGeneratedError: No object generated.
// Finish reason: content-filter
```

### Root Cause
OpenAI's structured output uses JSON Schema with specific compatibility requirements. The Zod methods `.nullish()` and `.optional()` generate JSON Schema patterns incompatible with OpenAI's implementation, causing the model to reject the schema.

### Solution
Replace `.nullish()` and `.optional()` with `.nullable()`:

```typescript
const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullable(), // ✅ instead of .nullish()
    email: z.string().nullable(), // ✅ instead of .optional()
    age: z.number().nullable(),
  }),
  prompt: 'Generate a user profile',
});

console.log(result.object);
// { name: "John Doe", email: "john@example.com", age: 30 }
// or { name: null, email: null, age: 25 }
```

### Schema Type Compatibility

| Zod Type      | Compatible | Behavior                                   |
| ------------- | ---------- | ------------------------------------------ |
| `.nullable()` | ✅ Yes     | Allows `null` or the specified type        |
| `.optional()` | ❌ No      | Field can be omitted (not supported)       |
| `.nullish()`  | ❌ No      | Allows `null`, `undefined`, or omitted     |

### model-not-assignable-to-language-model-v1
Type incompatibility error when SDK updates add new model specification features; resolve by updating provider packages and SDK.

## Model Type Incompatibility Error

When updating the AI SDK, you may encounter: `Type 'SomeModel' is not assignable to type 'LanguageModelV1'.`

Similar errors can occur with `EmbeddingModelV3`.

### Cause
New features are periodically added to the model specification, which can cause incompatibilities between older provider versions and newer SDK versions.

### Solution
Update both your provider packages and the AI SDK to the latest version to resolve the type mismatch.

### typescript_cannot_find_namespace_jsx
Fix "Cannot find namespace 'JSX'" error in non-React projects by installing @types/react; this dependency will be removed in next major version.

## Issue
When using the AI SDK in non-React projects (e.g., Hono servers), TypeScript throws: `error TS2503: Cannot find namespace 'JSX'.`

## Root Cause
The AI SDK depends on `@types/react`, which defines the JSX namespace. This dependency will be removed in the next major version.

## Solution
Install `@types/react` as a dependency:
```bash
npm install @types/react
```

### react_maximum_update_depth_exceeded
Fix "Maximum update depth exceeded" in useChat/useCompletion by throttling updates with experimental_throttle option (milliseconds).

## Issue
When using `useChat` or `useCompletion` hooks in React, streaming AI responses cause a "Maximum update depth exceeded" error.

## Root Cause
By default, the UI re-renders on every incoming chunk, which can overload rendering especially on slower devices or with complex components like Markdown.

## Solution
Use the `experimental_throttle` option to throttle UI updates to a specified millisecond interval:

```tsx
// useChat
const { messages, ... } = useChat({
  experimental_throttle: 50
})

// useCompletion
const { completion, ... } = useCompletion({
  experimental_throttle: 50
})
```

Set the throttle value (in milliseconds) to reduce update frequency and prevent the depth exceeded error.

### jest_module_resolution_for_rsc
Fix Jest "Cannot find module '@ai-sdk/rsc'" error by mapping the module path in jest.config.js moduleNameMapper to node_modules/@ai-sdk/rsc/dist

When using AI SDK RSC with Jest for testing RSC components, you may encounter the error "Cannot find module '@ai-sdk/rsc'". This occurs because Jest cannot resolve the module path correctly.

To fix this, configure Jest's module resolution in your jest.config.js file by adding a moduleNameMapper entry that maps the '@ai-sdk/rsc' module to its actual distribution path:

```json
"moduleNameMapper": {
  "^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"
}
```

This tells Jest where to find the '@ai-sdk/rsc' module when running tests.

