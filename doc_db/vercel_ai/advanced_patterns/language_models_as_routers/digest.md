## Generative User Interfaces

Language models can render user interfaces as part of their generations, creating generative user interfaces that are probabilistic rather than deterministic.

## Deterministic Routes with Probabilistic Reasoning

While generative UIs are non-deterministic by nature, language models can be constrained to deterministic outputs using function calling. When provided with function definitions, models either execute the most relevant function or execute none if the query is out of bounds.

Example: A weather assistant with a `getWeather` function will call it for weather queries but not for unrelated queries like "What events are happening in London?"

```tsx
const sendMessage = (prompt: string) =>
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
        execute: async ({ location }: { location: string }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      },
    },
  });
```

This model ability to reason about which function to execute is considered emergent reasoning behavior.

## Language Models as Routers

Traditionally, developers write routing logic to connect application parts. Language models can replace this by deciding which UI to render based on user state, enabling conversational interaction instead of navigating predefined routes.

### Routing by Parameters

Models can generate correct parameters for dynamic routes like `/profile/[username]`, `/search?q=[query]`, `/media/[id]`. In a search application, users ask the model to search for artworks by different artists, and the model calls the search function with the artist name and renders results.

### Routing by Sequence

Models can generate sequences of function calls to complete multi-step tasks. In a calendar application, asking to "schedule a happy hour with friends" triggers the model to:
1. Lookup your calendar
2. Lookup friends' calendars
3. Determine best time
4. Search for nearby happy hour spots
5. Create event and send invites

By defining functions for lookups, calendar pulls, and location searches, the model sequentially navigates routes automatically.

Use `streamUI` function to stream generative user interfaces to the client based on model responses.