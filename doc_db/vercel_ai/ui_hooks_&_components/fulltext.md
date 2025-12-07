

## Pages

### overview
Three hooks (useChat, useCompletion, useObject) for building AI-driven UIs across React, Svelte, Vue.js, Angular with different feature support per framework.

AI SDK UI is a framework-agnostic toolkit for building interactive chat, completion, and assistant applications. It provides three main hooks:

- **useChat**: Real-time streaming of chat messages with state management for inputs, messages, loading, and errors
- **useCompletion**: Text completions with automatic UI updates as new completions stream
- **useObject**: Consume streamed JSON objects for structured data handling

Supported frameworks: React, Svelte, Vue.js, and Angular. Feature support varies by framework:
- useChat: All frameworks
- useCompletion: All frameworks
- useObject: React, Svelte, Angular (not Vue.js)

Example implementations available for Next.js, Nuxt, SvelteKit, and Angular.

### chatbot.mdx
useChat hook for building conversational UIs with real-time streaming, state management, customizable status/error handling, request configuration (hook/dynamic/request-level), message metadata, custom transports with trigger-based routing, response stream control (errors, usage, reasoning, sources), image generation, file attachments (FileList/objects), and tool type inference.

## useChat Hook

The `useChat` hook creates conversational UIs with real-time message streaming, managed state, and automatic UI updates.

### Core Features
- **Message Streaming**: Real-time streaming from AI providers
- **State Management**: Handles input, messages, status, error states
- **Seamless Integration**: Works with any design/layout

### Basic Example
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const [input, setInput] = useState('');

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
      <form onSubmit={e => {
        e.preventDefault();
        if (input.trim()) {
          sendMessage({ text: input });
          setInput('');
        }
      }}>
        <input value={input} onChange={e => setInput(e.target.value)} 
               disabled={status !== 'ready'} placeholder="Say something..." />
        <button type="submit" disabled={status !== 'ready'}>Submit</button>
      </form>
    </>
  );
}
```

Server route:
```ts
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'You are a helpful assistant.',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

Messages have a `parts` property (array of message parts) instead of just `content`. Render using `parts` for support of text, tool invocations, and tool results.

### Status Values
- `submitted`: Message sent, awaiting response stream start
- `streaming`: Response actively streaming
- `ready`: Full response received, ready for new message
- `error`: Error occurred during request

### UI Customization

**Status handling** - Show loading spinner, stop button, disable submit:
```tsx
const { messages, sendMessage, status, stop } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

{(status === 'submitted' || status === 'streaming') && (
  <div>
    {status === 'submitted' && <Spinner />}
    <button type="button" onClick={() => stop()}>Stop</button>
  </div>
)}
```

**Error handling** - Display error and retry:
```tsx
const { messages, sendMessage, error, reload } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

{error && (
  <>
    <div>An error occurred.</div>
    <button type="button" onClick={() => reload()}>Retry</button>
  </>
)}
```

**Modify messages** - Delete or edit messages:
```tsx
const { messages, setMessages } = useChat();
const handleDelete = (id) => {
  setMessages(messages.filter(message => message.id !== id));
};
```

**Cancellation and regeneration**:
```tsx
const { stop, regenerate, status } = useChat();
<button onClick={stop} disabled={!(status === 'streaming' || status === 'submitted')}>Stop</button>
<button onClick={regenerate} disabled={!(status === 'ready' || status === 'error')}>Regenerate</button>
```

**Throttle UI updates** (React only):
```tsx
const { messages } = useChat({
  experimental_throttle: 50  // milliseconds
});
```

### Event Callbacks
```tsx
const { messages } = useChat({
  onFinish: ({ message, messages, isAbort, isDisconnect, isError }) => {
    // Handle completion
  },
  onError: error => {
    console.error('An error occurred:', error);
  },
  onData: data => {
    console.log('Received data part:', data);
  },
});
```

Throwing an error in `onData` aborts processing and triggers `onError`.

### Request Configuration

**Hook-level configuration** (all requests):
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: { Authorization: 'your_token' },
    body: { user_id: '123' },
    credentials: 'same-origin',
  }),
});
```

**Dynamic hook-level configuration** (for tokens that refresh):
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: () => ({
      Authorization: `Bearer ${getAuthToken()}`,
      'X-User-ID': getCurrentUserId(),
    }),
    body: () => ({
      sessionId: getCurrentSessionId(),
      preferences: getUserPreferences(),
    }),
    credentials: () => 'include',
  }),
});
```

Use `useRef` for component state in config functions, or prefer request-level options.

**Request-level configuration** (recommended, per-request):
```tsx
sendMessage(
  { text: input },
  {
    headers: { Authorization: 'Bearer token123', 'X-Custom-Header': 'custom-value' },
    body: { temperature: 0.7, max_tokens: 100, user_id: '123' },
    metadata: { userId: 'user123', sessionId: 'session456' },
  },
);
```

Request-level options take precedence over hook-level options.

**Custom body fields per request**:
```tsx
sendMessage(
  { text: input },
  { body: { customKey: 'customValue' } },
);
```

Server-side:
```ts
export async function POST(req: Request) {
  const { messages, customKey }: { messages: UIMessage[]; customKey: string } = await req.json();
}
```

### Message Metadata

Attach custom metadata (timestamps, model details, token usage):
```tsx
// Server
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'start') {
      return { createdAt: Date.now(), model: 'gpt-5.1' };
    }
    if (part.type === 'finish') {
      return { totalTokens: part.totalUsage.totalTokens };
    }
  },
});

// Client
{messages.map(message => (
  <div key={message.id}>
    {message.role}:{' '}
    {message.metadata?.createdAt && new Date(message.metadata.createdAt).toLocaleTimeString()}
    {message.parts.map((part, index) =>
      part.type === 'text' ? <span key={index}>{part.text}</span> : null,
    )}
    {message.metadata?.totalTokens && <span>{message.metadata.totalTokens} tokens</span>}
  </div>
))}
```

See Message Metadata documentation for complete examples with type safety.

### Transport Configuration

**Custom request format**:
```tsx
const { messages, sendMessage } = useChat({
  id: 'my-chat',
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages }) => {
      return {
        body: {
          id,
          message: messages[messages.length - 1],
        },
      };
    },
  }),
});
```

