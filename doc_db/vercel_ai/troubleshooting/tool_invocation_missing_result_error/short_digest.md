**Error**: "ToolInvocation must have a result" when tool without `execute` is called.

**Fix**: Either add `execute` function to tool for server-side execution, or use `useChat` with `addToolOutput` for client-side execution:
```tsx
// Server-side
execute: async ({ location }) => ({ temperature: 72, conditions: 'sunny' })

// Client-side
onToolCall: async ({ toolCall }) => {
  addToolOutput({ tool: 'name', toolCallId, output: result });
}
```