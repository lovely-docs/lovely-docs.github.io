

## Pages

### overview
Framework-agnostic UI toolkit with useChat, useCompletion, useObject hooks for React/Svelte/Vue.js/Angular; useObject unavailable in Vue.js.

AI SDK UI is a framework-agnostic toolkit for building interactive chat, completion, and assistant applications. It provides three main hooks:

- **useChat**: Real-time streaming of chat messages with abstracted state management for inputs, messages, loading, and errors. Enables seamless integration into any UI design.
- **useCompletion**: Handles text completions by managing prompt input and automatically updating the UI as new completions are streamed.
- **useObject**: Consumes streamed JSON objects, providing a simple way to handle and display structured data.

These hooks reduce complexity in implementing AI interactions by managing chat streams and UI updates on the frontend.

**Framework Support**: React, Svelte, Vue.js, and Angular are supported. All frameworks support useChat and useCompletion. useObject is supported in React, Svelte, and Angular, but not Vue.js.

**Example Implementations**: Next.js, Nuxt, SvelteKit, and Angular examples are available in the repository.

### chatbot
useChat hook for real-time streaming chat UIs with state management, customizable requests, metadata, error handling, message manipulation, cancellation/regeneration, reasoning tokens, sources, image generation, file attachments, and tool type inference.

# Chatbot with useChat Hook

## Overview
The `useChat` hook creates conversational UIs with real-time message streaming from AI providers. It manages chat state (input, messages, status, error) and automatically updates the UI as messages arrive.

## Core Features
- **Message Streaming**: Real-time streaming from AI providers
- **State Management**: Handles input, messages, status, error states
- **Seamless Integration**: Works with any design or layout

## Basic Example
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
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
        <input value={input} onChange={e => setInput(e.target.value)} disabled={status !== 'ready'} placeholder="Say something..." />
        <button type="submit" disabled={status !== 'ready'}>Submit</button>
      </form>
    </>
  );
}
```

Server-side:
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

Messages use a `parts` property containing message parts (text, tool invocation, tool result) instead of `content`.

## Status Management
The `status` value indicates request state:
- `submitted`: Message sent, awaiting response stream start
- `streaming`: Response actively streaming
- `ready`: Full response received, ready for new message
- `error`: Error occurred

Use status to show loading spinners, disable buttons, or display stop buttons:
```tsx
const { messages, sendMessage, status, stop } = useChat({...});

{(status === 'submitted' || status === 'streaming') && (
  <div>
    {status === 'submitted' && <Spinner />}
    <button type="button" onClick={() => stop()}>Stop</button>
  </div>
)}
```

## Error Handling
Access error state and use `reload()` to retry:
```tsx
const { messages, sendMessage, error, reload } = useChat({...});

{error && (
  <>
    <div>An error occurred.</div>
    <button type="button" onClick={() => reload()}>Retry</button>
  </>
)}
```

Show generic error messages to avoid leaking server information.

## Message Manipulation
Use `setMessages` to modify messages (e.g., delete):
```tsx
const { messages, setMessages } = useChat();
const handleDelete = (id) => {
  setMessages(messages.filter(message => message.id !== id));
};
```

## Cancellation and Regeneration
Stop streaming with `stop()`:
```tsx
const { stop, status } = useChat();
<button onClick={stop} disabled={!(status === 'streaming' || status === 'submitted')}>Stop</button>
```

Regenerate last message with `regenerate()`:
```tsx
const { regenerate, status } = useChat();
<button onClick={regenerate} disabled={!(status === 'ready' || status === 'error')}>Regenerate</button>
```

## UI Update Throttling
Throttle renders when receiving chunks (React only):
```tsx
const { messages, ... } = useChat({
  experimental_throttle: 50  // milliseconds
});
```

## Event Callbacks
```tsx
const { ... } = useChat({
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

## Request Configuration

### Hook-Level Configuration
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: {
      Authorization: 'your_token',
    },
    body: {
      user_id: '123',
    },
    credentials: 'same-origin',
  }),
});
```

### Dynamic Hook-Level Configuration
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

For component state that changes over time, use `useRef` to store values or prefer request-level options.

### Request-Level Configuration (Recommended)
Request-level options take precedence and allow per-request customization:
```tsx
sendMessage(
  { text: input },
  {
    headers: {
      Authorization: 'Bearer token123',
      'X-Custom-Header': 'custom-value',
    },
    body: {
      temperature: 0.7,
      max_tokens: 100,
      user_id: '123',
    },
    metadata: {
      userId: 'user123',
      sessionId: 'session456',
    },
  },
);
```

### Custom Body Fields Per Request
```tsx
sendMessage(
  { text: input },
  {
    body: {
      customKey: 'customValue',
    },
  },
);
```

Server-side retrieval:
```ts
export async function POST(req: Request) {
  const { messages, customKey }: { messages: UIMessage[]; customKey: string } = await req.json();
}
```

## Message Metadata
Attach custom metadata to messages:

Server-side:
```ts
return result.toUIMessageStreamResponse({
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
```

Client-side access:
```tsx
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

## Transport Configuration
Customize how messages are sent:

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

Server-side:
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

### Trigger-Based Routing
Handle different operations (submit, regenerate):
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

Server-side handling:
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

## Error Messages in Response
By default, error messages are masked for security. Customize with `getErrorMessage`:
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

## Usage Information
Track token consumption via message metadata:

Server-side:
```ts
import { convertToModelMessages, streamText, UIMessage, type LanguageModelUsage } from 'ai';

type MyMetadata = {
  totalUsage: LanguageModelUsage;
};

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

Client-side:
```tsx
import { useChat } from '@ai-sdk/react';
import type { MyUIMessage } from './api/chat/route';
import { DefaultChatTransport } from 'ai';

export default function Chat() {
  const { messages } = useChat<MyUIMessage>({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.parts.map(part => {
            if (part.type === 'text') return part.text;
          })}
          {m.metadata?.totalUsage && (
            <div>Total usage: {m.metadata?.totalUsage.totalTokens} tokens</div>
          )}
        </div>
      ))}
    </div>
  );
}
```

Access metadata from `onFinish` callback:
```tsx
const { messages } = useChat<MyUIMessage>({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
  onFinish: ({ message }) => {
    console.log(message.metadata?.totalUsage);
  },
});
```

## Text Streams
Handle plain text streams with `TextStreamChatTransport`:
```tsx
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';

