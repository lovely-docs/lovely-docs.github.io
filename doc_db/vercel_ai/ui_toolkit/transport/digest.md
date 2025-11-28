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