

## Pages

### azure_openai_slow_to_stream
Azure OpenAI slow streaming: update content filter to "Asynchronous Filter" in Azure AI Studio, or use smoothStream() transformation

When using OpenAI hosted on Azure, streaming may be slow and arrive in large chunks. This is a Microsoft Azure issue.

**Root Cause**: Azure's default content filtering settings can cause slow streaming behavior.

**Fix - Update Azure Content Filtering**:
1. Go to Azure AI Studio (ai.azure.com)
2. Navigate to "Shared resources" > "Content filters"
3. Create a new content filter
4. Under "Output filter", change "Streaming mode (Preview)" from "Default" to "Asynchronous Filter"

**Alternative Solution - Use smoothStream Transformation**:
Apply the `smoothStream` transformation to stream each word individually instead of in chunks:

```tsx
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

The `smoothStream()` transformation is passed to the `experimental_transform` parameter of `streamText()`.

### client-side_function_calls_not_invoked
Fix missing client-side function calls in OpenAIStream v3.0.20+ by adding experimental_onFunctionCall stub

When upgrading to AI SDK v3.0.20 or newer, client-side function calls may stop being invoked when using OpenAIStream. This occurs because the function call forwarding mechanism to the client is not properly enabled.

To fix this issue, add a stub for `experimental_onFunctionCall` to the OpenAIStream options:

```tsx
const stream = OpenAIStream(response, {
  async experimental_onFunctionCall() {
    return;
  },
});
```

This empty async function enables the correct forwarding of function calls from the stream to the client side, restoring the expected behavior after the upgrade.

### server_actions_in_client_components
Server Actions must be exported from separate files or passed via props to Client Components; inline `"use server"` definitions in Client Components are not allowed.

## Problem
Inline `"use server"` annotated Server Actions cannot be defined directly in Client Components.

## Solutions
Three approaches to use Server Actions in Client Components:

1. **Export from separate file**: Create a dedicated file with `"use server"` at the top level, then import and use the exported functions in your Client Component.

2. **Pass through props**: Define Server Actions in a Server Component and pass them down as props to Client Components.

3. **Use createAI and useActions hooks**: Implement a combination of the `createAI` and `useActions` hooks from the AI SDK to access Server Actions.

## Example
```ts
// actions.ts
'use server';

import { generateText } from 'ai';

export async function getAnswer(question: string) {
  'use server';

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: question,
  });

  return { answer: text };
}
```

This file can then be imported and used in Client Components. The `"use server"` directive at the file level marks all exports as Server Actions.

### stream_output_contains_protocol_markers_instead_of_text
SDK 3.0.20+ stream protocol shows raw format (0: "text") instead of plain text; use streamText().toTextStreamResponse() or revert to 3.0.19

When using custom client code with `StreamingTextResponse` in AI SDK version 3.0.20 or newer, the streamed output may display raw stream data protocol format like `0: "Je"`, `0: " suis"` instead of plain text.

**Root cause**: AI SDK 3.0.20 switched to a stream data protocol that sends different stream parts to support data, tool calls, and other features. What appears in the UI is the raw protocol response.

**Solutions**:

1. Use the `streamText` function from AI Core to send a raw text stream:
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

2. Pin the AI SDK version to 3.0.19 to keep the raw text stream behavior.

### streamable_ui_errors
Streamable UI errors in server actions are caused by using `.ts` instead of `.tsx` file extension; rename to `.tsx`.

## Streamable UI Component Errors

When working with streamable UIs in server actions, you may encounter errors such as:
- Variable Not Found
- Cannot find `div`
- `Component` refers to a value, but is being used as a type

These errors typically occur when the file has a `.ts` extension instead of `.tsx`. Streamable UI components require JSX support, which is only available in `.tsx` files. Rename your file to use the `.tsx` extension to resolve these issues.

### tool_invocation_missing_result_error
Fix "ToolInvocation must have a result" by either adding `execute` functions to tools or providing results via `addToolOutput` in `useChat`'s `onToolCall` handler.

## Tool Invocation Missing Result Error

When using `generateText()` or `streamText()`, the error "ToolInvocation must have a result" occurs when a tool without an `execute` function is called but no result is provided.

### Root Cause
Each tool invocation requires the model to receive a result before continuing. Without a result, the model cannot determine success/failure and the conversation state becomes invalid.

### Solutions

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
```

