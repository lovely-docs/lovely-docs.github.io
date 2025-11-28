## Problem
When passing dynamic information via the `body` parameter at the `useChat` hook level, the data becomes stale and only reflects values from the initial component render. The body configuration is captured once during hook initialization and doesn't update with subsequent re-renders.

Example of problematic code:
```tsx
const [temperature, setTemperature] = useState(0.7);
const [userId, setUserId] = useState('user123');

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: {
      temperature, // Always 0.7 (initial value)
      userId, // Always 'user123' (initial value)
    },
  }),
});
```

Even when `temperature` or `userId` state changes, requests still use the initial values.

## Solution: Request-level options
Pass dynamic variables via the second argument of `sendMessage` instead. Request-level options are evaluated on each call and take precedence over hook-level options:

```tsx
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});

sendMessage(
  { text: input },
  {
    body: {
      temperature, // Current value at request time
      userId, // Current value at request time
    },
  },
);
```

## Alternative: Dynamic hook-level configuration with useRef
If hook-level configuration is needed, use functions that return values. For component state, access current values via `useRef`:

```tsx
const temperatureRef = useRef(0.7);

const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: () => ({
      temperature: temperatureRef.current,
      sessionId: getCurrentSessionId(),
    }),
  }),
});
```

## Server-side handling
Retrieve custom fields by destructuring the request body:

```tsx
export async function POST(req: Request) {
  const { messages, temperature, userId } = await req.json();

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
    temperature,
  });

  return result.toUIMessageStreamResponse();
}
```

**Recommendation:** Use request-level configuration for dynamic component state values—it's simpler and more reliable than hook-level configuration.