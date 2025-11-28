## Stable APIs

The following APIs are now stable and no longer prefixed with `experimental_`:
- `customProvider`
- `providerOptions` (renamed from `providerMetadata` for provider-specific inputs)
- `providerMetadata` (for provider-specific outputs)
- `toolCallStreaming` option for `streamText`

## Dependency Versions

AI SDK 4.2 requires `zod` dependency with version `^3.23.8` (non-optional).

## UI Message Parts - Major Change

The `useChat` hook now combines assistant messages with tool calling into a single message with multiple parts instead of creating separate messages for each step.

### Previous Format
```javascript
message.content = "Final answer: 42";
message.reasoning = "First I'll calculate X, then Y...";
message.toolInvocations = [{toolName: "calculator", args: {...}}];
```

### New Format
```javascript
message.parts = [
  { type: "text", text: "Final answer: 42" },
  { type: "reasoning", reasoning: "First I'll calculate X, then Y..." },
  { type: "tool-invocation", toolInvocation: { toolName: "calculator", args: {...} } },
];
```

### Migration Example
Update UI components to iterate over `message.parts` array and handle each part type:

```javascript
function Chat() {
  const { messages } = useChat();
  return (
    <div>
      {messages.map(message =>
        message.parts.map((part, i) => {
          switch (part.type) {
            case 'text':
              return <p key={i}>{part.text}</p>;
            case 'source':
              return <p key={i}>{part.source.url}</p>;
            case 'reasoning':
              return <div key={i}>{part.reasoning}</div>;
            case 'tool-invocation':
              return <div key={i}>{part.toolInvocation.toolName}</div>;
            case 'file':
              return (
                <img
                  key={i}
                  src={`data:${part.mediaType};base64,${part.data}`}
                />
              );
          }
        }),
      )}
    </div>
  );
}
```

The old format fields remain available for backward compatibility but migration to the new format is recommended for better multi-modal and multi-step interaction support.