Server:
```ts
export async function POST(req: Request) {
  const { id, message } = await req.json();
  const messages = await loadMessages(id);
  messages.push(message);
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

**Trigger-based routing** (for regeneration, etc.):
```tsx
const { messages, sendMessage, regenerate } = useChat({
  id: 'my-chat',
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
      if (trigger === 'submit-user-message') {
        return {
          body: {
            trigger: 'submit-user-message',
            id,
            message: messages[messages.length - 1],
            messageId,
          },
        };
      } else if (trigger === 'regenerate-assistant-message') {
        return {
          body: {
            trigger: 'regenerate-assistant-message',
            id,
            messageId,
          },
        };
      }
      throw new Error(`Unsupported trigger: ${trigger}`);
    },
  }),
});
```

Server handles different triggers:
```ts
export async function POST(req: Request) {
  const { trigger, id, message, messageId } = await req.json();
  const chat = await readChat(id);
  let messages = chat.messages;

  if (trigger === 'submit-user-message') {
    messages = [...messages, message];
  } else if (trigger === 'regenerate-assistant-message') {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex !== -1) {
      messages = messages.slice(0, messageIndex);
    }
  }

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

See Transport API documentation for custom transports.

### Response Stream Control

**Error messages** - By default masked for security ("An error occurred."). Customize with `getErrorMessage`:
```ts
return result.toUIMessageStreamResponse({
  onError: error => {
    if (error == null) return 'unknown error';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return JSON.stringify(error);
  },
});
```

**Usage information** - Track token consumption via message metadata:
```ts
type MyMetadata = { totalUsage: LanguageModelUsage };
export type MyUIMessage = UIMessage<MyMetadata>;

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    messageMetadata: ({ part }) => {
      if (part.type === 'finish') {
        return { totalUsage: part.totalUsage };
      }
    },
  });
}
```

Client access:
```tsx
const { messages } = useChat<MyUIMessage>({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  onFinish: ({ message }) => {
    console.log(message.metadata?.totalUsage);
  },
});
```

**Text streams** - Plain text streams with `TextStreamChatTransport`:
```tsx
const { messages } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});
```

Note: Tool calls, usage info, and finish reasons unavailable with text streams.

### Reasoning

Models like DeepSeek `deepseek-r1` and Anthropic `claude-3-7-sonnet-20250219` support reasoning tokens. Forward them with `sendReasoning`:
```ts
return result.toUIMessageStreamResponse({
  sendReasoning: true,
});
```

Client access:
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts.map((part, index) => {
      if (part.type === 'text') return <div key={index}>{part.text}</div>;
      if (part.type === 'reasoning') return <pre key={index}>{part.text}</pre>;
    })}
  </div>
));
```

### Sources

Providers like Perplexity and Google Generative AI include sources. Forward with `sendSources`:
```ts
return result.toUIMessageStreamResponse({
  sendSources: true,
});
```

Client access (two types: `source-url` for web pages, `source-document` for documents):
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts
      .filter(part => part.type === 'source-url')
      .map(part => (
        <span key={`source-${part.id}`}>
          [<a href={part.url} target="_blank">{part.title ?? new URL(part.url).hostname}</a>]
        </span>
      ))}
    {message.parts
      .filter(part => part.type === 'source-document')
      .map(part => (
        <span key={`source-${part.id}`}>[<span>{part.title ?? `Document ${part.id}`}</span>]</span>
      ))}
  </div>
));
```

### Image Generation

Models like Google `gemini-2.5-flash-image-preview` support image generation. Access as file parts:
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts.map((part, index) => {
      if (part.type === 'text') return <div key={index}>{part.text}</div>;
      if (part.type === 'file' && part.mediaType.startsWith('image/')) {
        return <img key={index} src={part.url} alt="Generated image" />;
      }
    })}
  </div>
));
```

### Attachments

Send file attachments with messages using `FileList` or file objects.

**FileList** (from file input, auto-converts `image/*` and `text/*` to multi-modal parts):
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>
            <div>
              {message.parts.map((part, index) => {
                if (part.type === 'text') return <span key={index}>{part.text}</span>;
                if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
                  return <img key={index} src={part.url} alt={part.filename} />;
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={event => {
        event.preventDefault();
        if (input.trim()) {
          sendMessage({ text: input, files });
          setInput('');
          setFiles(undefined);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }}>
        <input type="file" onChange={event => {
          if (event.target.files) setFiles(event.target.files);
        }} multiple ref={fileInputRef} />
        <input value={input} placeholder="Send message..." 
               onChange={e => setInput(e.target.value)} disabled={status !== 'ready'} />
      </form>
    </div>
  );
}
```

**File objects** (pre-uploaded or data URLs):
```tsx
const [files] = useState<FileUIPart[]>([
  {
    type: 'file',
    filename: 'earth.png',
    mediaType: 'image/png',
    url: 'https://example.com/earth.png',
  },
  {
    type: 'file',
    filename: 'moon.png',
    mediaType: 'image/png',
    url: 'data:image/png;base64,iVBORw0KGgo...',
  },
]);

sendMessage({ text: input, files });
```

### Type Inference for Tools

**InferUITool** - Infer types from single tool:
```tsx
import { InferUITool } from 'ai';
import { z } from 'zod';

const weatherTool = {
  description: 'Get the current weather',
  inputSchema: z.object({
    location: z.string().describe('The city and state'),
  }),
  execute: async ({ location }) => {
    return `The weather in ${location} is sunny.`;
  },
};

type WeatherUITool = InferUITool<typeof weatherTool>;
// { input: { location: string }; output: string }
```

**InferUITools** - Infer types from ToolSet:
```tsx
import { InferUITools, ToolSet } from 'ai';
import { z } from 'zod';

const tools = {
  weather: {
    description: 'Get the current weather',
    inputSchema: z.object({
      location: z.string().describe('The city and state'),
    }),
    execute: async ({ location }) => {
      return `The weather in ${location} is sunny.`;
    },
  },
  calculator: {
    description: 'Perform basic arithmetic',
    inputSchema: z.object({
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
} satisfies ToolSet;

type MyUITools = InferUITools<typeof tools>;
// {
//   weather: { input: { location: string }; output: string };
//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };
// }
```

**Using inferred types**:
```tsx
import { InferUITools, UIMessage, UIDataTypes } from 'ai';

type MyUITools = InferUITools<typeof tools>;
type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;

// Pass to useChat or createUIMessageStream
const { messages } = useChat<MyUIMessage>();
const stream = createUIMessageStream<MyUIMessage>(/* ... */);
```

Provides full type safety for tool inputs/outputs on client and server.

### chatbot-message-persistence
Implement persistent chat storage: create/load chats with unique IDs, validate messages with tools/metadata using `validateUIMessages()`, store in `useChat` format via `onFinish` callback, use server-side ID generation for consistency, optimize with `prepareSendMessagesRequest()` to send only last message, handle disconnects with `consumeStream()`.

## Chatbot Message Persistence

Implementing message persistence allows storing and loading chat messages for AI chatbots using `useChat` and `streamText`.

### Creating New Chats

When user navigates to chat page without a chat ID, create a new chat and redirect:

```tsx
import { redirect } from 'next/navigation';
import { createChat } from '@util/chat-store';

