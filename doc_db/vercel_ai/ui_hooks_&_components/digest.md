## Overview
Framework-agnostic toolkit for building interactive AI-driven UIs with three main hooks: `useChat` for conversational interfaces, `useCompletion` for text completions, and `useObject` for structured JSON generation. Supports React, Svelte, Vue.js, and Angular with varying feature support.

## useChat Hook
Real-time streaming chat with message state management. Core features:
- Message streaming with `parts` array (text, tool calls, tool results, reasoning, sources, files)
- State: `submitted`, `streaming`, `ready`, `error`
- Methods: `sendMessage()`, `stop()`, `regenerate()`, `setMessages()`
- Callbacks: `onFinish`, `onError`, `onData`
- UI customization: status handling, error display, message editing/deletion, cancellation

### Configuration
**Hook-level** (all requests):
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: { Authorization: 'token' },
    body: { user_id: '123' },
    credentials: 'same-origin',
  }),
});
```

**Dynamic** (for refreshing tokens):
```tsx
transport: new DefaultChatTransport({
  headers: () => ({ Authorization: `Bearer ${getAuthToken()}` }),
  body: () => ({ sessionId: getCurrentSessionId() }),
})
```

**Request-level** (per-message, takes precedence):
```tsx
sendMessage({ text: input }, {
  headers: { Authorization: 'Bearer token123' },
  body: { temperature: 0.7, user_id: '123' },
  metadata: { userId: 'user123', sessionId: 'session456' },
});
```

### Transport & Request Transformation
Custom request format via `prepareSendMessagesRequest`:
```tsx
transport: new DefaultChatTransport({
  prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
    if (trigger === 'submit-user-message') {
      return { body: { id, message: messages[messages.length - 1] } };
    } else if (trigger === 'regenerate-assistant-message') {
      return { body: { id, messageId } };
    }
  },
})
```

Server handles different triggers and loads/modifies message history accordingly.

### Message Metadata
Attach custom data to messages (timestamps, model info, token usage):
```ts
// Server
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'start') return { createdAt: Date.now(), model: 'gpt-5.1' };
    if (part.type === 'finish') return { totalTokens: part.totalUsage.totalTokens };
  },
});

// Client
{messages.map(message => (
  <div key={message.id}>
    {message.metadata?.createdAt && new Date(message.metadata.createdAt).toLocaleTimeString()}
    {message.parts.map(part => part.type === 'text' ? part.text : null)}
    {message.metadata?.totalTokens && <span>{message.metadata.totalTokens} tokens</span>}
  </div>
))}
```

### Advanced Features
**Reasoning tokens** (DeepSeek, Claude 3.7):
```ts
return result.toUIMessageStreamResponse({ sendReasoning: true });
// Client: message.parts includes { type: 'reasoning', text: '...' }
```

**Sources** (Perplexity, Google):
```ts
return result.toUIMessageStreamResponse({ sendSources: true });
// Client: message.parts includes { type: 'source-url', url, title } or { type: 'source-document', title }
```

**Image generation** (Gemini 2.5):
```tsx
{message.parts.map(part => 
  part.type === 'file' && part.mediaType.startsWith('image/') 
    ? <img src={part.url} alt="Generated" />
    : null
)}
```

**File attachments**:
```tsx
const [files, setFiles] = useState<FileList>();
sendMessage({ text: input, files }); // Auto-converts image/* and text/* to multi-modal parts

// Or pre-uploaded files:
sendMessage({ text: input, files: [{ type: 'file', filename: 'earth.png', mediaType: 'image/png', url: 'https://...' }] });
```

**Tool type inference**:
```tsx
import { InferUITool, InferUITools } from 'ai';

const weatherTool = { description: '...', inputSchema: z.object(...), execute: async (...) => ... };
type WeatherUITool = InferUITool<typeof weatherTool>; // { input: {...}; output: string }

const tools = { weather: {...}, calculator: {...} } satisfies ToolSet;
type MyUITools = InferUITools<typeof tools>;
type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;
```

**Throttle UI updates** (React only):
```tsx
const { messages } = useChat({ experimental_throttle: 50 }); // milliseconds
```

## Message Persistence
Store and load chat messages with unique IDs:

```tsx
// Create new chat
const id = await createChat(); // generates ID, creates empty message file
redirect(`/chat/${id}`);

// Load existing chat
const messages = await loadChat(id);

// Page component
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const messages = await loadChat(id);
  return <Chat id={id} initialMessages={messages} />;
}

// Chat component
export default function Chat({ id, initialMessages }: { id?: string; initialMessages?: UIMessage[] }) {
  const { sendMessage, messages } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  // ...
}
```

**Validate messages on server** (with tools/metadata):
```ts
import { validateUIMessages } from 'ai';

