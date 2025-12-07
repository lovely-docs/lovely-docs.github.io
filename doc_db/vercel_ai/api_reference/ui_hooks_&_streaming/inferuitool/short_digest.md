Type helper that infers `{ input, output }` types from a tool definition for type-safe UI message handling.

**Example**:
```tsx
const weatherTool = {
  description: 'Get the current weather',
  parameters: z.object({ location: z.string() }),
  execute: async ({ location }) => `Weather in ${location} is sunny.`,
};

type WeatherUITool = InferUITool<typeof weatherTool>;
// { input: { location: string }; output: string; }
```