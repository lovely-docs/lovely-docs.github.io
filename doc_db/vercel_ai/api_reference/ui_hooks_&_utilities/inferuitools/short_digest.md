## InferUITools

TypeScript type helper that infers input/output types from a `ToolSet` for type-safe tool usage in `UIMessage`s.

### Import
```tsx
import { InferUITools } from 'ai';
```

### Returns
Maps each tool to `{ input: InferToolInput<T>; output: InferToolOutput<T> }`

### Example
```tsx
const tools = {
  weather: {
    description: 'Get the current weather',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => `The weather in ${location} is sunny.`,
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
// { weather: { input: { location: string }; output: string }; calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number } }
```