const validatedMessages = await validateUIMessages({
  messages: [...previousMessages, newMessage],
  tools,
  dataPartsSchema,
  metadataSchema,
});

const result = streamText({
  model: 'openai/gpt-5-mini',
  messages: convertToModelMessages(validatedMessages),
  tools,
});

return result.toUIMessageStreamResponse({
  originalMessages: validatedMessages,
  onFinish: ({ messages }) => saveChat({ chatId: id, messages }),
});
```

**Server-side message ID generation** (for consistency):
```ts
// Option 1: generateMessageId in toUIMessageStreamResponse
return result.toUIMessageStreamResponse({
  generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
  onFinish: ({ messages }) => saveChat({ chatId, messages }),
});

// Option 2: createUIMessageStream with manual ID
const stream = createUIMessageStream({
  execute: ({ writer }) => {
    writer.write({ type: 'start', messageId: generateId() });
    writer.merge(result.toUIMessageStream({ sendStart: false }));
  },
  onFinish: ({ responseMessage }) => { /* save */ },
});
```

**Optimize data sent** - send only last message:
```tsx
transport: new DefaultChatTransport({
  api: '/api/chat',
  prepareSendMessagesRequest({ messages, id }) {
    return { body: { message: messages[messages.length - 1], id } };
  },
})

// Server loads previous messages and appends new one
const previousMessages = await loadChat(id);
const validatedMessages = await validateUIMessages({
  messages: [...previousMessages, message],
  tools,
});
```

**Handle client disconnects** - consume stream on backend:
```ts
const result = streamText({ model, messages: convertToModelMessages(messages) });
result.consumeStream(); // runs to completion regardless of client disconnect

return result.toUIMessageStreamResponse({
  originalMessages: messages,
  onFinish: ({ messages }) => saveChat({ chatId, messages }),
});
```

## Stream Resumption
Resume ongoing streams after page reloads for long-running generations. Requires Redis and `resumable-stream` package.

**Warning**: Incompatible with abort functionality.

```tsx
// Client: enable resumption
const { messages, sendMessage } = useChat({
  id: chatData.id,
  messages: chatData.messages,
  resume: true,
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages }) => ({
      body: { id, message: messages[messages.length - 1] },
    }),
  }),
});

// POST handler: create resumable stream
export async function POST(req: Request) {
  const { message, id } = await req.json();
  const chat = await readChat(id);
  const messages = [...chat.messages, message];
  
  saveChat({ id, messages, activeStreamId: null });

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => saveChat({ id, messages, activeStreamId: null }),
    async consumeSseStream({ stream }) {
      const streamId = generateId();
      const streamContext = createResumableStreamContext({ waitUntil: after });
      await streamContext.createNewResumableStream(streamId, () => stream);
      saveChat({ id, activeStreamId: streamId });
    },
  });
}

// GET handler: resume stream
export async function GET(_, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chat = await readChat(id);

  if (chat.activeStreamId == null) return new Response(null, { status: 204 });

  const streamContext = createResumableStreamContext({ waitUntil: after });
  return new Response(
    await streamContext.resumeExistingStream(chat.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}

// Customize resume endpoint
const { messages } = useChat({
  resume,
  transport: new DefaultChatTransport({
    prepareReconnectToStreamRequest: ({ id }) => ({
      api: `/api/chat/${id}/stream`,
      credentials: 'include',
      headers: { Authorization: 'Bearer token' },
    }),
  }),
});
```

## Tool Usage
Three tool types: server auto-execute, client auto-execute, user-interaction.

```tsx
// API route
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    tools: {
      getWeatherInformation: {
        description: 'show the weather in a given city',
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        },
      },
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        inputSchema: z.object({ message: z.string() }),
      },
      getLocation: {
        description: 'Get the user location.',
        inputSchema: z.object({}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}

// Client
export default function Chat() {
  const { messages, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago'];
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });

  return (
    <>
      {messages?.map(message => (
        <div key={message.id}>
          <strong>{message.role}: </strong>
          {message.parts.map(part => {
            switch (part.type) {
              case 'text':
                return part.text;
              case 'tool-askForConfirmation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-streaming':
                    return <div key={callId}>Loading...</div>;
                  case 'input-available':
                    return (
                      <div key={callId}>
                        {part.input.message}
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'Yes' })}>Yes</button>
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'No' })}>No</button>
                      </div>
                    );
                  case 'output-available':
                    return <div key={callId}>Confirmed: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error: {part.errorText}</div>;
                }
                break;
              }
              case 'tool-getWeatherInformation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-available':
                    return <div key={callId}>Getting weather for {part.input.city}...</div>;
                  case 'output-available':
                    return <div key={callId}>Weather in {part.input.city}: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error: {part.errorText}</div>;
                }
                break;
              }
              case 'dynamic-tool':
                return (
                  <div key={part.toolCallId}>
                    <h4>Tool: {part.toolName}</h4>
                    {part.state === 'output-available' && <pre>{JSON.stringify(part.output, null, 2)}</pre>}
                    {part.state === 'output-error' && <div>Error: {part.errorText}</div>}
                  </div>
                );
            }
          })}
        </div>
      ))}
      <form onSubmit={e => { e.preventDefault(); sendMessage({ text: input }); }}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </>
  );
}
```

**Error handling**:
```tsx
async onToolCall({ toolCall }) {
  if (toolCall.toolName === 'getWeatherInformation') {
    try {
      const weather = await getWeatherInformation(toolCall.input);
      addToolOutput({ tool: 'getWeatherInformation', toolCallId: toolCall.toolCallId, output: weather });
    } catch (err) {
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        state: 'output-error',
        errorText: 'Unable to get weather',
      });
    }
  }
}
```

**Multi-step tool calls**:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  tools: { /* all with execute functions */ },
  stopWhen: stepCountIs(5),
});
```

