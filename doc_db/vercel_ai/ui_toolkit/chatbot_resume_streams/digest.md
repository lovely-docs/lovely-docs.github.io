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