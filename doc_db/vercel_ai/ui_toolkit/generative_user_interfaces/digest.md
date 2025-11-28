Generative UI allows LLMs to generate React components dynamically based on tool calls, creating adaptive user experiences beyond text responses.

**Core Concept**: Tools are functions provided to the model that it can decide to call based on context. Tool results are passed to React components for rendering.

**Basic Chat Setup**:
- Use `useChat` hook from `@ai-sdk/react` to manage messages and send user input
- Create API route using `streamText` with `convertToModelMessages` to process chat history
- Stream responses back with `toUIMessageStreamResponse()`

**Creating Tools**:
Define tools in `ai/tools.ts` using `createTool` with description, input schema (Zod), and execute function:
```ts
export const weatherTool = createTool({
  description: 'Display the weather for a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async function ({ location }) {
    return { weather: 'Sunny', temperature: 75, location };
  },
});
export const tools = { displayWeather: weatherTool };
```

**API Route Integration**:
Pass tools to `streamText` call:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  system: 'You are a friendly assistant!',
  messages: convertToModelMessages(messages),
  tools,
});
```

**Rendering Tool Results**:
- Create React components to display tool outputs (e.g., Weather component accepting temperature, weather, location props)
- In chat UI, iterate through `message.parts` array and check for tool-specific parts
- Tool parts use typed naming: `tool-${toolName}` (e.g., `tool-displayWeather`)
- Handle three states: `input-available` (loading), `output-available` (render component with `part.output`), `output-error` (show error with `part.errorText`)

**Scaling Pattern**:
Add more tools by defining them in `ai/tools.ts`, creating corresponding React components, and handling their tool parts in the chat UI with the same state-based rendering pattern. Each tool gets its own component and conditional rendering block.