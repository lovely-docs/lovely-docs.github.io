## dynamicTool()

Creates tools with unknown input/output types determined at runtime. Useful for MCP tools, user-defined functions, external tool sources, and dynamic generation.

### Parameters
- **description** (optional): Tool purpose and usage info
- **inputSchema**: Schema for validation (use `z.unknown()` or `z.any()` for fully dynamic inputs)
- **execute**: Async function receiving unknown input, must validate/cast at runtime
- **toModelOutput** (optional): Converts result for language model
- **providerOptions** (optional): Provider-specific metadata

### Example
```ts
const customTool = dynamicTool({
  description: 'Execute a custom user-defined function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return { result: `Executed ${action}` };
  },
});
```

### Type-Safe Mixed Usage
Check `toolCall.dynamic` flag to narrow types when combining with static tools. Dynamic tools have `unknown` input/output; static tools have full type inference.

### useChat Integration
Dynamic tools appear as `dynamic-tool` parts with `toolName` and `input` properties.