export default function Chat() {
  const { messages } = useChat({
    transport: new TextStreamChatTransport({
      api: '/api/chat',
    }),
  });
  return <>...</>;
}
```

Note: Tool calls, usage information, and finish reasons are not available with text streams.

## Reasoning Tokens
Some models (DeepSeek `deepseek-r1`, Anthropic `claude-3-7-sonnet-20250219`) support reasoning tokens. Forward them with `sendReasoning`:

Server-side:
```ts
return result.toUIMessageStreamResponse({
  sendReasoning: true,
});
```

Client-side access:
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts.map((part, index) => {
      if (part.type === 'text') {
        return <div key={index}>{part.text}</div>;
      }
      if (part.type === 'reasoning') {
        return <pre key={index}>{part.text}</pre>;
      }
    })}
  </div>
));
```

## Sources
Some providers (Perplexity, Google Generative AI) include sources in responses. Forward them with `sendSources`:

Server-side:
```ts
return result.toUIMessageStreamResponse({
  sendSources: true,
});
```

Client-side rendering:
```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}

    {/* Render URL sources */}
    {message.parts
      .filter(part => part.type === 'source-url')
      .map(part => (
        <span key={`source-${part.id}`}>
          [
          <a href={part.url} target="_blank">
            {part.title ?? new URL(part.url).hostname}
          </a>
          ]
        </span>
      ))}

    {/* Render document sources */}
    {message.parts
      .filter(part => part.type === 'source-document')
      .map(part => (
        <span key={`source-${part.id}`}>
          [<span>{part.title ?? `Document ${part.id}`}</span>]
        </span>
      ))}
  </div>
));
```

## Image Generation
Some models (Google `gemini-2.5-flash-image-preview`) support image generation. Access file parts:

```tsx
messages.map(message => (
  <div key={message.id}>
    {message.role === 'user' ? 'User: ' : 'AI: '}
    {message.parts.map((part, index) => {
      if (part.type === 'text') {
        return <div key={index}>{part.text}</div>;
      } else if (part.type === 'file' && part.mediaType.startsWith('image/')) {
        return <img key={index} src={part.url} alt="Generated image" />;
      }
    })}
  </div>
));
```

## Attachments
Send file attachments with messages using `FileList` or file objects.

### FileList
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
                if (part.type === 'text') {
                  return <span key={index}>{part.text}</span>;
                }
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
          sendMessage({
            text: input,
            files,
          });
          setInput('');
          setFiles(undefined);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      }}>
        <input type="file" onChange={event => {
          if (event.target.files) {
            setFiles(event.target.files);
          }
        }} multiple ref={fileInputRef} />
        <input value={input} placeholder="Send message..." onChange={e => setInput(e.target.value)} disabled={status !== 'ready'} />
      </form>
    </div>
  );
}
```

Only `image/*` and `text/*` content types are automatically converted to multi-modal content parts; handle other types manually.

### File Objects
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { FileUIPart } from 'ai';

export default function Page() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState('');
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

  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>
            <div>
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return <span key={index}>{part.text}</span>;
                }
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
          sendMessage({
            text: input,
            files,
          });
          setInput('');
        }
      }}>
        <input value={input} placeholder="Send message..." onChange={e => setInput(e.target.value)} disabled={status !== 'ready'} />
      </form>
    </div>
  );
}
```

## Type Inference for Tools

### InferUITool
Infer input and output types of a single tool:
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

### InferUITools
Infer types of a `ToolSet`:
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
// { weather: { input: { location: string }; output: string }; calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number } }
```

### Using Inferred Types
```tsx
import { InferUITools, UIMessage, UIDataTypes } from 'ai';

type MyUITools = InferUITools<typeof tools>;
type MyUIMessage = UIMessage<never, UIDataTypes, MyUITools>;
```

Pass to `useChat` or `createUIMessageStream`:
```tsx
import { useChat } from '@ai-sdk/react';
import { createUIMessageStream } from 'ai';
import type { MyUIMessage } from './types';

const { messages } = useChat<MyUIMessage>();
const stream = createUIMessageStream<MyUIMessage>(/* ... */);
```


### chatbot_message_persistence
Store/load chat messages with validation, server-side ID generation, and disconnect handling using createChat, loadChat, validateUIMessages, saveChat in onFinish, generateMessageId, prepareSendMessagesRequest, and consumeStream.

## Creating and Loading Chats

Create new chats with unique IDs and redirect users:
```tsx
import { redirect } from 'next/navigation';
import { createChat } from '@util/chat-store';

