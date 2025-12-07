## Streaming Values

Two RSC utilities for server-to-client streaming:

**`createStreamableValue`** - Stream serializable values (strings, objects, etc.)
```tsx
const streamable = createStreamableValue('initial');
streamable.update('new value');
streamable.done('final');
// Client: for await (const v of readStreamableValue(streamable)) { ... }
```

**`createStreamableUI`** - Stream React components
```tsx
const ui = createStreamableUI();
ui.update(<div>Loading...</div>);
ui.done(<div>Done!</div>);
// Client: const component = await getWeather(); setUI(component);
```

Both support granular control over streaming. Pair with `streamText`/`streamObject` for LLM generations.