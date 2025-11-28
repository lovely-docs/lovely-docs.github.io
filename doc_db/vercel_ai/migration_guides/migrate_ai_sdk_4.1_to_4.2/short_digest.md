## Stable APIs
- `customProvider`, `providerOptions`, `providerMetadata`, `toolCallStreaming` no longer have `experimental_` prefix

## Dependencies
- Requires `zod` `^3.23.8` (non-optional)

## UI Message Parts
`useChat` now combines assistant messages into single message with `parts` array instead of separate messages:

```javascript
// Old
message.content = "Final answer: 42";
message.reasoning = "...";
message.toolInvocations = [...];

// New
message.parts = [
  { type: "text", text: "Final answer: 42" },
  { type: "reasoning", reasoning: "..." },
  { type: "tool-invocation", toolInvocation: {...} },
];
```

Update UI to iterate `message.parts` and handle types: `text`, `source`, `reasoning`, `tool-invocation`, `file`.