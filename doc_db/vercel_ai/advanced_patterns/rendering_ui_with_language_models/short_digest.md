## Rendering UI with Language Models

Have tools return JSON objects instead of text to render React components. With client-side rendering, conditionally render components based on tool call results. For multiple tools, use `@ai-sdk/rsc`'s `createStreamableUI()` to render components on the server and stream them to the client, eliminating complex client-side conditional logic.

**Client-side example:**
```tsx
execute: async ({ city, unit }) => {
  return { temperature, unit, description, forecast };
}
// Then conditionally render: message.role === 'function' ? <WeatherCard {...} /> : null
```

**Server-side with RSC:**
```tsx
const uiStream = createStreamableUI();
execute: async ({ city, unit }) => {
  uiStream.done(<WeatherCard weather={{...}} />)
}
// Client renders: {message.display}
```