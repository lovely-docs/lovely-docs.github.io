Type helper that infers input and output types from a tool for UIMessages.

```tsx
type WeatherUITool = InferUITool<typeof weatherTool>;
// { input: { location: string }; output: string; }
```