**Step boundaries in UI**:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'step-start':
      return index > 0 ? <div key={index}><hr /></div> : null;
    // ...
  }
});
```

## Generative UI
Connect LLM tool calls to React components for dynamic UI generation.

```tsx
// Define tools
export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({ location: z.string() }),
  execute: async ({ location }) => ({ weather: 'Sunny', temperature: 75, location }),
});

// Create components
export const Weather = ({ temperature, weather, location }: WeatherProps) => (
  <div>
    <h2>Weather for {location}</h2>
    <p>Condition: {weather}</p>
    <p>Temperature: {temperature}°C</p>
  </div>
);

// Render by checking message.parts for tool-${toolName}
{message.parts.map((part, index) => {
  if (part.type === 'tool-displayWeather') {
    switch (part.state) {
      case 'input-available':
        return <div key={index}>Loading weather...</div>;
      case 'output-available':
        return <div key={index}><Weather {...part.output} /></div>;
      case 'output-error':
        return <div key={index}>Error: {part.errorText}</div>;
    }
  }
})}
```

## useCompletion Hook
Streams text completions with state management.

```tsx
const { completion, input, handleInputChange, handleSubmit, isLoading, error, stop } = useCompletion({
  api: '/api/completion',
  onResponse: (response) => { /* ... */ },
  onFinish: (prompt, completion) => { /* ... */ },
  onError: (error) => { /* ... */ },
  experimental_throttle: 50, // React only
});

return (
  <form onSubmit={handleSubmit}>
    <input name="prompt" value={input} onChange={handleInputChange} disabled={isLoading} />
    <button type="submit" disabled={isLoading}>Submit</button>
    {isLoading && <button onClick={stop}>Stop</button>}
    {error && <div>{error.message}</div>}
    <div>{completion}</div>
  </form>
);
```

Server:
```ts
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = streamText({ model: 'anthropic/claude-sonnet-4.5', prompt });
  return result.toTextStreamResponse();
}
```

## useObject Hook
Streams structured JSON generation with partial results.

```tsx
import { experimental_useObject as useObject } from '@ai-sdk/react';

const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string(),
      message: z.string(),
    }),
  ),
});

const { object, submit, isLoading, error, stop } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
  onFinish({ object, error }) { /* ... */ },
  onError(error) { /* ... */ },
});