export default async function Page() {
  const id = await createChat();
  redirect(`/chat/${id}`);
}
```

Implement chat storage (file-based example):
```tsx
import { generateId } from 'ai';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

export async function createChat(): Promise<string> {
  const id = generateId();
  await writeFile(getChatFile(id), '[]');
  return id;
}

export async function loadChat(id: string): Promise<UIMessage[]> {
  return JSON.parse(await readFile(getChatFile(id), 'utf8'));
}

function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), '.chats');
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}
```

## Message Validation

Validate messages from storage against current tool definitions, metadata schemas, and data part schemas before processing:
```tsx
import { validateUIMessages, TypeValidationError } from 'ai';

export async function POST(req: Request) {
  const { message, id } = await req.json();
  let validatedMessages;

  try {
    const previousMessages = await loadChat(id);
    validatedMessages = await validateUIMessages({
      messages: [...previousMessages, message],
      tools,
      metadataSchema,
      dataPartsSchema,
    });
  } catch (error) {
    if (error instanceof TypeValidationError) {
      console.error('Validation failed:', error);
      validatedMessages = [];
    } else {
      throw error;
    }
  }

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(validatedMessages),
    tools,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: validatedMessages,
    onFinish: ({ messages }) => {
      saveChat({ chatId: id, messages });
    },
  });
}
```

## Displaying Chat

Load initial messages and pass to useChat:
```tsx
// app/chat/[id]/page.tsx
import { loadChat } from '@util/chat-store';
import Chat from '@ui/chat';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const messages = await loadChat(id);
  return <Chat id={id} initialMessages={messages} />;
}

// ui/chat.tsx
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
    transport: new DefaultChatTransport({ api: '/api/chat' }),
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

## Storing Messages

Save messages in the onFinish callback:
```tsx
import { saveChat } from '@util/chat-store';
import { UIMessage } from 'ai';
import { writeFile } from 'fs/promises';

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

// In route handler:
export async function POST(req: Request) {
  const { messages, chatId } = await req.json();
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
```

## Message ID Generation

By default, user message IDs are generated client-side and AI response IDs server-side. For persistence, use server-side ID generation to ensure consistency.

Option 1 - Using generateMessageId in toUIMessageStreamResponse:
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

Option 2 - Using createUIMessageStream:
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

For client-side ID customization:
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

## Optimizing Data Transfer

Send only the last message to reduce payload:
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

// Server-side: load previous messages and append new one
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
    model: 'openai/gpt-5-mini',
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

## Handling Client Disconnects

Use consumeStream to ensure the stream completes and onFinish triggers even when client disconnects:
```tsx
import { streamText } from 'ai';
import { saveChat } from '@util/chat-store';

export async function POST(req: Request) {
  const { messages, chatId } = await req.json();

  const result = streamText({
    model,
    messages: convertToModelMessages(messages),
  });

  result.consumeStream(); // no await - runs to completion regardless of client

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: ({ messages }) => {
      saveChat({ chatId, messages });
    },
  });
}
```

When client reloads after disconnect, chat restores from storage. For production, track request state (in progress/complete) in stored messages to handle cases where streaming isn't yet complete on reload.

### chatbot_resume_streams
Resume streams after page reloads with `useChat` + `resumable-stream` + Redis: POST creates resumable stream with ID stored in persistence layer, GET reconnects via `resumeExistingStream`, incompatible with abort.

## Stream Resumption Overview

`useChat` supports resuming ongoing streams after page reloads, enabling long-running generations. Stream resumption requires persistence for messages and active streams.

**Warning**: Stream resumption is incompatible with abort functionality. Closing a tab or refreshing triggers an abort signal that breaks resumption. Do not use `resume: true` if abort functionality is needed.

## What the AI SDK Provides

- `resume` option in `useChat` that automatically reconnects to active streams
- Access to outgoing stream through `consumeSseStream` callback
- Automatic HTTP requests to resume endpoints

## What You Must Build

- Storage to track which stream belongs to each chat
- Redis to store the UIMessage stream
- Two API endpoints: POST to create streams, GET to resume them
- Integration with `resumable-stream` package to manage Redis storage

## Prerequisites

1. `resumable-stream` package - Handles publisher/subscriber mechanism
2. Redis instance - Stores stream data
3. Persistence layer - Tracks active stream ID per chat

## Implementation

### Client-side: Enable stream resumption

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

When `resume` is enabled, `useChat` makes a GET request to `/api/chat/[id]/stream` on mount to check for and resume active streams. You must send the chat ID with each request.

### POST handler: Create resumable streams

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
  const {
    message,
    id,
  }: {
    message: UIMessage | undefined;
    id: string;
  } = await req.json();

  const chat = await readChat(id);
  let messages = chat.messages;

  messages = [...messages, message!];

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