export default async function Page() {
  const id = await createChat();
  redirect(`/chat/${id}`);
}
```

Chat store implementation (file-based example, replaceable with database):

```tsx
import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function createChat(): Promise<string> {
  const id = generateId();
  await writeFile(getChatFile(id), '[]');
  return id;
}

function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}
```

### Loading Existing Chats

```tsx
import { UIMessage } from 'ai';
import { readFile } from 'fs/promises';

export async function loadChat(id: string): Promise<UIMessage[]> {
  return JSON.parse(await readFile(getChatFile(id), 'utf8'));
}
```

### Validating Messages on Server

Use `validateUIMessages` to validate messages containing tool calls, metadata, or custom data parts before sending to model:

```tsx
import { convertToModelMessages, streamText, UIMessage, validateUIMessages, tool } from 'ai';
import { z } from 'zod';
import { loadChat, saveChat } from '@util/chat-store';
import { openai } from '@ai-sdk/openai';
import { dataPartsSchema, metadataSchema } from '@util/schemas';

const tools = {
  weather: tool({
    description: 'Get weather information',
    parameters: z.object({
      location: z.string(),
      units: z.enum(['celsius', 'fahrenheit']),
    }),
    execute: async ({ location, units }) => { /* implementation */ },
  }),
};

export async function POST(req: Request) {
  const { message, id } = await req.json();
  const previousMessages = await loadChat(id);
  const messages = [...previousMessages, message];

  const validatedMessages = await validateUIMessages({
    messages,
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
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

Handle validation errors gracefully:

```tsx
import { convertToModelMessages, streamText, validateUIMessages, TypeValidationError } from 'ai';

export async function POST(req: Request) {
  const { message, id } = await req.json();
  let validatedMessages;

  try {
    const previousMessages = await loadMessagesFromDB(id);
    validatedMessages = await validateUIMessages({
      messages: [...previousMessages, message],
      tools,
      metadataSchema,
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      console.error('Database messages validation failed:', error);
      validatedMessages = [];
    } else {
      throw error;
    }
  }
  // Continue with validated messages...
}
```

### Displaying Chat

Page component loads messages from storage:

```tsx
import { loadChat } from '@util/chat-store';
import Chat from '@ui/chat';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const messages = await loadChat(id);
  return <Chat id={id} initialMessages={messages} />;
}
```

Chat component uses `useChat` hook:

```tsx
'use client';

import { UIMessage, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Chat({
  id,
  initialMessages,
}: { id?: string; initialMessages?: UIMessage[] } = {}) {
  const [input, setInput] = useState('');
  const { sendMessage, messages } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map(part => (part.type === 'text' ? part.text : '')).join('')}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Storing Messages

Messages are stored in `onFinish` callback of `toUIMessageStreamResponse`. Note: `useChat` message format differs from `ModelMessage` format - store in `useChat` format which includes `id` and `createdAt`.

```tsx
import { openai } from '@ai-sdk/openai';
import { saveChat } from '@util/chat-store';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json();

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}

export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(chatId), content);
}
```

### Message IDs

Each message has an ID. By default, user message IDs are generated client-side by `useChat`, and AI response IDs by `streamText` on server. For persistence, use server-side generated IDs to ensure consistency across sessions.

**Option 1: Using `generateMessageId` in `toUIMessageStreamResponse`**

```tsx
import { createIdGenerator, streamText } from 'ai';

export async function POST(req: Request) {
  const result = streamText({ /* ... */ });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({
      prefix: 'msg',
      size: 16,
    }),
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

**Option 2: Using `createUIMessageStream`**

```tsx
import { generateId, streamText, createUIMessageStream, createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({
        type: 'start',
        messageId: generateId(),
      });

      const result = streamText({
        model: 'openai/gpt-5-mini',
        messages: convertToModelMessages(messages),
      });

      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
    originalMessages: messages,
    onFinish: ({ responseMessage }) => {
      // save chat
    },
  });

  return createUIMessageStreamResponse({ stream });
}
```

For client-side ID customization without persistence:

```tsx
import { createIdGenerator } from 'ai';
import { useChat } from '@ai-sdk/react';

const { ... } = useChat({
  generateId: createIdGenerator({
    prefix: 'msgc',
    size: 16,
  }),
});
```

### Sending Only Last Message

Reduce data sent to server by providing `prepareSendMessagesRequest` to transport:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { ... } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest({ messages, id }) {
      return { body: { message: messages[messages.length - 1], id } };
    },
  }),
});
```

On server, load previous messages and append new message, then validate if needed:

```tsx
import { convertToModelMessages, UIMessage, validateUIMessages } from 'ai';