For interactive UI elements, call `addToolOutput` from event handlers:
```tsx
const { messages, sendMessage, addToolOutput } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
});

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

**Critical**: Every tool call must have a corresponding result before conversation continues. When handling tools client-side, don't await inside `onToolCall` to avoid deadlocks.

### streaming_not_working_when_deployed
Fix deployed streaming by adding Transfer-Encoding: chunked and Connection: keep-alive headers to toUIMessageStreamResponse()

When streaming works locally but fails in deployed environments, the full response returns after a delay instead of streaming incrementally. This is caused by deployment environment configurations that don't properly support streaming responses.

To fix this, add HTTP headers to the response:
```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Transfer-Encoding': 'chunked',
    Connection: 'keep-alive',
  },
});
```

The `Transfer-Encoding: chunked` header enables chunked transfer encoding for streaming, and `Connection: keep-alive` maintains the connection for multiple chunks.

### streaming_not_working_when_proxied
Proxy middleware compression breaks streaming; disable with 'Content-Encoding': 'none' header in toUIMessageStreamResponse()

When using the AI SDK in a proxied environment (local development or deployed behind a proxy), streaming responses may fail and return only the full response after a delay instead of streaming incrementally.

**Cause**: Proxy middleware configured to compress responses breaks streaming functionality.

**Solution**: Disable content encoding by adding the `'Content-Encoding': 'none'` header to the streaming response:

```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Content-Encoding': 'none',
  },
});
```

This header configuration only affects the streaming API and prevents the proxy from compressing the response, allowing streaming to work correctly.

### getting_timeouts_when_deploying_on_vercel
Fix streaming timeouts on Vercel by increasing maxDuration (Next.js: export const maxDuration = 600; or vercel.json config); default 300s, Pro/Enterprise up to 800s.

## Problem
Streaming responses work locally but get cut off when deployed to Vercel, with timeouts or "Connection closed" errors appearing in logs.

## Root Cause
Vercel's Fluid Compute has a default function duration limit of 5 minutes (300 seconds) across all plans. Longer streaming responses exceed this limit.

## Solution
Increase the `maxDuration` setting to extend the timeout.

### Next.js (App Router)
Add to your route file or Server Action page:
```tsx
export const maxDuration = 600;
```

### Other Frameworks
Configure in `vercel.json`:
```json
{
  "functions": {
    "api/chat/route.ts": {
      "maxDuration": 600
    }
  }
}
```

## Duration Limits by Plan
- **Hobby**: Up to 300 seconds (5 minutes)
- **Pro**: Up to 800 seconds (~13 minutes)
- **Enterprise**: Up to 800 seconds (~13 minutes)

Note: Setting `maxDuration` above 300 seconds requires Pro or Enterprise plan.

### unclosed_streams
Call `.done()` on streamable UI to close streams and fix slow updates.

## Problem
Streamable UI created with `createStreamableUI` can be slow to update when the stream is not properly closed.

## Solution
Call the `.done()` method on the stream object to close it. This ensures the stream is properly terminated and updates are flushed.

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

The `.done()` method accepts an optional final value to send before closing.

### usechat_failed_to_parse_stream
Fix "Failed to parse stream string" error by setting `streamProtocol: 'text'` in useChat/useCompletion when using incompatible stream sources (old SDK versions, custom providers, LangChain).

## Issue
When using `useChat` or `useCompletion` with AI SDK version 3.0.20 or newer, you may encounter a "Failed to parse stream string. Invalid code" error.

## Root Cause
The AI SDK switched to a stream data protocol in version 3.0.20. The `useChat` and `useCompletion` hooks expect stream parts that support data, tool calls, and other features. The error occurs when the stream format doesn't match this protocol. Common causes include:
- Using an older version of the AI SDK in the backend
- Providing a text stream using a custom provider
- Using a raw LangChain stream result

## Solution
Switch `useChat` and `useCompletion` to raw text stream processing by setting the `streamProtocol` parameter to `'text'`:

```tsx
const { messages, append } = useChat({ streamProtocol: 'text' });
```

This allows the hooks to process plain text streams instead of expecting the structured stream data protocol format.

### server_action_plain_objects_error
Fix "only plain objects" Server Action error with streamText/streamObject by using createStreamableValue to wrap serializable data.

## Problem
When using `streamText` or `streamObject` with Server Actions, you get an error: "only plain objects and a few built ins can be passed from client components". This occurs because these functions return non-serializable objects with methods and complex structures that cannot be passed from Server Actions to Client Components.

## Solution
Extract only serializable data from the Server Action result instead of returning the entire object. Use `createStreamableValue` to wrap data that needs to be streamed to the client, ensuring only serializable content (like text) is passed across the server-client boundary.

## Example
Instead of directly returning the streamText result object, use createStreamableValue to create a wrapper that can safely serialize and stream the text data to the client component.

### usechat_no_response
Fix useChat no response by converting messages to ModelMessage format with convertToModelMessages before streamText

When using `useChat`, if tool calls and tool results appear in server logs but the model doesn't respond, the issue is that incoming messages need to be converted to the `ModelMessage` format before being passed to `streamText`.

Use the `convertToModelMessages` function to convert messages before streaming:

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

The `convertToModelMessages` function transforms the UI message format (which includes tool calls and results) into the format expected by language models, allowing the model to properly process the conversation context and generate a response.

### custom_headers,_body,_and_credentials_not_working_with_usechat
useChat no longer accepts direct headers/body/credentials; use DefaultChatTransport for static values or pass options to sendMessage() for dynamic values; request-level options override hook-level.

## Problem
The `useChat` hook no longer supports direct configuration of `headers`, `body`, and `credentials` options on the hook itself. These options are silently ignored.

## Solution: Three Approaches

**Option 1: Request-Level Configuration (Recommended for Dynamic Values)**
Pass options when calling `sendMessage()` for values that change over time:
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
import { useChat } from '@ai-sdk/react';
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
Use functions for dynamic values at hook level (request-level is generally preferred):
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

## Precedence
Request-level options override hook-level options. You can combine both approaches:
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    headers: { 'X-API-Version': 'v1' },
    body: { model: 'gpt-5.1' },
  }),
});

sendMessage(
  { text: input },
  {
    headers: { 'X-API-Version': 'v2' }, // Overrides hook-level
    body: { model: 'gpt-5-mini' }, // Overrides hook-level
  },
);
```