The `consumeSseStream` callback creates a resumable stream with a unique ID and stores it in Redis. The `onFinish` callback clears the active stream when complete.

### GET handler: Resume existing streams

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

  const streamContext = createResumableStreamContext({
    waitUntil: after,
  });

  return new Response(
    await streamContext.resumeExistingStream(chat.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}
```

Returns 204 (No Content) if no active stream exists. The `after` function from Next.js allows work to continue after response is sent, ensuring the resumable stream persists in Redis for later reconnection.

## Request Lifecycle

1. **Stream creation**: POST handler uses `streamText` to generate response. `consumeSseStream` callback creates resumable stream with unique ID and stores in Redis
2. **Stream tracking**: Persistence layer saves `activeStreamId` in chat data
3. **Client reconnection**: `resume` option triggers GET request to `/api/chat/[id]/stream` on mount
4. **Stream recovery**: GET handler checks for `activeStreamId` and uses `resumeExistingStream` to reconnect. Returns 204 if no active stream
5. **Completion cleanup**: `onFinish` callback clears `activeStreamId` by setting to `null`

## Customize Resume Endpoint

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export function Chat({ chatData, resume }) {
  const { messages, sendMessage } = useChat({
    id: chatData.id,
    messages: chatData.messages,
    resume,
    transport: new DefaultChatTransport({
      prepareReconnectToStreamRequest: ({ id }) => {
        return {
          api: `/api/chat/${id}/stream`,
          credentials: 'include',
          headers: {
            Authorization: 'Bearer token',
            'X-Custom-Header': 'value',
          },
        };
      },
    }),
  });

  return <div>{/* Your chat UI */}</div>;
}
```

Customize the endpoint pattern, credentials, and headers via `prepareReconnectToStreamRequest` in `DefaultChatTransport`.

## Important Considerations

- **Incompatibility with abort**: Stream resumption breaks if abort is triggered. Do not use `resume: true` if abort functionality is needed
- **Stream expiration**: Streams in Redis expire after configurable time
- **Multiple clients**: Multiple clients can connect to same stream simultaneously
- **Error handling**: GET handler returns 204 when no active stream exists
- **Security**: Ensure proper authentication and authorization for creating and resuming streams
- **Race conditions**: Clear `activeStreamId` when starting new stream to prevent resuming outdated streams

### chatbot_tool_usage
useChat and streamText tool integration: server-side auto-execute tools with execute(), client-side auto-execute via onToolCall callback, user-interaction tools displayed in UI; tool parts stream with state transitions (input-streaming → input-available → output-available/output-error); addToolOutput submits results; sendAutomaticallyWhen auto-submits; dynamic tools use generic type; error handling via state/errorText or onError callback.

## Tool Types and Flow

The AI SDK supports three types of tools in chatbot applications:
1. Automatically executed server-side tools (with `execute` method)
2. Automatically executed client-side tools (handled via `onToolCall` callback)
3. Tools requiring user interaction (displayed in UI, results added via `addToolOutput`)

Flow: User message → API route → `streamText` generates tool calls → forwarded to client → server-side tools execute automatically → client-side tools handled via `onToolCall` or displayed for user interaction → `addToolOutput` submits results → optionally auto-submit via `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls` helper.

Tool calls are integrated as typed tool parts in assistant messages, transitioning from tool call state to tool result state after execution.

## Implementation Example

**Server-side (API route):**
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
```

**Client-side:**
```tsx
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

{messages?.map(message => (
  <div key={message.id}>
    {message.parts.map(part => {
      switch (part.type) {
        case 'text':
          return part.text;
        case 'tool-askForConfirmation': {
          const callId = part.toolCallId;
          switch (part.state) {
            case 'input-streaming':
              return <div>Loading confirmation request...</div>;
            case 'input-available':
              return (
                <div>
                  {part.input.message}
                  <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'Yes, confirmed.' })}>Yes</button>
                  <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'No, denied' })}>No</button>
                </div>
              );
            case 'output-available':
              return <div>Location access allowed: {part.output}</div>;
            case 'output-error':
              return <div>Error: {part.errorText}</div>;
          }
          break;
        }
        case 'tool-getLocation': {
          const callId = part.toolCallId;
          switch (part.state) {
            case 'input-streaming':
              return <div>Preparing location request...</div>;
            case 'input-available':
              return <div>Getting location...</div>;
            case 'output-available':
              return <div>Location: {part.output}</div>;
            case 'output-error':
              return <div>Error getting location: {part.errorText}</div>;
          }
          break;
        }
        case 'tool-getWeatherInformation': {
          const callId = part.toolCallId;
          switch (part.state) {
            case 'input-streaming':
              return <pre>{JSON.stringify(part, null, 2)}</pre>;
            case 'input-available':
              return <div>Getting weather information for {part.input.city}...</div>;
            case 'output-available':
              return <div>Weather in {part.input.city}: {part.output}</div>;
            case 'output-error':
              return <div>Error getting weather for {part.input.city}: {part.errorText}</div>;
          }
          break;
        }
      }
    })}
  </div>
))}
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

For server-side errors, use `onError` function in `toUIMessageStreamResponse`:
```tsx
function errorHandler(error: unknown) {
  if (error == null) return 'unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

return result.toUIMessageStreamResponse({ onError: errorHandler });
```

