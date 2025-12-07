## Rendering UI with Language Models

Return JSON objects from tools instead of text to render React components. For multiple tools, use `@ai-sdk/rsc`'s `createStreamableUI()` to render components on the server and stream them to the client, avoiding complex client-side conditional logic.

```tsx
// Tool returns JSON
execute: async ({ city, unit }) => {
  const weather = getWeather({ city, unit });
  return { temperature, unit, description, forecast };
}

// Server-side rendering with RSC
import { createStreamableUI } from '@ai-sdk/rsc';
const uiStream = createStreamableUI();
uiStream.done(<WeatherCard weather={{ temperature: 47, unit: 'F', description: 'sunny' }} />);
return { display: uiStream.value };

// Client just renders the stream
{messages.map(message => <div>{message.display}</div>)}
```