For component state that changes, use request-level configuration. If using hook-level functions with changing state, consider `useRef` to store current values.

### typescript_performance_issues_with_zod
Zod 4.1.8+ or `moduleResolution: "nodenext"` fixes TypeScript performance crashes with AI SDK 5.

## Issue
When using AI SDK 5 with Zod, TypeScript may crash, hang, or become unresponsive with errors like "Type instantiation is excessively deep and possibly infinite" due to slow type checking in files importing AI SDK functions.

## Root Cause
AI SDK 5 has specific compatibility requirements with Zod versions. Standard Zod imports (`import { z } from 'zod'`) can cause TypeScript's type inference to become excessively complex. Different module resolution settings cause TypeScript to load the same Zod declarations twice, leading to expensive structural comparisons.

## Solutions

**Primary: Upgrade Zod to 4.1.8 or later**
```bash
pnpm add zod@^4.1.8
```
This version includes a fix for the module resolution issue.

**Alternative: Update TypeScript configuration**
If upgrading Zod isn't possible, update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "moduleResolution": "nodenext"
  }
}
```
This resolves performance issues while keeping standard Zod imports.

### usechat_"an_error_occurred"_troubleshooting
Pass `getErrorMessage` to `toUIMessageStreamResponse()` or `onError` to `createDataStreamResponse()` to unmask error details from `streamText` instead of showing generic "An error occurred".

## Problem
When using `useChat`, a generic "An error occurred" error message is displayed instead of detailed error information.

## Root Cause
Error messages from `streamText` are masked by default when using `toDataStreamResponse` for security reasons. This prevents sensitive information from leaking to the client.

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
When using `useChat` with `streamText` on the server, assistant messages appear duplicated in the UI—showing both previous and new messages, or repeating the same message multiple times. This occurs with tool calls or complex message flows.

## Root Cause
`toUIMessageStreamResponse` generates new message IDs for each message, causing the client to treat them as new messages instead of updates to existing ones.

## Solution
Pass the original messages array to `toUIMessageStreamResponse` via the `originalMessages` option. This allows the method to reuse existing message IDs instead of generating new ones, ensuring the client updates existing messages rather than creating duplicates.

## Implementation
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

The key change is passing `originalMessages: messages` to `toUIMessageStreamResponse()` to prevent duplicate message IDs.

### onfinish_not_called_when_stream_is_aborted
Use `consumeSseStream: consumeStream` in `toUIMessageStreamResponse` to ensure `onFinish` callback executes when stream is aborted.

## Problem
When using `toUIMessageStreamResponse` with an `onFinish` callback, the callback doesn't execute when the stream is aborted. The abort handler immediately terminates the response before `onFinish` can run, preventing cleanup operations.

## Root Cause
Stream abortion immediately terminates the response without allowing the `onFinish` callback to execute, blocking important cleanup like saving partial results or logging abort events.

## Solution
Add `consumeStream` to the `toUIMessageStreamResponse` configuration to ensure abort events are properly captured and forwarded to `onFinish`:

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
        // Handle abort-specific cleanup
      } else {
        console.log('Stream completed normally');
        // Handle normal completion
      }
    },
    consumeSseStream: consumeStream, // Enables onFinish on abort
  });
}
```