## Dynamic Tools

When tools have unknown types at compile time, use generic `dynamic-tool` type instead of specific `tool-${toolName}` types:
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

Dynamic tools are useful for MCP (Model Context Protocol) tools, user-defined functions loaded at runtime, and external tool providers.

## Tool Call Streaming

Tool call streaming is enabled by default in AI SDK 5.0, allowing partial tool calls to stream in real-time. Access via `useChat` hook; typed tool parts contain partial tool calls with `state` property indicating `input-streaming`, `input-available`, `output-available`, or `output-error`.

```tsx
message.parts.map(part => {
  switch (part.type) {
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
  }
});
```

## Step Start Parts

For multi-step tool calls, use `step-start` parts to display boundaries:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'step-start':
      return index > 0 ? <div className="text-gray-500"><hr className="my-2 border-gray-300" /></div> : null;
    case 'text':
    case 'tool-askForConfirmation':
    // ...
  }
});
```

## Server-side Multi-Step Calls

Use `streamText` with `stopWhen: stepCountIs(5)` for multi-step calls when all tools have `execute` functions:
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
return result.toUIMessageStreamResponse();
```

## Important Notes

- Always check `if (toolCall.dynamic)` first in `onToolCall` handler for proper type narrowing
- Call `addToolOutput` without `await` to avoid potential deadlocks
- Tool parts use typed names like `tool-askForConfirmation` for static tools
- Render messages using the `parts` property of the message, not the message text directly

### generative_user_interfaces
Build dynamic UI by connecting LLM tool calls to React components; define tools with Zod schemas, add to streamText, render based on tool part states (input-available/output-available/output-error).

Generative UI allows LLMs to generate React components dynamically based on tool calls, creating adaptive user experiences beyond text responses.

**Core Concept**: Tools are functions provided to the model that it can decide to call based on context. Tool results are passed to React components for rendering.

**Basic Chat Setup**:
- Use `useChat` hook from `@ai-sdk/react` to manage messages and send user input
- Create API route using `streamText` with `convertToModelMessages` to process chat history
- Stream responses back with `toUIMessageStreamResponse()`

**Creating Tools**:
Define tools in `ai/tools.ts` using `createTool` with description, input schema (Zod), and execute function:
```ts
export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    return { weather: 'Sunny', temperature: 75, location };
  },
});
export const tools = { displayWeather: weatherTool };
```

**API Route Integration**:
Pass tools to `streamText` call:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are a friendly assistant!',
  messages: convertToModelMessages(messages),
  tools,
});
```

**Rendering Tool Results**:
- Create React components to display tool outputs (e.g., Weather component accepting temperature, weather, location props)
- In chat UI, iterate through `message.parts` array and check for tool-specific parts
- Tool parts use typed naming: `tool-${toolName}` (e.g., `tool-displayWeather`)
- Handle three states: `input-available` (loading), `output-available` (render component with `part.output`), `output-error` (show error with `part.errorText`)

**Scaling Pattern**:
Add more tools by defining them in `ai/tools.ts`, creating corresponding React components, and handling their tool parts in the chat UI with the same state-based rendering pattern. Each tool gets its own component and conditional rendering block.

### completion
useCompletion hook for streaming text completions with state management, input control, cancellation, throttling, event callbacks, and customizable requests.

## useCompletion Hook

The `useCompletion` hook (from `@ai-sdk/react`) creates a UI for handling text completions with real-time streaming from AI providers. It manages chat input state and automatically updates the UI as new text arrives.

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

Server-side handler:
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

### State Management

- `completion`: The streamed text response
- `input`: Current input value
- `isLoading`: Boolean indicating if request is in progress
- `error`: Error object from failed requests

### Input Control

Use `handleInputChange` and `handleSubmit` for standard form handling, or use `setInput` for granular control with custom components:

```tsx
const { input, setInput } = useCompletion();
return <MyCustomInput value={input} onChange={value => setInput(value)} />;
```

### Cancellation

Call the `stop()` function to abort streaming:

```tsx
const { stop, isLoading } = useCompletion();
return <button onClick={stop} disabled={!isLoading}>Stop</button>;
```

### UI Update Throttling

Throttle renders when receiving chunks with `experimental_throttle` (React only):

```tsx
const { completion } = useCompletion({
  experimental_throttle: 50 // milliseconds
});
```

### Event Callbacks

```tsx
const { ... } = useCompletion({
  onResponse: (response: Response) => {
    console.log('Received response:', response);
  },
  onFinish: (prompt: string, completion: string) => {
    console.log('Finished:', completion);
  },
  onError: (error: Error) => {
    console.error('Error:', error);
  },
});
```

Throwing an error in `onResponse` aborts processing and triggers `onError`.

### Request Customization

```tsx
const { ... } = useCompletion({
  api: '/api/custom-completion',
  headers: { Authorization: 'token' },
  body: { user_id: '123' },
  credentials: 'same-origin',
});
```

Customize the endpoint, headers, additional body fields, and fetch credentials.

### object_generation
useObject hook streams structured JSON objects in React/Svelte/Vue with partial results; pair with server-side streamObject; supports enum classification mode; includes loading/error states, stop handler, and lifecycle callbacks.

## Overview
`useObject` is an experimental React/Svelte/Vue hook for streaming structured JSON objects from the server. It displays partial results as they arrive, enabling real-time UI updates for generated data.

## Basic Usage
Define a Zod schema in a shared file:
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

Client-side with `useObject`:
```tsx
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from './api/notifications/schema';

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

