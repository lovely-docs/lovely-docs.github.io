## Rendering User Interfaces with Language Models

Language models generate text, but you can render React components by having tools return JSON objects instead of text strings.

### Basic Approach: Client-Side Rendering

Instead of tools returning text:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return `It is currently ${weather.value}°${unit}...`;
}
```

Return structured data:
```tsx
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return {
    temperature,
    unit,
    description,
    forecast,
  };
}
```

Then conditionally render components on the client based on tool call results:
```tsx
{messages.map(message => {
  if (message.role === 'function') {
    const { temperature, unit, description, forecast } = message.content;
    return <WeatherCard weather={{ temperature, unit, description, forecast }} />
  }
})}
```

### Managing Multiple Tools

As applications grow with multiple tools (search courses, search people, meetings, buildings, events, meals), client-side conditional rendering becomes complex with nested ternaries.

### Server-Side Rendering with AI SDK RSC

The `@ai-sdk/rsc` module provides `createStreamableUI()` to render React components on the server and stream them to the client during model generation:

```tsx
import { createStreamableUI } from '@ai-sdk/rsc'

const uiStream = createStreamableUI();

const text = generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    getWeather: {
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit })
        uiStream.done(
          <WeatherCard weather={{ temperature: 47, unit: 'F', description: 'sunny', forecast }} />
        )
      }
    }
  }
})

return { display: uiStream.value }
```

On the client, simply render the streamed UI:
```tsx
{messages.map(message => (
  <div>{message.display}</div>
))}
```

This eliminates the need for client-side conditional rendering logic. The server handles component rendering and streaming, while the client only renders what arrives from the server. All operations from language model generation to UI rendering happen on the server using React Server Components.