The `consumeSseStream: consumeStream` parameter ensures the `onFinish` callback executes even when the stream is aborted, allowing the `isAborted` flag to be properly checked and abort-specific cleanup to run.

### tool_calling_with_structured_outputs
Combine tool calling with structured outputs using generateText/streamText + output option; adjust stopWhen to account for extra structured output generation step.

## Problem
`generateObject` and `streamObject` don't support tool calling. To combine tool calling with structured outputs, you must use `generateText` or `streamText` with the `output` option instead.

## Key Consideration
When using `output` with tool calling, structured output generation counts as an additional step in the execution flow. This affects the `stopWhen` condition.

## Solution
Adjust your `stopWhen` condition to account for the extra step. Add at least 1 to your intended step count:

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

The execution flow includes: tool call → tool result → structured output generation. Plan your `stopWhen` accordingly.

### abort_breaks_resumable_streams
Abort signals break stream resumption in useChat; must choose between resume: true or abort functionality, not both.

## Issue
When using `useChat` with `resume: true` for stream resumption, the abort functionality breaks. Closing a tab, refreshing the page, or calling the `stop()` function triggers an abort signal that interferes with the resumption mechanism, preventing streams from being properly resumed.

## Root Cause
When a page is closed or refreshed, the browser automatically sends an abort signal, which breaks the resumption flow.

## Current Limitation
Abort functionality and stream resumption are incompatible. Choose one based on your application's requirements.

## Option 1: Stream resumption without abort
For long-running generations that persist across page reloads:
```tsx
const { messages, sendMessage } = useChat({
  id: chatId,
  resume: true,
});
```

## Option 2: Abort without stream resumption
For allowing users to stop streams manually:
```tsx
const { messages, sendMessage, stop } = useChat({
  id: chatId,
  resume: false,
});
```

Related topics: Chatbot Resume Streams, Stopping Streams

### streamtext_fails_silently
streamText fails silently because errors are streamed instead of thrown; use onError callback to log them

## Problem
`streamText` function does not work - it fails silently without throwing errors, and the stream only contains error parts.

## Why This Happens
`streamText` immediately starts streaming to enable sending data without waiting for the model. Errors become part of the stream rather than being thrown, which prevents servers from crashing when errors occur.

## Solution
Use the `onError` callback to capture and log errors:

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

The `onError` callback is triggered whenever an error occurs during streaming, allowing you to implement custom error logging or handling logic.

### streaming_status_shows_but_no_text_appears
useChat status changes to "streaming" on connection/metadata before LLM tokens arrive; create custom loader checking if lastMessage.parts has content using `lastMessage?.parts?.length === 0` or `!lastMessage?.parts?.some(part => part.type === 'text')`

