## Problem
`useChat` no longer supports direct `headers`, `body`, `credentials` options on the hook.

## Solutions

**Request-Level (Recommended for Dynamic):**
```tsx
sendMessage({ text: input }, {
  headers: { Authorization: `Bearer ${getAuthToken()}` },
  body: { user_id: getCurrentUserId() },
});
```

**Hook-Level with Static Values:**
```tsx
useChat({
  transport: new DefaultChatTransport({
    headers: { 'X-API-Version': 'v1' },
    body: { model: 'gpt-5.1' },
    credentials: 'include',
  }),
});
```

**Hook-Level with Functions:**
```tsx
useChat({
  transport: new DefaultChatTransport({
    headers: () => ({ Authorization: `Bearer ${getAuthToken()}` }),
    body: () => ({ sessionId: getCurrentSessionId() }),
  }),
});
```

Request-level options override hook-level options.