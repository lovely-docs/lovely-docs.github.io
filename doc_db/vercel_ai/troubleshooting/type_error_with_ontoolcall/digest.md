When using `onToolCall` callback with TypeScript and both static and dynamic tools, TypeScript cannot automatically narrow the type of `toolCall.toolName`, causing type errors when passing it to `addToolOutput`.

**Problem**: Static tools have specific literal types for their names (e.g., `"getWeatherInformation"`), while dynamic tools have `toolName` as a generic `string`. TypeScript cannot guarantee that `toolCall.toolName` matches your specific tool names.

```tsx
// ❌ Type error: Type 'string' is not assignable to type '"yourTool" | "yourOtherTool"'
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    addToolOutput({
      tool: toolCall.toolName,
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

**Solution**: Check if the tool is dynamic first to enable proper type narrowing:

```tsx
// ✅ Correct approach
const { messages, sendMessage, addToolOutput } = useChat({
  async onToolCall({ toolCall }) {
    if (toolCall.dynamic) {
      return;
    }
    // Now TypeScript knows this is a static tool with the correct type
    addToolOutput({
      tool: toolCall.toolName,
      toolCallId: toolCall.toolCallId,
      output: someOutput,
    });
  },
});
```

This solution also applies to the deprecated `addToolResult` method.