## Problem
When using `useChat`, the status immediately changes to "streaming" but no text appears for several seconds. This occurs because the status changes as soon as the server connection is established and streaming begins, including metadata streaming before actual LLM tokens arrive.

## Solution
Create a custom loading state that checks if the last assistant message contains actual content before showing a loader:

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

Alternative: check for specific part types to wait for text content specifically:

```tsx
const showLoader =
  status === 'streaming' &&
  lastMessage?.role === 'assistant' &&
  !lastMessage?.parts?.some(part => part.type === 'text');
```

The key is checking `lastMessage?.parts?.length` or filtering by `part.type === 'text'` to distinguish between metadata streaming and actual content streaming.

### stale_body_values_with_usechat
useChat hook-level body config is stale; pass dynamic values via sendMessage's second argument instead, or use useRef with a function for hook-level config.

## Problem
When passing dynamic information via the `body` parameter at the `useChat` hook level, the data becomes stale and only reflects values from the initial component render. The body configuration is captured once during hook initialization and doesn't update with subsequent re-renders.

Example of problematic code:
```tsx
const [temperature, setTemperature] = useState(0.7);
const [userId, setUserId] = useState('user123');

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: {
      temperature, // Always 0.7 (initial value)
      userId, // Always 'user123' (initial value)
    },
  }),
});
```

Even when `temperature` or `userId` state changes, requests still use the initial values.

## Solution: Request-level options
Pass dynamic variables via the second argument of `sendMessage` instead. Request-level options are evaluated on each call and take precedence over hook-level options:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});

