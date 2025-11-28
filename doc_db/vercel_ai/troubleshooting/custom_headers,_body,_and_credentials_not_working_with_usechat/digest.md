## Problem
The `useChat` hook no longer supports direct configuration of `headers`, `body`, and `credentials` options on the hook itself. These options are silently ignored.

## Solution: Three Approaches

**Option 1: Request-Level Configuration (Recommended for Dynamic Values)**
Pass options when calling `sendMessage()` for values that change over time:
```tsx
const { messages, sendMessage } = useChat();

sendMessage(
  { text: input },
  {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      'X-Request-ID': generateRequestId(),
    },
    body: {
      temperature: 0.7,
      max_tokens: 100,
      user_id: getCurrentUserId(),
      sessionId: getCurrentSessionId(),
    },
  },
);
```

**Option 2: Hook-Level Configuration with Static Values**
Use `DefaultChatTransport` for values that don't change:
```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    headers: {
      'X-API-Version': 'v1',
      'X-App-ID': 'my-app',
    },
    body: {
      model: 'gpt-5.1',
      stream: true,
    },
    credentials: 'include',
  }),
});
```

**Option 3: Hook-Level Configuration with Functions**
Use functions for dynamic values at hook level (request-level is generally preferred):
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
    credentials: () => (isAuthenticated() ? 'include' : 'same-origin'),
  }),
});
```

## Precedence
Request-level options override hook-level options. You can combine both approaches:
```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    headers: { 'X-API-Version': 'v1' },
    body: { model: 'gpt-5.1' },
  }),
});

sendMessage(
  { text: input },
  {
    headers: { 'X-API-Version': 'v2' }, // Overrides hook-level
    body: { model: 'gpt-5-mini' }, // Overrides hook-level
  },
);
```

For component state that changes, use request-level configuration. If using hook-level functions with changing state, consider `useRef` to store current values.