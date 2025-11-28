## Streaming Values with RSC API

Two main functions for streaming server-to-client:

**`createStreamableValue`** - Stream serializable values (strings, numbers, objects, arrays):
```tsx
const streamableStatus = createStreamableValue('initial');
streamableStatus.update('new value');
streamableStatus.done('final value');
return { status: streamableStatus.value };
```

Read on client with `readStreamableValue()` async iterator.

**`createStreamableUI`** - Stream React components:
```tsx
const weatherUI = createStreamableUI();
weatherUI.update(<div>Loading...</div>);
weatherUI.done(<div>Final content</div>);
return weatherUI.value;
```

Render returned UI directly on client. Users see updates as stream progresses.

Both can pair with `streamText`/`streamObject` for LLM streaming. RSC is experimental; use AI SDK UI for production.