return (
  <>
    <button onClick={() => submit('Messages during finals week.')} disabled={isLoading}>
      Generate notifications
    </button>
    {isLoading && <button onClick={stop}>Stop</button>}
    {error && <div>Error</div>}
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

Server:
```ts
export async function POST(req: Request) {
  const context = await req.json();
  const result = streamObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: notificationSchema,
    prompt: `Generate 3 notifications: ${context}`,
  });
  return result.toTextStreamResponse();
}
```

**Enum mode** (classification):
```tsx
const { object, submit } = useObject({
  api: '/api/classify',
  schema: z.object({ enum: z.enum(['true', 'false']) }),
});

// Server
const result = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['true', 'false'],
  prompt: `Classify: ${context}`,
});
```

## Custom Data Streaming
Stream custom data alongside model responses using Server-Sent Events.

```tsx
// Define types
export type MyUIMessage = UIMessage<
  never,
  {
    weather: { city: string; weather?: string; status: 'loading' | 'success' };
    notification: { message: string; level: 'info' | 'warning' | 'error' };
  }
>;

// Server: stream data with createUIMessageStream
const stream = createUIMessageStream<MyUIMessage>({
  execute: ({ writer }) => {
    // Transient data (won't be in history)
    writer.write({
      type: 'data-notification',
      data: { message: 'Processing...', level: 'info' },
      transient: true,
    });

    // Persistent data with loading state
    writer.write({
      type: 'data-weather',
      id: 'weather-1',
      data: { city: 'San Francisco', status: 'loading' },
    });

    const result = streamText({ /* ... */ });
    
    result.onFinish(() => {
      // Update same data part by ID (reconciliation)
      writer.write({
        type: 'data-weather',
        id: 'weather-1',
        data: { city: 'San Francisco', weather: 'sunny', status: 'success' },
      });
    });

    writer.merge(result.toUIMessageStream());
  },
});

return createUIMessageStreamResponse({ stream });

// Client: access via onData callback and message.parts
const { messages } = useChat<MyUIMessage>({
  api: '/api/chat',
  onData: dataPart => {
    if (dataPart.type === 'data-notification') {
      showToast(dataPart.data.message, dataPart.data.level);
    }
  },
});

{messages?.map(message => (
  <div key={message.id}>
    {message.parts
      .filter(part => part.type === 'data-weather')
      .map((part, index) => (
        <div key={index}>
          {part.data.status === 'loading' ? (
            <>Getting weather for {part.data.city}...</>
          ) : (
            <>Weather in {part.data.city}: {part.data.weather}</>
          )}
        </div>
      ))}
    {message.parts
      .filter(part => part.type === 'text')
      .map((part, index) => <div key={index}>{part.text}</div>)}
  </div>
))}
```

## Stream Protocols
Two protocols: text streams (plain text) and data streams (SSE with structured parts).

**Text Stream** - plain text chunks:
```tsx
const { messages, sendMessage } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});

// Server
return result.toTextStreamResponse();
```

**Data Stream** (default) - SSE with parts (text, tool calls, reasoning, sources, files, custom data):
```tsx
// Server
return result.toUIMessageStreamResponse();
```

Data streams support tool calls, usage info, finish reasons. Text streams don't.

## Reading UIMessage Streams
Transform stream of UIMessageChunk objects into AsyncIterableStream<UIMessage> for iterative processing.

```tsx
import { readUIMessageStream, streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get weather',
      inputSchema: z.object({ location: z.string() }),
      execute: ({ location }) => ({ location, temperature: 72 }),
    }),
  },
  prompt: 'What is the weather in Tokyo?',
});

for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
})) {
  uiMessage.parts.forEach(part => {
    switch (part.type) {
      case 'text':
        console.log('Text:', part.text);
        break;
      case 'tool-call':
        console.log('Tool:', part.toolName, 'args:', part.args);
        break;
      case 'tool-result':
        console.log('Result:', part.result);
        break;
    }
  });
}

// Resume from previous message
for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
  message: lastMessage,
})) {
  console.log('Resumed:', uiMessage);
}
```

## Error Handling
Control warnings and handle errors in UI.

```tsx
// Disable warnings
globalThis.AI_SDK_LOG_WARNINGS = false;

// Custom warning handler
globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => {
  // Handle warnings
};

// Handle errors in UI
const { messages, sendMessage, error, regenerate } = useChat();

return (
  <div>
    {messages.map(m => <div key={m.id}>{m.role}: {m.parts.filter(p => p.type === 'text').map(p => p.text).join('')}</div>)}
    {error && (
      <>
        <div>An error occurred.</div>
        <button onClick={() => regenerate()}>Retry</button>
      </>
    )}
    <form onSubmit={handleSubmit}>
      <input value={input} onChange={e => setInput(e.target.value)} disabled={error != null} />
    </form>
  </div>
);

// Error callback
const { /* ... */ } = useChat({
  onError: error => console.error(error),
});

// Replace last message on error
const { sendMessage, error, messages, setMessages } = useChat();
function customSubmit(event: React.FormEvent) {
  event.preventDefault();
  if (error != null) setMessages(messages.slice(0, -1));
  sendMessage({ text: input });
}
```

## Transport
Configure HTTP communication for useChat.

```tsx
// Default: POST to /api/chat
const { messages, sendMessage } = useChat();

// Custom transport
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: { Authorization: 'Bearer token', 'X-API-Version': '2024-01' },
    credentials: 'include',
  }),
});

// Dynamic configuration (for refreshing tokens)
transport: new DefaultChatTransport({
  api: '/api/chat',
  headers: () => ({ Authorization: `Bearer ${getAuthToken()}` }),
  body: () => ({ sessionId: getCurrentSessionId() }),
  credentials: () => 'include',
})

// Request transformation
transport: new DefaultChatTransport({
  api: '/api/chat',
  prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
    return {
      headers: { 'X-Session-ID': id },
      body: { messages: messages.slice(-10), trigger, messageId },
    };
  },
})
```
