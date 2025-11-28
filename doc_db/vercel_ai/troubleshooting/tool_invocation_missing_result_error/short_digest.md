## Tool Invocation Missing Result Error

Error occurs when tools without `execute` functions are called without providing results.

**Server-side (with `execute`):**
```tsx
const tools = {
  weather: tool({
    description: 'Get the weather',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ temperature: 72, conditions: 'sunny' }),
  }),
};
```

**Client-side (with `useChat` and `addToolOutput`):**
```tsx
const { addToolOutput } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  onToolCall: async ({ toolCall }) => {
    const result = await getLocationData();
    addToolOutput({
      tool: 'getLocation',
      toolCallId: toolCall.toolCallId,
      output: result,
    });
  },
});
```

Every tool call must have a result before conversation continues.