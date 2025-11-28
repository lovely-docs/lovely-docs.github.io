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
