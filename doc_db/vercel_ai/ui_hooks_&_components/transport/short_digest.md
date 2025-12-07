## Default Transport

`useChat` uses HTTP POST to `/api/chat` by default, or configure with `DefaultChatTransport`.

## Custom Configuration

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/custom-chat',
    headers: { Authorization: 'Bearer token' },
    credentials: 'include',
  }),
});
```

Support dynamic values via functions:
```tsx
headers: () => ({ Authorization: `Bearer ${getAuthToken()}` }),
body: () => ({ sessionId: getCurrentSessionId() }),
```

Transform requests with `prepareSendMessagesRequest`:
```tsx
prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => ({
  headers: { 'X-Session-ID': id },
  body: { messages: messages.slice(-10), trigger, messageId },
})
```

## Custom Transports

Implement ChatTransport interface to handle `sendMessages`, UI streams, request/response transformation, and error management.