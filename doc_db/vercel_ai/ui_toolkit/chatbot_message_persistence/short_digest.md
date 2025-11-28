## Core Concepts

Store and load chat messages using a storage layer (database, files, etc). Validate messages from storage against current tool definitions and schemas before processing. Use server-side ID generation for consistency across sessions.

## Key Implementations

Create chats with unique IDs:
```tsx
import { generateId } from 'ai';
export async function createChat(): Promise<string> {
  const id = generateId();
  await writeFile(getChatFile(id), '[]');
  return id;
}
```

Validate messages before processing:
```tsx
const validatedMessages = await validateUIMessages({
  messages: [...previousMessages, message],
  tools,
  metadataSchema,
  dataPartsSchema,
});
```

Save messages in onFinish callback:
```tsx
return result.toUIMessageStreamResponse({
  originalMessages: messages,
  onFinish: ({ messages }) => {
    saveChat({ chatId, messages });
  },
});
```

Generate server-side message IDs:
```tsx
return result.toUIMessageStreamResponse({
  generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
  onFinish: ({ messages }) => saveChat({ chatId, messages }),
});
```

Optimize data transfer by sending only the last message:
```tsx
transport: new DefaultChatTransport({
  api: '/api/chat',
  prepareSendMessagesRequest({ messages, id }) {
    return { body: { message: messages[messages.length - 1], id } };
  },
}),
```

Handle client disconnects with consumeStream:
```tsx
result.consumeStream(); // runs to completion even if client disconnects
return result.toUIMessageStreamResponse({
  onFinish: ({ messages }) => saveChat({ chatId, messages }),
});
```