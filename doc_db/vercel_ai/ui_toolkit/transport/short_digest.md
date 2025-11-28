## Default Transport

`useChat` uses HTTP POST to `/api/chat` by default, or explicitly with `DefaultChatTransport({ api: '/api/chat' })`.

## Custom Configuration

Configure with custom API endpoint, headers, credentials, and body:

```tsx
new DefaultChatTransport({
  api: '/api/custom-chat',
  headers: { Authorization: 'Bearer token' },
  credentials: 'include',
})
```

Headers, credentials, and body accept functions for dynamic values:

```tsx
headers: () => ({ Authorization: `Bearer ${getAuthToken()}` })
```

## Request Transformation

Transform requests with `prepareSendMessagesRequest`:

```tsx
prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => ({
  headers: { 'X-Session-ID': id },
  body: { messages: messages.slice(-10), trigger, messageId },
})
```

## Custom Transports

Implement `ChatTransport` interface to support alternative protocols (WebSockets), custom authentication, or specialized backends. Reference `DefaultChatTransport`, `HttpChatTransport`, and `ChatTransport` interface in source code.