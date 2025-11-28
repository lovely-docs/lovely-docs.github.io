## InferUITools

A TypeScript type helper that infers input and output types from a `ToolSet`, enabling type-safe tool usage in `UIMessage`s.

### Import
```tsx
import { InferUITools } from 'ai';
```

### Type Parameters
- `TOOLS` (ToolSet): The tool set to infer types from

### Returns
Maps each tool in the tool set to its inferred input and output types with the shape:
```typescript
{
  [NAME in keyof TOOLS & string]: {
    input: InferToolInput<TOOLS[NAME]>;
    output: InferToolOutput<TOOLS[NAME]>;
  };
}
```

### Example
```tsx
import { InferUITools } from 'ai';
import { z } from 'zod';

const tools = {
  weather: {
    description: 'Get the current weather',
    parameters: z.object({
      location: z.string().describe('The city and state'),
    }),
    execute: async ({ location }) => {
      return `The weather in ${location} is sunny.`;
    },
  },
  calculator: {
    description: 'Perform basic arithmetic',
    parameters: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    execute: async ({ operation, a, b }) => {
      switch (operation) {
        case 'add': return a + b;
        case 'subtract': return a - b;
        case 'multiply': return a * b;
        case 'divide': return a / b;
      }
    },
  },
};

type MyUITools = InferUITools<typeof tools>;
// Results in:
// {
//   weather: { input: { location: string }; output: string };
//   calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number };
// }
```

### Related
- `InferUITool` - Infer types for a single tool
- `useChat` - Chat hook that supports typed tools