## Problem
`useChat` body configuration is captured once at initialization and doesn't update with component state changes.

## Solution
Pass dynamic values via the second argument to `sendMessage` instead of hook-level config:

```tsx
const [temperature, setTemperature] = useState(0.7);
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});

sendMessage({ text: input }, { body: { temperature } });
```

Alternative: Use `useRef` with hook-level function config:
```tsx
const tempRef = useRef(0.7);
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chat',
    body: () => ({ temperature: tempRef.current }),
  }),
});
```