export async function POST(req: Request) {
  const { message, id } = await req.json();
  const previousMessages = await loadChat(id);

  const validatedMessages = await validateUIMessages({
    messages: [...previousMessages, message],
    tools,
    metadataSchema,
    dataSchemas,
  });

  const result = streamText({
    messages: convertToModelMessages(validatedMessages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: validatedMessages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

### Handling Client Disconnects

By default, `streamText` uses backpressure to prevent consuming tokens not yet requested. When client disconnects, stream aborts and conversation may break. Use `consumeStream()` to consume stream on backend and save result even after client disconnect:

```tsx
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { saveChat } from '@util/chat-store';

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json();

  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
  });

  result.consumeStream(); // no await - runs to completion regardless of client disconnect

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

When client reloads after disconnect, chat restores from storage. For production, track request state (in progress, complete) in stored messages and use on client to handle incomplete streaming on reload. See Chatbot Resume Streams documentation for more robust disconnect handling.

### resumable_streams
Resume streams after page reloads using `resume: true`, Redis, `resumable-stream` package, and POST/GET endpoints; incompatible with abort.

## Stream Resumption Overview

`useChat` supports resuming ongoing streams after page reloads for long-running generations. Requires persistence layer for messages and active streams.

**Warning**: Stream resumption is incompatible with abort functionality. Page refresh/tab close triggers abort signal that breaks resumption. Don't use `resume: true` if abort is needed.

## What the AI SDK Provides

- `resume` option in `useChat` for automatic stream reconnection
- `consumeSseStream` callback to access outgoing streams
- Automatic HTTP requests to resume endpoints

## What You Build

- Storage to track stream ID per chat
- Redis to store UIMessage stream
- POST endpoint to create streams
- GET endpoint to resume streams
- Integration with `resumable-stream` package for Redis management

## Prerequisites

1. `resumable-stream` npm package (publisher/subscriber for streams)
2. Redis instance (stores stream data)
3. Persistence layer (tracks active stream ID per chat)

## Implementation

### Client-side: Enable resumption

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';

export function Chat({
  chatData,
  resume = false,
}: {
  chatData: { id: string; messages: UIMessage[] };
  resume?: boolean;
}) {
  const { messages, sendMessage, status } = useChat({
    id: chatData.id,
    messages: chatData.messages,
    resume,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest: ({ id, messages }) => {
        return {
          body: {
            id,
            message: messages[messages.length - 1],
          },
        };
      },
    }),
  });

  return <div>{/* Your chat UI */}</div>;
}
```

When `resume: true`, `useChat` makes GET request to `/api/chat/[id]/stream` on mount. Must send chat ID with each request.

### POST handler: Create resumable stream

```ts
import { openai } from '@ai-sdk/openai';
import { readChat, saveChat } from '@util/chat-store';
import {
  convertToModelMessages,
  generateId,
  streamText,
  type UIMessage,
} from 'ai';
import { after } from 'next/server';
import { createResumableStreamContext } from 'resumable-stream';

export async function POST(req: Request) {
  const { message, id }: { message: UIMessage | undefined; id: string } =
    await req.json();

  const chat = await readChat(id);
  let messages = [...chat.messages, message!];

  saveChat({ id, messages, activeStreamId: null });

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => {
      saveChat({ id, messages, activeStreamId: null });
    },
    async consumeSseStream({ stream }) {
      const streamId = generateId();
      const streamContext = createResumableStreamContext({ waitUntil: after });
      await streamContext.createNewResumableStream(streamId, () => stream);
      saveChat({ id, activeStreamId: streamId });
    },
  });
}
```

### GET handler: Resume stream

```ts
import { readChat } from '@util/chat-store';
import { UI_MESSAGE_STREAM_HEADERS } from 'ai';
import { after } from 'next/server';
import { createResumableStreamContext } from 'resumable-stream';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const chat = await readChat(id);

  if (chat.activeStreamId == null) {
    return new Response(null, { status: 204 });
  }

  const streamContext = createResumableStreamContext({ waitUntil: after });
  return new Response(
    await streamContext.resumeExistingStream(chat.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}
```

The `after` function from Next.js allows work to continue after response is sent, ensuring resumable stream persists in Redis for later reconnection.

## Request Lifecycle

1. **Stream creation**: POST handler uses `streamText`, `consumeSseStream` creates resumable stream with unique ID, stores in Redis
2. **Stream tracking**: Persistence layer saves `activeStreamId` in chat data
3. **Client reconnection**: `resume: true` triggers GET request to `/api/chat/[id]/stream`
4. **Stream recovery**: GET handler checks for `activeStreamId`, uses `resumeExistingStream` to reconnect, returns 204 if no active stream
5. **Completion cleanup**: `onFinish` callback clears `activeStreamId` by setting to `null`

## Customize Resume Endpoint

Default GET request goes to `/api/chat/[id]/stream`. Customize using `prepareReconnectToStreamRequest` in `DefaultChatTransport`:

```tsx
const { messages, sendMessage } = useChat({
  id: chatData.id,
  messages: chatData.messages,
  resume,
  transport: new DefaultChatTransport({
    prepareReconnectToStreamRequest: ({ id }) => {
      return {
        api: `/api/chat/${id}/stream`, // or `/api/streams/${id}/resume`
        credentials: 'include',
        headers: {
          Authorization: 'Bearer token',
          'X-Custom-Header': 'value',
        },
      };
    },
  }),
});
```

## Important Considerations

- **Incompatible with abort**: Don't use `resume: true` if abort functionality needed
- **Stream expiration**: Streams in Redis expire after configurable time
- **Multiple clients**: Multiple clients can connect to same stream simultaneously
- **Error handling**: GET returns 204 when no active stream exists
- **Security**: Ensure proper authentication/authorization for create and resume endpoints
- **Race conditions**: Clear `activeStreamId` when starting new stream to prevent resuming outdated streams

### chatbot-tool-usage
useChat with streamText supports three tool types (server auto-execute, client auto-execute, user-interaction); tools stream by default; render via message.parts with typed tool names and state-based UI; use onToolCall callback and addToolOutput for client tools; sendAutomaticallyWhen auto-submits when complete; dynamic tools use generic dynamic-tool type; error handling via output-error state or onError callback.

## Tool Types and Flow

Three types of tools are supported:
1. Automatically executed server-side tools
2. Automatically executed client-side tools
3. Tools requiring user interaction (confirmation dialogs)

Flow:
1. User sends message to API route
2. Language model generates tool calls via `streamText`
3. Tool calls forwarded to client
4. Server-side tools executed via `execute` method, results forwarded
5. Client-side auto-execute tools handled via `onToolCall` callback with `addToolOutput`
6. Interactive tools displayed in UI, available in message `parts` as tool invocation parts
7. User interaction triggers `addToolOutput` to submit results
8. `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls` auto-submits when all results available

Tool calls are integrated as typed tool parts in assistant messages - initially as tool calls, then as tool results after execution.

## Example Implementation

API route with three tools:
```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    tools: {
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
        },
      },
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        inputSchema: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      getLocation: {
        description: 'Get the user location. Always ask for confirmation before using this tool.',
        inputSchema: z.object({}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}
```

Client-side with `useChat`:
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage, addToolOutput } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    async onToolCall({ toolCall }) {
      if (toolCall.dynamic) return;
      
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
        addToolOutput({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)],
        });
      }
    },
  });
  const [input, setInput] = useState('');

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
                    return <div key={callId}>Loading confirmation request...</div>;
                  case 'input-available':
                    return (
                      <div key={callId}>
                        {part.input.message}
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'Yes, confirmed.' })}>Yes</button>
                        <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'No, denied' })}>No</button>
                      </div>
                    );
                  case 'output-available':
                    return <div key={callId}>Location access allowed: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error: {part.errorText}</div>;
                }
                break;
              }
              case 'tool-getLocation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-streaming':
                    return <div key={callId}>Preparing location request...</div>;
                  case 'input-available':
                    return <div key={callId}>Getting location...</div>;
                  case 'output-available':
                    return <div key={callId}>Location: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error getting location: {part.errorText}</div>;
                }
                break;
              }
              case 'tool-getWeatherInformation': {
                const callId = part.toolCallId;
                switch (part.state) {
                  case 'input-streaming':
                    return <pre key={callId}>{JSON.stringify(part, null, 2)}</pre>;
                  case 'input-available':
                    return <div key={callId}>Getting weather information for {part.input.city}...</div>;
                  case 'output-available':
                    return <div key={callId}>Weather in {part.input.city}: {part.output}</div>;
                  case 'output-error':
                    return <div key={callId}>Error getting weather for {part.input.city}: {part.errorText}</div>;
                }
                break;
              }
            }
          })}
        </div>
      ))}
      <form onSubmit={e => { e.preventDefault(); if (input.trim()) { sendMessage({ text: input }); setInput(''); } }}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </>
  );
}
```

## Error Handling

For client-side tool execution errors, use `addToolOutput` with `state: 'output-error'` and `errorText`:
```tsx
async onToolCall({ toolCall }) {
  if (toolCall.dynamic) return;
  if (toolCall.toolName === 'getWeatherInformation') {
    try {
      const weather = await getWeatherInformation(toolCall.input);
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        output: weather,
      });
    } catch (err) {
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        state: 'output-error',
        errorText: 'Unable to get the weather information',
      });
    }
  }
}
```

## Dynamic Tools

For tools with unknown types at compile time, use generic `dynamic-tool` type instead of specific `tool-${toolName}`:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'tool-getWeatherInformation':
      return <WeatherDisplay part={part} />;
    case 'dynamic-tool':
      return (
        <div key={index}>
          <h4>Tool: {part.toolName}</h4>
          {part.state === 'input-streaming' && <pre>{JSON.stringify(part.input, null, 2)}</pre>}
          {part.state === 'output-available' && <pre>{JSON.stringify(part.output, null, 2)}</pre>}
          {part.state === 'output-error' && <div>Error: {part.errorText}</div>}
        </div>
      );
  }
});
```

