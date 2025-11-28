## InferUITool

A type helper that infers the input and output types of a tool for use in UIMessages.

### Import
```tsx
import { InferUITool } from 'ai';
```

### Type Parameters
- `TOOL`: The tool to infer types from

### Returns
A type with the shape:
```typescript
{
  input: InferToolInput<TOOL>;
  output: InferToolOutput<TOOL>;
}
```

### Example
```tsx
import { InferUITool } from 'ai';
import { z } from 'zod';

const weatherTool = {
  description: 'Get the current weather',
  parameters: z.object({
    location: z.string().describe('The city and state'),
  }),
  execute: async ({ location }) => {
    return `The weather in ${location} is sunny.`;
  },
};

type WeatherUITool = InferUITool<typeof weatherTool>;
// Results in: { input: { location: string }; output: string; }
```

### Related Types
- `InferUITools` - for inferring types from a tool set
- `ToolUIPart` - tool part type for UI messages