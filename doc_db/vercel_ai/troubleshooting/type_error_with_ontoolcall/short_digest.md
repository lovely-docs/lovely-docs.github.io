TypeScript cannot narrow `toolCall.toolName` type when mixing static and dynamic tools in `onToolCall`. Check `toolCall.dynamic` first to enable type narrowing before passing to `addToolOutput`:

```tsx
if (toolCall.dynamic) return;
addToolOutput({ tool: toolCall.toolName, ... });
```