sendMessage(
  { text: input },
  {
    body: {
      temperature, // Current value at request time
      userId, // Current value at request time
    },
  },
);
```

## Alternative: Dynamic hook-level configuration with useRef
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
Retrieve custom fields by destructuring the request body:

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

**Recommendation:** Use request-level configuration for dynamic component state values—it's simpler and more reliable than hook-level configuration.

### type_error_with_ontoolcall
Resolve TypeScript type errors in onToolCall by checking toolCall.dynamic before using toolCall.toolName with addToolOutput

When using `onToolCall` callback with TypeScript and both static and dynamic tools, TypeScript cannot automatically narrow the type of `toolCall.toolName`, causing type errors when passing it to `addToolOutput`.

**Problem**: Static tools have specific literal types for their names (e.g., `"getWeatherInformation"`), while dynamic tools have `toolName` as a generic `string`. TypeScript cannot guarantee that `toolCall.toolName` matches your specific tool names.

```tsx
// ❌ Type error: Type 'string' is not assignable to type '"yourTool" | "yourOtherTool"'
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    addToolOutput({
      tool: toolCall.toolName,
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

**Solution**: Check if the tool is dynamic first to enable proper type narrowing:

```tsx
// ✅ Correct approach
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    if (toolCall.dynamic) {
      return;
    }
    // Now TypeScript knows this is a static tool with the correct type
    addToolOutput({
      tool: toolCall.toolName,
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

This solution also applies to the deprecated `addToolResult` method.

### unsupported_model_version_error
AI SDK 5 requires v2 specification; update `@ai-sdk/*` to 2.0.0+, `ai` to 5.0.0+, `zod` to 4.1.8+ to fix `AI_UnsupportedModelVersionError`.

## Issue
When migrating to AI SDK 5, you may encounter `AI_UnsupportedModelVersionError` stating that your model uses an unsupported version:
```
AI_UnsupportedModelVersionError: Unsupported model version v1 for provider "ollama.chat" and model "gamma3:4b".
AI SDK 5 only supports models that implement specification version "v2".
```

This occurs because your provider package implements the older v1 model specification instead of v2.

## Root Cause
AI SDK 5 requires all provider packages to implement specification version v2. When upgrading to AI SDK 5 without updating provider packages, they continue using the older v1 specification, causing this error.

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

## Checking Provider Compatibility
For third-party or custom providers, verify v2 support by:
1. Checking the provider's package.json for `@ai-sdk/provider` peer dependency version `2.0.0` or later
2. Reviewing the provider's changelog or migration guide
3. Checking the provider's repository for AI SDK 5 support

Note: Not all providers may have v2-compatible versions available yet.

### object_generation_failed_with_openai
OpenAI structured outputs reject Zod `.nullish()` and `.optional()` with content-filter errors; use `.nullable()` instead.

## NoObjectGeneratedError with content-filter finish reason

When using `generateObject` or `streamObject` with OpenAI's structured output generation, incompatible Zod schema types cause a `NoObjectGeneratedError` with finish reason `content-filter`.

### Problem

OpenAI's structured output uses JSON Schema and rejects certain Zod patterns:
- `.nullish()` - not supported (allows null, undefined, or omitted)
- `.optional()` - not supported (field can be omitted)
- `.nullable()` - supported (allows null or the specified type)

```typescript
// ❌ Fails with content-filter error
const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullish(),
    email: z.string().optional(),
    age: z.number().nullable(),
  }),
  prompt: 'Generate a user profile',
});
```

### Solution

Replace `.nullish()` and `.optional()` with `.nullable()`:

```typescript
// ✅ Works correctly
const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    age: z.number().nullable(),
  }),
  prompt: 'Generate a user profile',
});

console.log(result.object);
// { name: "John Doe", email: "john@example.com", age: 30 }
// or { name: null, email: null, age: 25 }
```

### Schema Type Compatibility

| Zod Type | Compatible | Behavior |
|----------|-----------|----------|
| `.nullable()` | ✅ Yes | Allows null or the specified type |
| `.optional()` | ❌ No | Field can be omitted |
| `.nullish()` | ❌ No | Allows null, undefined, or omitted |

### model_is_not_assignable_to_type_languagemodelv1
Type incompatibility error after SDK update; caused by model spec changes; fix by updating SDK and provider packages.

## Problem
After updating the AI SDK, you encounter a TypeScript error: `Type 'SomeModel' is not assignable to type 'LanguageModelV1'`. Similar errors can occur with `EmbeddingModelV3`.

## Cause
New features added to the model specification can create incompatibilities between the AI SDK and older provider package versions.

## Solution
Update both your provider packages and the AI SDK to their latest versions to resolve the type incompatibility.

### typescript_error_"cannot_find_namespace_'jsx'"
Fix "Cannot find namespace 'JSX'" error in non-React projects by installing @types/react; AI SDK dependency that will be removed in next major version.

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
Throttle streaming updates with `experimental_throttle` option in `useChat`/`useCompletion` to prevent "Maximum update depth exceeded" error from excessive re-renders on each chunk.

## Problem
When using `useChat` or `useCompletion` hooks in React with the AI SDK, streaming AI responses cause a "Maximum update depth exceeded" error.

## Root Cause
By default, the UI re-renders on every chunk that arrives from the stream. This excessive rendering can overload the rendering pipeline, particularly on slower devices or when complex components like Markdown need updating, causing React's update depth limit to be exceeded.

## Solution
Use the `experimental_throttle` option to throttle UI updates to a specified millisecond interval.

### useChat Example
```tsx
const { messages, ... } = useChat({
  experimental_throttle: 50
})
```

### useCompletion Example
```tsx
const { completion, ... } = useCompletion({
  experimental_throttle: 50
})
```

The throttle value (50ms in examples) delays UI updates, batching multiple stream chunks together before re-rendering, preventing the maximum update depth error.

### jest:_cannot_find_module_'@ai-sdk_rsc'
Fix Jest module resolution for '@ai-sdk/rsc' by mapping it to the dist directory in moduleNameMapper.

When using AI SDK RSC with Jest for testing RSC components, the module '@ai-sdk/rsc' may not be found. This occurs because Jest's default module resolution doesn't properly locate the package.

**Solution:** Configure Jest's module resolution by adding a `moduleNameMapper` entry in `jest.config.js`:

```json
"moduleNameMapper": {
  "^@ai-sdk/rsc$": "<rootDir>/node_modules/@ai-sdk/rsc/dist"
}
```

This maps the '@ai-sdk/rsc' module import to the actual distribution file location, allowing Jest to resolve the module correctly during test execution.