Useful for MCP tools, user-defined runtime functions, and external tool providers.

## Tool Call Streaming

Enabled by default in v5.0. Partial tool calls stream in real-time. Access via `useChat` hook and message `parts`. Use `state` property to render correct UI:
```tsx
case 'tool-askForConfirmation':
case 'tool-getLocation':
case 'tool-getWeatherInformation':
  switch (part.state) {
    case 'input-streaming':
      return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
    case 'input-available':
      return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
    case 'output-available':
      return <pre>{JSON.stringify(part.output, null, 2)}</pre>;
    case 'output-error':
      return <div>Error: {part.errorText}</div>;
  }
```

## Step Start Parts

For multi-step tool calls, use `step-start` parts to display boundaries:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'step-start':
      return index > 0 ? <div key={index} className="text-gray-500"><hr className="my-2 border-gray-300" /></div> : null;
    case 'text':
    case 'tool-askForConfirmation':
    // ...
  }
});
```

## Server-side Multi-Step Calls

Use `streamText` with `stopWhen: stepCountIs(5)` when all tools have `execute` functions:
```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  tools: {
    getWeatherInformation: {
      description: 'show the weather in a given city to the user',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }: { city: string }) => {
        const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
        return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      },
    },
  },
  stopWhen: stepCountIs(5),
});
```

## Error Masking

Language model tool call errors are masked by default for security. Surface them with `onError` in `toUIMessageStreamResponse`:
```tsx
export function errorHandler(error: unknown) {
  if (error == null) return 'unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

const result = streamText({ /* ... */ });
return result.toUIMessageStreamResponse({ onError: errorHandler });
```

Or with `createUIMessageResponse`:
```tsx
const response = createUIMessageResponse({
  async execute(dataStream) { /* ... */ },
  onError: error => `Custom error: ${error.message}`,
});
```

Key notes:
- Always check `if (toolCall.dynamic)` first in `onToolCall` for proper type narrowing
- Call `addToolOutput` without `await` to avoid deadlocks
- Render messages using `parts` property with typed tool part names like `tool-askForConfirmation`
- Tool parts have states: `input-streaming`, `input-available`, `output-available`, `output-error`

### generative-user-interfaces
Build dynamic UIs by connecting LLM tool calls to React components; define tools with schemas, create matching components, render by checking message.parts for tool-${toolName} parts and their states.

## Generative User Interfaces

Generative UI allows LLMs to generate React components dynamically based on tool calls, creating more engaging AI-native experiences.

### Core Concept

Generative UI connects tool call results to React components:
1. Provide model with prompt/conversation history and tools
2. Model decides when/how to use tools based on context
3. Tool executes and returns data
4. Data passed to React component for rendering

### Basic Chat Implementation

```tsx
// app/page.tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }
              return null;
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

```ts
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage, stepCountIs } from 'ai';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'You are a friendly assistant!',
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
  });
  return result.toUIMessageStreamResponse();
}
```

### Creating Tools

```ts
// ai/tools.ts
import { tool as createTool } from 'ai';
import { z } from 'zod';

export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { weather: 'Sunny', temperature: 75, location };
  },
});

export const stockTool = createTool({
  description: 'Get price for a stock',
  inputSchema: z.object({
    symbol: z.string().describe('The stock symbol to get the price for'),
  }),
  execute: async function ({ symbol }) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { symbol, price: 100 };
  },
});

export const tools = {
  displayWeather: weatherTool,
  getStockPrice: stockTool,
};
```

Update API route to include tools:
```ts
// app/api/chat/route.ts
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'You are a friendly assistant!',
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools,
  });
  return result.toUIMessageStreamResponse();
}
```

### Creating UI Components

```tsx
// components/weather.tsx
type WeatherProps = {
  temperature: number;
  weather: string;
  location: string;
};

export const Weather = ({ temperature, weather, location }: WeatherProps) => {
  return (
    <div>
      <h2>Current Weather for {location}</h2>
      <p>Condition: {weather}</p>
      <p>Temperature: {temperature}°C</p>
    </div>
  );
};
```

```tsx
// components/stock.tsx
type StockProps = {
  price: number;
  symbol: string;
};

export const Stock = ({ price, symbol }: StockProps) => {
  return (
    <div>
      <h2>Stock Information</h2>
      <p>Symbol: {symbol}</p>
      <p>Price: ${price}</p>
    </div>
  );
};
```

### Rendering Tool Results

Tool parts use typed naming: `tool-${toolName}`. Check `message.parts` for tool-specific parts and handle their states:

```tsx
// app/page.tsx
import { Weather } from '@/components/weather';
import { Stock } from '@/components/stock';

export default function Page() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>
            {message.parts.map((part, index) => {
              if (part.type === 'text') {
                return <span key={index}>{part.text}</span>;
              }

              if (part.type === 'tool-displayWeather') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading weather...</div>;
                  case 'output-available':
                    return <div key={index}><Weather {...part.output} /></div>;
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }

              if (part.type === 'tool-getStockPrice') {
                switch (part.state) {
                  case 'input-available':
                    return <div key={index}>Loading stock price...</div>;
                  case 'output-available':
                    return <div key={index}><Stock {...part.output} /></div>;
                  case 'output-error':
                    return <div key={index}>Error: {part.errorText}</div>;
                  default:
                    return null;
                }
              }

              return null;
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

Tool parts have three states:
- `input-available`: Tool is being called, show loading state
- `output-available`: Tool executed successfully, render component with `part.output`
- `output-error`: Tool failed, display error from `part.errorText`

Expand application by adding more tools and components following the same pattern.

### usecompletion
useCompletion hook: streams AI text completions with state management (completion, input, isLoading, error), input control (handleInputChange, handleSubmit, setInput), cancellation (stop), throttling (experimental_throttle), callbacks (onResponse, onFinish, onError), and request options (headers, body, credentials).

## useCompletion Hook

React hook for streaming text completions from AI providers. Manages state for chat input, handles streaming responses, and updates UI automatically.

### Basic Usage

```tsx
import { useCompletion } from '@ai-sdk/react';

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: '/api/completion',
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

Server endpoint:
```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt,
  });
  return result.toUIMessageStreamResponse();
}
```

### State and Callbacks

Available states: `completion`, `input`, `isLoading`, `error`

```tsx
const { isLoading, error, ... } = useCompletion();

// Show loading state
{isLoading ? <Spinner /> : null}

// Handle errors
useEffect(() => {
  if (error) toast.error(error.message);
}, [error]);
```

### Input Control

Controlled input with `handleInputChange` and `handleSubmit`, or granular control:
```tsx
const { input, setInput } = useCompletion();
<MyCustomInput value={input} onChange={value => setInput(value)} />
```

### Cancellation

```tsx
const { stop, isLoading } = useCompletion();
<button onClick={stop} disabled={!isLoading}>Stop</button>
```

Calling `stop()` aborts the fetch request.

### UI Update Throttling

React only. Throttle renders with `experimental_throttle` option (in milliseconds):
```tsx
const { completion } = useCompletion({
  experimental_throttle: 50
});
```

### Event Callbacks

```tsx
useCompletion({
  onResponse: (response: Response) => { /* ... */ },
  onFinish: (prompt: string, completion: string) => { /* ... */ },
  onError: (error: Error) => { /* ... */ },
});
```

Throwing an error in `onResponse` aborts processing and triggers `onError`.

### Request Customization

```tsx
useCompletion({
  api: '/api/custom-completion',
  headers: { Authorization: 'token' },
  body: { user_id: '123' },
  credentials: 'same-origin',
});
```

### useobject_hook
useObject hook streams structured JSON generation with partial results; pairs with server-side streamObject; supports enum classification mode; provides isLoading/error states, submit/stop functions, and onFinish/onError callbacks.

## useObject Hook

The `useObject` hook enables streaming structured JSON object generation in React, Svelte, and Vue applications. It pairs with the server-side `streamObject` function to progressively render partially-generated objects.

### Basic Usage

Define a Zod schema:
```ts
import { z } from 'zod';
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

Client-side streaming with partial results:
```tsx
import { experimental_useObject as useObject } from '@ai-sdk/react';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });

  return (
    <>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>
      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

Server-side streaming:
```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';

export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();
  const result = streamObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: notificationSchema,
    prompt: `Generate 3 notifications for a messages app in this context: ${context}`,
  });
  return result.toTextStreamResponse();
}
```

### Enum Output Mode

For classification into predefined options, use `enum` output mode with schema structure `{ enum: z.enum(['option1', 'option2']) }`:

```tsx
const { object, submit, isLoading } = useObject({
  api: '/api/classify',
  schema: z.object({ enum: z.enum(['true', 'false']) }),
});

return (
  <>
    <button onClick={() => submit('The earth is flat')} disabled={isLoading}>
      Classify statement
    </button>
    {object && <div>Classification: {object.enum}</div>}
  </>
);
```

Server with `output: 'enum'`:
```ts
const result = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['true', 'false'],
  prompt: `Classify this statement as true or false: ${context}`,
});
```

### State Management

`useObject` returns:
- `object`: Partial or complete generated object
- `isLoading`: Boolean indicating generation in progress
- `error`: Error object if fetch fails
- `submit(input)`: Function to trigger generation
- `stop()`: Function to cancel generation

```tsx
const { isLoading, error, object, submit, stop } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {isLoading && <Spinner />}
    {error && <div>An error occurred.</div>}
    {isLoading && <button onClick={() => stop()}>Stop</button>}
    <button onClick={() => submit('...')} disabled={isLoading}>
      Generate
    </button>
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

### Event Callbacks

```tsx
const { object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
  onFinish({ object, error }) {
    console.log('Object generation completed:', object);
    console.log('Schema validation error:', error);
  },
  onError(error) {
    console.error('An error occurred:', error);
  },
});
```

### Configuration

```tsx
const { submit, object } = useObject({
  api: '/api/use-object',
  headers: { 'X-Custom-Header': 'CustomValue' },
  credentials: 'include',
  schema: yourSchema,
});
```

### streaming-custom-data
Stream custom data (persistent, transient, or sources) alongside model responses; reconcile updates by ID; handle transient data via onData callback, persistent data via message.parts filtering.

## Streaming Custom Data

Send additional data alongside model responses using Server-Sent Events. Useful for status information, message IDs, content references, and dynamic updates.

### Type-Safe Data Streaming Setup

Define custom message types with data part schemas:

```tsx
import { UIMessage } from 'ai';