Server-side with `streamObject`:
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
    prompt: `Generate 3 notifications for a messages app in this context:` + context,
  });
  return result.toTextStreamResponse();
}
```

Handle undefined values in JSX since results are partial during streaming.

## Enum Output Mode
For classification into predefined options, use `output: 'enum'` with a schema containing `enum` as a key:

Client:
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

Server:
```ts
const result = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['true', 'false'],
  prompt: `Classify this statement as true or false: ${context}`,
});
return result.toTextStreamResponse();
```

## State Management
`useObject` returns:
- `object`: The streamed object (partial during generation)
- `isLoading`: Boolean indicating generation in progress
- `error`: Error object from fetch request
- `submit(input)`: Function to trigger generation
- `stop()`: Function to cancel generation

## UI Patterns

Loading state with spinner and disabled button:
```tsx
const { isLoading, object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {isLoading && <Spinner />}
    <button onClick={() => submit('...')} disabled={isLoading}>
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
```

Stop button during generation:
```tsx
const { isLoading, stop, object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {isLoading && <button onClick={() => stop()}>Stop</button>}
    <button onClick={() => submit('...')}>Generate notifications</button>
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

Error handling (show generic message to avoid leaking server info):
```tsx
const { error, object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {error && <div>An error occurred.</div>}
    <button onClick={() => submit('...')}>Generate notifications</button>
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

## Event Callbacks
`useObject` accepts optional callbacks:
- `onFinish({ object, error })`: Called when generation completes. `object` is typed and undefined if schema validation fails; `error` is undefined if validation succeeds.
- `onError(error)`: Called on fetch errors.

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

## Configuration
Configure API endpoint, headers, and credentials:
```tsx
const { submit, object } = useObject({
  api: '/api/use-object',
  headers: {
    'X-Custom-Header': 'CustomValue',
  },
  credentials: 'include',
  schema: yourSchema,
});
```

### streaming_custom_data
Stream custom data alongside AI responses with type-safe data parts, sources, and transient notifications; reconcile updates via ID reuse; handle on client through onData callback and message.parts filtering.

## Overview
Stream additional data alongside model responses to the client and attach it to UIMessage parts array. Use `createUIMessageStream`, `createUIMessageStreamResponse`, or `pipeUIMessageStreamToResponse` helpers. Data streams via Server-Sent Events.

## Type-Safe Data Streaming Setup
Define custom message type with data part schemas:
```tsx
export type MyUIMessage = UIMessage<
  never,
  {
    weather: { city: string; weather?: string; status: 'loading' | 'success' };
    notification: { message: string; level: 'info' | 'warning' | 'error' };
  }
>;
```

## Server-Side Streaming
Create UIMessageStream in route handler:
```tsx
const stream = createUIMessageStream<MyUIMessage>({
  execute: ({ writer }) => {
    writer.write({
      type: 'data-notification',
      data: { message: 'Processing...', level: 'info' },
      transient: true,
    });
    writer.write({
      type: 'source',
      value: { type: 'source', sourceType: 'url', id: 'source-1', url: 'https://weather.com', title: 'Weather Data Source' },
    });
    writer.write({
      type: 'data-weather',
      id: 'weather-1',
      data: { city: 'San Francisco', status: 'loading' },
    });
    const result = streamText({ model: 'anthropic/claude-sonnet-4.5', messages: convertToModelMessages(messages) });
    writer.merge(result.toUIMessageStream());
  },
});
return createUIMessageStreamResponse({ stream });
```

## Types of Streamable Data

**Data Parts (Persistent)** - Added to message history, appear in `message.parts`:
```tsx
writer.write({ type: 'data-weather', id: 'weather-1', data: { city: 'San Francisco', status: 'loading' } });
```

**Sources** - For RAG, show referenced documents/URLs:
```tsx
writer.write({ type: 'source', value: { type: 'source', sourceType: 'url', id: 'source-1', url: 'https://example.com', title: 'Example Source' } });
```

**Transient Data Parts** - Sent to client but not added to history, only accessible via `onData` handler:
```tsx
writer.write({ type: 'data-notification', data: { message: 'Processing...', level: 'info' }, transient: true });
```

## Data Part Reconciliation
Write to same data part ID to auto-reconcile/update on client. Enables collaborative artifacts, progressive loading, live status updates, interactive components.

## Client-Side Processing

**Using onData Callback** - Handle streaming data including transient parts:
```tsx
const { messages } = useChat<MyUIMessage>({
  api: '/api/chat',
  onData: dataPart => {
    if (dataPart.type === 'data-weather') console.log('Weather:', dataPart.data);
    if (dataPart.type === 'data-notification') showToast(dataPart.data.message, dataPart.data.level);
  },
});
```
Important: Transient parts only available through `onData`, not in `message.parts`.

**Rendering Persistent Data Parts**:
```tsx
{message.parts
  .filter(part => part.type === 'data-weather')
  .map((part, index) => (
    <div key={index}>
      {part.data.status === 'loading' ? <>Getting weather for {part.data.city}...</> : <>Weather in {part.data.city}: {part.data.weather}</>}
    </div>
  ))}
{message.parts.filter(part => part.type === 'text').map((part, index) => <div key={index}>{part.text}</div>)}
{message.parts.filter(part => part.type === 'source').map((part, index) => <div key={index}><a href={part.url}>{part.title}</a></div>)}
```

## Use Cases
- RAG applications - stream sources and retrieved documents
- Real-time status - loading states and progress updates
- Collaborative tools - live updates to shared artifacts
- Analytics - usage data without cluttering history
- Notifications - temporary alerts and status messages

## Message Metadata vs Data Parts
**Message Metadata** - Message-level info (timestamps, model info, token usage, user context), attached via `message.metadata`, sent using `messageMetadata` callback in `toUIMessageStreamResponse`.

**Data Parts** - Dynamic arbitrary data, added to `message.parts`, streamed via `createUIMessageStream`, reconcilable with same ID, support transient parts.

Can also stream from custom backends (Python/FastAPI) using UI Message Stream Protocol.

### error_handling
Warnings (prefixed "AI SDK Warning:") appear for unsupported features/compatibility issues; control via globalThis.AI_SDK_LOG_WARNINGS. Error object from hooks enables UI error display; use regenerate() or setMessages() for recovery; onError callback for custom handling; throw errors in route handlers for testing.

## Warnings

The AI SDK displays warnings in the browser console when:
- Unsupported features are used (e.g., certain options or parameters not supported by the model)
- Features are used in compatibility mode, which may work differently or less optimally
- The AI model reports other issues or advisory messages

All warnings are prefixed with "AI SDK Warning:" for easy identification.

Control warning behavior:
- Disable all warnings: `globalThis.AI_SDK_LOG_WARNINGS = false;`
- Custom handler: `globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => { /* handle warnings */ };`

## Error Handling

Each AI SDK UI hook returns an `error` object for rendering errors in the UI. Use it to show error messages, disable submit buttons, or display retry buttons. Recommend showing generic error messages to users to avoid leaking server information.

Example with retry button:
```tsx
const { messages, sendMessage, error, regenerate } = useChat();
{error && (
  <>
    <div>An error occurred.</div>
    <button onClick={() => regenerate()}>Retry</button>
  </>
)}
```

Alternative approach - replace last message on error:
```tsx
const { sendMessage, error, messages, setMessages } = useChat();
function customSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (error != null) {
    setMessages(messages.slice(0, -1));
  }
  sendMessage({ text: input });
}
```

Process errors with `onError` callback in hook options:
```tsx
const { /* ... */ } = useChat({
  onError: error => {
    console.error(error);
  },
});
```

For testing, throw errors in route handlers:
```ts
export async function POST(req: Request) {
  throw new Error('This is a test error');
}
```

### transport
Control message transmission in useChat via DefaultChatTransport configuration (API endpoint, headers, credentials, body, request transformation) or implement ChatTransport interface for custom protocols.

## Default Transport

`useChat` uses HTTP POST to `/api/chat` by default. This is equivalent to explicitly using `DefaultChatTransport`:

```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});
```

## Custom Transport Configuration

Configure the default transport with custom options like headers, credentials, and API endpoint:

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

Headers, credentials, and body can be functions that return values dynamically:

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

## Request Transformation

Use `prepareSendMessagesRequest` to transform requests before sending:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => {
      return {
        headers: {
          'X-Session-ID': id,
        },
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

To build custom transports, implement the `ChatTransport` interface. Reference implementations:
- `DefaultChatTransport` - Complete HTTP transport implementation
- `HttpChatTransport` - Base HTTP transport with request handling
- `ChatTransport` - Interface defining `sendMessages` method, UI message stream processing, request/response transformation, and error/connection management

Custom transports enable alternative protocols (WebSockets), custom authentication, or specialized backend integrations.

### reading_uimessage_streams
readUIMessageStream converts UIMessageChunk streams to AsyncIterableStream of UIMessage objects; supports tool calls (text/tool-call/tool-result parts) and conversation resumption via message parameter.

## Reading UIMessage Streams

`UIMessage` streams are useful for terminal UIs, custom stream processing on the client, or React Server Components (RSC).

The `readUIMessageStream` helper transforms a stream of `UIMessageChunk` objects into an `AsyncIterableStream` of `UIMessage` objects, allowing you to process messages as they're being constructed.

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

Handle streaming responses that include tool calls by iterating over message parts and checking their types:

```tsx
import { readUIMessageStream, streamText, tool } from 'ai';
import { z } from 'zod';

