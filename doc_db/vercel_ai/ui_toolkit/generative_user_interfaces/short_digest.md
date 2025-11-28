Generative UI connects LLM tool calls to React components for dynamic UI rendering.

**Tools**: Define with `createTool` (description, Zod schema, execute function), add to `streamText` call.

**Rendering**: Check `message.parts` for `tool-${toolName}` parts, handle states (`input-available`, `output-available`, `output-error`), render React component with `part.output`.

**Example**:
```ts
// Tool
export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({ location: z.string() }),
  execute: async ({ location }) => ({ weather: 'Sunny', temperature: 75, location }),
});

// Component
export const Weather = ({ temperature, weather, location }) => (
  <div><h2>Weather for {location}</h2><p>{weather}, {temperature}°C</p></div>
);

// Render in chat
if (part.type === 'tool-displayWeather') {
  if (part.state === 'output-available') return <Weather {...part.output} />;
}
```