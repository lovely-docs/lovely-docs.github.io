## Language Models as Routers

Language models can act as routers by using function calling to deterministically choose which operations to perform based on user intent, while still rendering dynamic UIs.

**Function calling for routing**: Provide function definitions; the model executes the most relevant one or none if out of scope.

```tsx
generateText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'you are a friendly weather assistant!',
  prompt,
  tools: {
    getWeather: {
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    },
  },
});
```

**Routing by parameters**: Model generates correct parameters for dynamic routes (e.g., search for artworks by artist name).

**Routing by sequence**: Model executes multi-step function call sequences (e.g., schedule event by checking calendars, finding time, searching venues, creating event).