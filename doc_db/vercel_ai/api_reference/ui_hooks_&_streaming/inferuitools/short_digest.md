Type helper that infers input/output types from a `ToolSet` for type-safe tool usage in UI messages.

```tsx
import { InferUITools } from 'ai';

const tools = {
  weather: {
    description: 'Get weather',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => `Weather in ${location} is sunny.`,
  },
  calculator: {
    description: 'Arithmetic',
    parameters: z.object({
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
      a: z.number(),
      b: z.number(),
    }),
    execute: async ({ operation, a, b }) => {
      const ops = { add: (x, y) => x + y, subtract: (x, y) => x - y, multiply: (x, y) => x * y, divide: (x, y) => x / y };
      return ops[operation](a, b);
    },
  },
};

type MyUITools = InferUITools<typeof tools>;
// { weather: { input: { location: string }; output: string }; calculator: { input: { operation: 'add' | 'subtract' | 'multiply' | 'divide'; a: number; b: number }; output: number } }
```