## Overview
`streamUI` streams React Server Components from server to client using tools that return components. The model acts as a dynamic router, calling tools based on context or returning text.

## Basic Usage
```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {},
});
```

## Tool with Streaming
```tsx
tools: {
  getWeather: {
    description: 'Get the weather for a location',
    inputSchema: z.object({ location: z.string() }),
    generate: async function* ({ location }) {
      yield <LoadingComponent />;
      const weather = await getWeather(location);
      return <WeatherComponent weather={weather} location={location} />;
    },
  },
}
```

## Next.js Setup
**Server Action** calls `streamUI` and returns `result.value`. **Client Page** calls the Server Action and renders the ReactNode in state.

```tsx
// app/actions.tsx - 'use server'
export async function streamComponent() {
  const result = await streamUI({ /* ... */ });
  return result.value;
}

// app/page.tsx - 'use client'
const [component, setComponent] = useState<React.ReactNode>();
setComponent(await streamComponent());
```

Generator functions in `generate` can yield intermediate values (loading states) before returning final components.