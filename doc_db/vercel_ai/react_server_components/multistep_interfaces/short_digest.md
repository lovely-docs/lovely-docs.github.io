## Multistep Interfaces

Build multi-step UIs by composing tools and managing application context. Use `streamUI` with tools that have `generate` functions returning React components. Manage state with `useUIState` and trigger actions with `useActions`.

Example: Flight booking with searchFlights and lookupFlight tools:

```tsx
const ui = await streamUI({
  model: openai('gpt-4o'),
  tools: {
    searchFlights: {
      description: 'search for flights',
      inputSchema: z.object({
        source: z.string(),
        destination: z.string(),
        date: z.string(),
      }),
      generate: async function* ({ source, destination, date }) {
        yield `Searching...`;
        const results = await searchFlights(source, destination, date);
        return <Flights flights={results} />;
      },
    },
  },
});
```

Create AI context with `createAI`, wrap app in provider, call Server Action from page using `useActions` and `useUIState`. Convert tool components to client components to add interactivity with clickable elements triggering next steps.