async function handleToolCalls() {
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
}
```

### Resuming Conversations

Resume streaming from a previous message state by passing the last message to `readUIMessageStream`:

```tsx
async function resumeConversation(lastMessage: UIMessage) {
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: [
      { role: 'user', content: 'Continue our previous conversation.' },
    ],
  });

  for await (const uiMessage of readUIMessageStream({
    stream: result.toUIMessageStream(),
    message: lastMessage,
  })) {
    console.log('Resumed message:', uiMessage);
  }
}
```

### message_metadata
Attach custom message-level metadata (timestamps, model info, token usage) via Zod schema, send via messageMetadata callback in toUIMessageStreamResponse, access via message.metadata on client.

Message metadata allows attaching custom information at the message level (distinct from data parts which are content-level). It's useful for tracking timestamps, model information, token usage, user context, and performance metrics.

**Setup:**
Define a metadata schema using Zod for type safety:
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

**Server-side (sending metadata):**
Use the `messageMetadata` callback in `toUIMessageStreamResponse` to attach metadata at different streaming stages:
```ts
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
```

**Client-side (accessing metadata):**
Access metadata through `message.metadata` property:
```tsx
const { messages } = useChat<MyUIMessage>({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});

{messages.map(message => (
  <div key={message.id}>
    {message.metadata?.createdAt && (
      <span>{new Date(message.metadata.createdAt).toLocaleTimeString()}</span>
    )}
    {message.parts.map((part, index) =>
      part.type === 'text' ? <div key={index}>{part.text}</div> : null,
    )}
    {message.metadata?.totalTokens && (
      <div>{message.metadata.totalTokens} tokens</div>
    )}
  </div>
))}
```

**Key differences from data parts:**
Message metadata is attached at message level and is static/complete, while data parts are content-level and can change during generation. Use metadata for information about the message itself, data parts for dynamic content forming part of the message.

**Common use cases:**
- Timestamps (creation/completion)
- Model information
- Token usage and cost tracking
- User context (IDs, session info)
- Performance metrics (generation time, time to first token)
- Quality indicators (finish reason, confidence scores)

### stream_protocols
Two stream protocols for AI SDK UI: text streams (plain text chunks, `toTextStreamResponse()`) and data streams (SSE-based, `toUIMessageStreamResponse()`, supports text/reasoning/tool/source/file/custom-data parts, ends with `[DONE]`).

## Stream Protocols Overview

AI SDK UI functions (`useChat`, `useCompletion`, `useObject`) support two stream protocols for sending data to the frontend: text streams and data streams.

## Text Stream Protocol

Text streams contain plain text chunks that are appended together to form a complete response. Supported by `useChat`, `useCompletion`, and `useObject`.

**Backend**: Use `streamText()` and call `toTextStreamResponse()` on the result to return a streaming HTTP response.

**Frontend**: Enable with `streamProtocol: 'text'` option. Use `TextStreamChatTransport` with the API endpoint.

**Limitation**: Text streams only support basic text data. For tool calls and other data types, use data streams.

**Example**:
```tsx
// Frontend
const { messages, sendMessage } = useChat({
  transport: new TextStreamChatTransport({ api: '/api/chat' }),
});

