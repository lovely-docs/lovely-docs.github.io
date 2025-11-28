## dynamicTool()

Creates tools where input and output types are unknown at compile time. Useful for MCP tools without schemas, user-defined functions loaded at runtime, tools from external sources/databases, and dynamic tool generation based on user input.

Unlike the regular `tool` function, `dynamicTool` accepts and returns `unknown` types, enabling work with runtime-determined schemas.

### Import
```ts
import { dynamicTool } from 'ai';
```

### Parameters

The tool definition object accepts:

- **description** (optional, string): Information about the tool's purpose, how and when it can be used by the model
- **inputSchema** (FlexibleSchema<unknown>): Schema of expected input. While typed as unknown, a schema is still required for validation. Use Zod schemas with `z.unknown()` or `z.any()` for fully dynamic inputs
- **execute** (ToolExecuteFunction<unknown, unknown>): Async function called with tool call arguments. Input is typed as unknown and must be validated/cast at runtime. Receives ToolCallOptions with `toolCallId` (string), `messages` (ModelMessage[]), and optional `abortSignal` (AbortSignal)
- **toModelOutput** (optional, function): Converts tool result to output usable by the language model
- **providerOptions** (optional, ProviderOptions): Additional provider-specific metadata

### Returns

A `Tool<unknown, unknown>` with `type: 'dynamic'` that works with `generateText`, `streamText`, and other AI SDK functions.

### Example

```ts
import { dynamicTool } from 'ai';
import { z } from 'zod';

export const customTool = dynamicTool({
  description: 'Execute a custom user-defined function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return {
      result: `Executed ${action} with ${JSON.stringify(parameters)}`,
    };
  },
});
```

### Type-Safe Usage with Mixed Tools

When combining dynamic and static tools, check the `dynamic` flag for type narrowing:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: weatherTool,
    custom: dynamicTool({ /* ... */ }),
  },
  onStepFinish: ({ toolCalls, toolResults }) => {
    for (const toolCall of toolCalls) {
      if (toolCall.dynamic) {
        console.log('Dynamic tool:', toolCall.toolName);
        console.log('Input:', toolCall.input); // unknown type
        continue;
      }
      switch (toolCall.toolName) {
        case 'weather':
          console.log(toolCall.input.location); // TypeScript knows exact types
          break;
      }
    }
  },
});
```

### Usage with useChat

Dynamic tools appear as `dynamic-tool` parts in UIMessage format:

```tsx
{
  message.parts.map(part => {
    switch (part.type) {
      case 'dynamic-tool':
        return (
          <div>
            <h4>Tool: {part.toolName}</h4>
            <pre>{JSON.stringify(part.input, null, 2)}</pre>
          </div>
        );
    }
  });
}
```