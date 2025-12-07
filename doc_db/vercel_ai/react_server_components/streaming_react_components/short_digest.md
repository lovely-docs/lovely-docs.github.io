## streamUI: Stream React Components

`streamUI` streams React Server Components from server to client. Tools return React components instead of text. Use generator functions in tool `generate` to yield loading states before final components.

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
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
  },
});
```

## Next.js Setup

Create Server Action in `app/actions.tsx` calling `streamUI`, return `result.value`. Create client page in `app/page.tsx` with `'use client'` directive that calls the Server Action on form submission and renders the returned ReactNode via state.