// Backend
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toTextStreamResponse();
}
```

## Data Stream Protocol

Uses Server-Sent Events (SSE) format for standardization, keep-alive through ping, reconnect capabilities, and better cache handling. Default protocol for `useChat` and `useCompletion`.

**Backend**: Use `toUIMessageStreamResponse()` from `streamText` result object.

**Custom backends**: Must set `x-vercel-ai-ui-message-stream: v1` header.

**Stream ends with**: `data: [DONE]`

### Supported Stream Parts

**Message Control**:
- `start`: Beginning of new message with metadata (`{"type":"start","messageId":"..."}`)
- `finish`: Completion of message (`{"type":"finish"}`)
- `start-step`: Start of a step (one LLM API call)
- `finish-step`: Completion of a step (necessary for multiple stitched assistant calls and tool execution)

**Text Content** (start/delta/end pattern):
- `text-start`: Beginning of text block with unique ID
- `text-delta`: Incremental text content (`{"type":"text-delta","id":"...","delta":"Hello"}`)
- `text-end`: Completion of text block

**Reasoning Content** (start/delta/end pattern):
- `reasoning-start`: Beginning of reasoning block
- `reasoning-delta`: Incremental reasoning content
- `reasoning-end`: Completion of reasoning block

**Tool Execution**:
- `tool-input-start`: Beginning of tool input streaming (`{"type":"tool-input-start","toolCallId":"...","toolName":"..."}`)
- `tool-input-delta`: Incremental tool input chunks (`{"type":"tool-input-delta","toolCallId":"...","inputTextDelta":"..."}`)
- `tool-input-available`: Tool input complete and ready for execution (`{"type":"tool-input-available","toolCallId":"...","toolName":"...","input":{...}}`)
- `tool-output-available`: Result of tool execution (`{"type":"tool-output-available","toolCallId":"...","output":{...}}`)

**External References**:
- `source-url`: External URL references (`{"type":"source-url","sourceId":"...","url":"..."}`)
- `source-document`: Document/file references (`{"type":"source-document","sourceId":"...","mediaType":"file","title":"..."}`)

**Files**:
- `file`: File references with media type (`{"type":"file","url":"...","mediaType":"image/png"}`)

**Custom Data**:
- `data-*`: Custom data types with type-specific handling (`{"type":"data-weather","data":{"location":"SF","temperature":100}}`)

**Errors**:
- `error`: Error messages appended to message (`{"type":"error","errorText":"..."}`)

**Example**:
```tsx
// Frontend (default, no special config needed)
const { messages, sendMessage } = useChat();

// Backend
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

**Compatibility**: `useCompletion` only supports `text` and `data` stream parts (not tool or reasoning parts).