export type MyUIMessage = UIMessage<
  never,
  {
    weather: { city: string; weather?: string; status: 'loading' | 'success' };
    notification: { message: string; level: 'info' | 'warning' | 'error' };
  }
>;
```

### Server-Side Streaming

Use `createUIMessageStream` with a writer to send data:

```tsx
import { createUIMessageStream, createUIMessageStreamResponse, streamText, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = createUIMessageStream<MyUIMessage>({
    execute: ({ writer }) => {
      // Transient data (won't be added to history)
      writer.write({
        type: 'data-notification',
        data: { message: 'Processing...', level: 'info' },
        transient: true,
      });

      // Sources for RAG
      writer.write({
        type: 'source',
        value: {
          type: 'source',
          sourceType: 'url',
          id: 'source-1',
          url: 'https://weather.com',
          title: 'Weather Data Source',
        },
      });

      // Persistent data parts with loading state
      writer.write({
        type: 'data-weather',
        id: 'weather-1',
        data: { city: 'San Francisco', status: 'loading' },
      });

      const result = streamText({
        model: 'anthropic/claude-sonnet-4.5',
        messages: convertToModelMessages(messages),
        onFinish() {
          // Update same data part by ID (reconciliation)
          writer.write({
            type: 'data-weather',
            id: 'weather-1',
            data: { city: 'San Francisco', weather: 'sunny', status: 'success' },
          });

          writer.write({
            type: 'data-notification',
            data: { message: 'Request completed', level: 'info' },
            transient: true,
          });
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
```

### Data Types

**Data Parts (Persistent)** - Added to message history in `message.parts`:
```tsx
writer.write({ type: 'data-weather', id: 'weather-1', data: { city: 'SF', status: 'loading' } });
```

**Sources** - For RAG, shows referenced documents/URLs:
```tsx
writer.write({
  type: 'source',
  value: { type: 'source', sourceType: 'url', id: 'source-1', url: 'https://example.com', title: 'Example' },
});
```

**Transient Data Parts** - Sent to client but not in message history, only accessible via `onData`:
```tsx
writer.write({ type: 'data-notification', data: { message: 'Processing...', level: 'info' }, transient: true });
```

### Data Part Reconciliation

Writing to a data part with the same ID automatically updates it on the client. Enables collaborative artifacts, progressive loading, live status updates, and interactive components.

### Client-Side Processing

**Using onData callback** (essential for transient parts):

```tsx
import { useChat } from '@ai-sdk/react';

const { messages } = useChat<MyUIMessage>({
  api: '/api/chat',
  onData: dataPart => {
    if (dataPart.type === 'data-weather') {
      console.log('Weather update:', dataPart.data);
    }
    if (dataPart.type === 'data-notification') {
      showToast(dataPart.data.message, dataPart.data.level);
    }
  },
});
```

**Rendering persistent data parts**:

```tsx
const result = (
  <>
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
          .map((part, index) => (
            <div key={index}>{part.text}</div>
          ))}

        {message.parts
          .filter(part => part.type === 'source')
          .map((part, index) => (
            <div key={index}>
              Source: <a href={part.url}>{part.title}</a>
            </div>
          ))}
      </div>
    ))}
  </>
);
```

**Complete example**:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat<MyUIMessage>({
    api: '/api/chat',
    onData: dataPart => {
      if (dataPart.type === 'data-notification') {
        console.log('Notification:', dataPart.data.message);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <>
      {messages?.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts
            .filter(part => part.type === 'data-weather')
            .map((part, index) => (
              <span key={index}>
                {part.data.status === 'loading' ? (
                  <>Getting weather for {part.data.city}...</>
                ) : (
                  <>Weather in {part.data.city}: {part.data.weather}</>
                )}
              </span>
            ))}
          {message.parts
            .filter(part => part.type === 'text')
            .map((part, index) => (
              <div key={index}>{part.text}</div>
            ))}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the weather..." />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

### Use Cases

RAG applications (stream sources and documents), real-time status updates, collaborative tools, analytics, notifications.

### Message Metadata vs Data Parts

**Message Metadata** - Message-level information (timestamps, model info, token usage). Attached via `message.metadata`, sent using `messageMetadata` callback in `toUIMessageStreamResponse`.

**Data Parts** - Dynamic arbitrary data (dynamic content, loading states, interactive components). Added to `message.parts`, streamed via `createUIMessageStream`, can be reconciled/updated by ID, support transient parts.

### error-handling
Handle warnings via globalThis.AI_SDK_LOG_WARNINGS flag or custom handler; use error object from hooks to display errors, disable inputs, and implement retry/replace-message patterns; pass onError callback to hooks for error processing.

## Warnings

Warnings appear in the browser console when unsupported features, compatibility issues, or other problems are detected. All warnings start with "AI SDK Warning:".

Control warnings globally:
```ts
// Turn off all warnings
globalThis.AI_SDK_LOG_WARNINGS = false;

// Custom warning handler
globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => {
  // Handle warnings your own way
};
```

## Error Handling

Each UI hook returns an `error` object for rendering errors in the UI. Use it to show error messages, disable buttons, or show retry buttons.

**Example with retry button:**
```tsx
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, error, regenerate } = useChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.parts.filter(p => p.type === 'text').map(p => p.text).join('')}
        </div>
      ))}
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
}
```

**Alternative: Replace last message on error:**
```tsx
const { sendMessage, error, messages, setMessages } = useChat();

function customSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (error != null) {
    setMessages(messages.slice(0, -1)); // remove last message
  }
  sendMessage({ text: input });
  setInput('');
}
```

**Error handling callback:**
Pass an `onError` callback to `useChat` or `useCompletion` hooks:
```tsx
const { /* ... */ } = useChat({
  onError: error => {
    console.error(error);
  },
});
```

**Testing errors:**
Throw an error in your route handler:
```ts
export async function POST(req: Request) {
  throw new Error('This is a test error');
}
```

Best practice: Show generic error messages to users to avoid leaking server information.

### transport
useChat transport system: default HTTP POST to /api/chat, configurable via DefaultChatTransport with headers/body/credentials (static or dynamic functions), request transformation via prepareSendMessagesRequest, or implement custom ChatTransport interface.

## Default Transport

`useChat` uses HTTP POST to `/api/chat` by default:

```tsx
import { useChat } from '@ai-sdk/react';
const { messages, sendMessage } = useChat();
```

Equivalent to:
```tsx
import { DefaultChatTransport } from 'ai';
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});
```

## Custom Transport Configuration

Configure default transport with custom options:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: {
      Authorization: 'Bearer your-token',
      'X-API-Version': '2024-01',
    },
    credentials: 'include',
  }),
});
```

### Dynamic Configuration

Use functions for runtime-dependent values:

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
    credentials: () => 'include',
  }),
});
```

### Request Transformation

Transform requests before sending:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
      return {
        headers: { 'X-Session-ID': id },
        body: {
          messages: messages.slice(-10),
          trigger,
          messageId,
        },
      };
    },
  }),
});
```

## Building Custom Transports

Implement the ChatTransport interface. Reference implementations:
- DefaultChatTransport - complete HTTP transport
- HttpChatTransport - base HTTP transport with request handling
- ChatTransport interface - interface to implement

Custom transports handle: `sendMessages` method, UI message streams, request/response transformation, error and connection management.

### reading_uimessage_streams
readUIMessageStream helper converts UIMessageChunk streams to AsyncIterableStream<UIMessage> for iterative message processing; supports tool calls with part-type switching (text/tool-call/tool-result) and conversation resumption via message parameter.

## Reading UIMessage Streams

`readUIMessageStream` transforms a stream of `UIMessageChunk` objects into an `AsyncIterableStream` of `UIMessage` objects, enabling message processing as they're constructed. Useful for terminal UIs, custom client-side stream processing, and React Server Components.

