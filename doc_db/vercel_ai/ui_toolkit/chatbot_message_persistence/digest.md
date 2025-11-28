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