### Basic Usage

```tsx
import { openai } from '@ai-sdk/openai';
import { readUIMessageStream, streamText } from 'ai';

async function main() {
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Write a short story about a robot.',
  });

  for await (const uiMessage of readUIMessageStream({
    stream: result.toUIMessageStream(),
  })) {
    console.log('Current message state:', uiMessage);
  }
}
```

### Tool Calls Integration

Handle streaming responses with tool calls by iterating over `uiMessage.parts` and switching on `part.type`:

```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
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
        console.log('Tool called:', part.toolName, 'with args:', part.args);
        break;
      case 'tool-result':
        console.log('Tool result:', part.result);
        break;
    }
  });
}
```

### Resuming Conversations

Resume streaming from a previous message state by passing the `message` parameter:

```tsx
for await (const uiMessage of readUIMessageStream({
  stream: result.toUIMessageStream(),
  message: lastMessage, // Resume from this message
})) {
  console.log('Resumed message:', uiMessage);
}
```

### message-metadata
Attach typed metadata to messages at message level via server-side `messageMetadata` callback, access on client via `message.metadata` property; supports timestamps, model info, token usage, user context, performance metrics.

## Message Metadata

Attach custom information to messages at the message level (distinct from data parts which are content-level). Useful for timestamps, model info, token usage, user context, and performance metrics.

### Defining Metadata Types

Define a Zod schema for type safety:

```tsx
import { UIMessage } from 'ai';
import { z } from 'zod';

export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type MyUIMessage = UIMessage<MessageMetadata>;
```

### Sending Metadata from Server

Use the `messageMetadata` callback in `toUIMessageStreamResponse`:

```ts
import { streamText } from 'ai';
import type { MyUIMessage } from '@/types';

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    messageMetadata: ({ part }) => {
      if (part.type === 'start') {
        return {
          createdAt: Date.now(),
          model: 'gpt-5.1',
        };
      }
      if (part.type === 'finish') {
        return {
          totalTokens: part.totalUsage.totalTokens,
        };
      }
    },
  });
}
```

Pass `originalMessages` typed to your UIMessage type for type-safe metadata returns.

### Accessing Metadata on Client

Access via `message.metadata` property:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import type { MyUIMessage } from '@/types';

export default function Chat() {
  const { messages } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.metadata?.createdAt && (
              <span className="text-sm text-gray-500">
                {new Date(message.metadata.createdAt).toLocaleTimeString()}
              </span>
            )}
          </div>
          {message.parts.map((part, index) =>
            part.type === 'text' ? <div key={index}>{part.text}</div> : null,
          )}
          {message.metadata?.totalTokens && (
            <div className="text-xs text-gray-400">
              {message.metadata.totalTokens} tokens
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Use Cases

- Timestamps: creation/completion times
- Model information: which AI model was used
- Token usage: track costs and limits
- User context: user IDs, session info
- Performance metrics: generation time, time to first token
- Quality indicators: finish reason, confidence scores

### stream-protocols.mdx
Text vs Data stream protocols: text streams plain text via toTextStreamResponse(); data streams use SSE with message/text/reasoning/source/file/tool/step parts via toUIMessageStreamResponse().

## Stream Protocols

AI SDK UI functions (`useChat`, `useCompletion`, `useObject`) support two stream protocols that define how data is streamed to the frontend over HTTP.

### Text Stream Protocol

Plain text chunks streamed and appended together. Generated with `streamText` backend function, returned via `toTextStreamResponse()`.

**Text Stream Example:**

Frontend with `TextStreamChatTransport`:
```tsx
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat({
    transport: new TextStreamChatTransport({ api: '/api/chat' }),
  });

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => 
            part.type === 'text' && <div key={`${message.id}-${i}`}>{part.text}</div>
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.currentTarget.value)} />
      </form>
    </div>
  );
}
```

Backend:
```ts
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toTextStreamResponse();
}
```

Text streams only support basic text data. For tool calls and other data types, use data streams.

### Data Stream Protocol

Uses Server-Sent Events (SSE) format with keep-alive pings, reconnect capabilities, and better cache handling. Default for `useChat` and `useCompletion`. Requires `x-vercel-ai-ui-message-stream: v1` header from custom backends.

**Supported Stream Parts:**

- **Message Start**: `{"type":"start","messageId":"..."}`
- **Text Parts** (start/delta/end pattern):
  - Start: `{"type":"text-start","id":"msg_..."}`
  - Delta: `{"type":"text-delta","id":"msg_...","delta":"Hello"}`
  - End: `{"type":"text-end","id":"msg_..."}`
- **Reasoning Parts** (start/delta/end pattern):
  - Start: `{"type":"reasoning-start","id":"reasoning_123"}`
  - Delta: `{"type":"reasoning-delta","id":"reasoning_123","delta":"This is some reasoning"}`
  - End: `{"type":"reasoning-end","id":"reasoning_123"}`
- **Source Parts**:
  - URL: `{"type":"source-url","sourceId":"https://example.com","url":"https://example.com"}`
  - Document: `{"type":"source-document","sourceId":"https://example.com","mediaType":"file","title":"Title"}`
- **File Part**: `{"type":"file","url":"https://example.com/file.png","mediaType":"image/png"}`
- **Data Parts** (custom): `{"type":"data-weather","data":{"location":"SF","temperature":100}}`
- **Error Part**: `{"type":"error","errorText":"error message"}`
- **Tool Input Parts**:
  - Start: `{"type":"tool-input-start","toolCallId":"call_...","toolName":"getWeatherInformation"}`
  - Delta: `{"type":"tool-input-delta","toolCallId":"call_...","inputTextDelta":"San Francisco"}`
  - Available: `{"type":"tool-input-available","toolCallId":"call_...","toolName":"getWeatherInformation","input":{"city":"San Francisco"}}`
- **Tool Output Part**: `{"type":"tool-output-available","toolCallId":"call_...","output":{"city":"San Francisco","weather":"sunny"}}`
- **Step Parts**:
  - Start: `{"type":"start-step"}`
  - Finish: `{"type":"finish-step"}`
- **Finish Message**: `{"type":"finish"}`
- **Stream Termination**: `data: [DONE]`

**UI Message Stream Example:**

Frontend (default protocol):
```tsx
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => 
            part.type === 'text' && <div key={`${message.id}-${i}`}>{part.text}</div>
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.currentTarget.value)} />
      </form>
    </div>
  );
}
```

Backend:
```ts
import { streamText, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

`useCompletion` only supports text and data stream parts. Use `toUIMessageStreamResponse()` on backend `streamText` result to return streaming HTTP response.

