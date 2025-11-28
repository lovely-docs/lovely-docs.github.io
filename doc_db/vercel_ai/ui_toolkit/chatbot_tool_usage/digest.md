## Tool Types and Flow

The AI SDK supports three types of tools in chatbot applications:
1. Automatically executed server-side tools (with `execute` method)
2. Automatically executed client-side tools (handled via `onToolCall` callback)
3. Tools requiring user interaction (displayed in UI, results added via `addToolOutput`)

Flow: User message → API route → `streamText` generates tool calls → forwarded to client → server-side tools execute automatically → client-side tools handled via `onToolCall` or displayed for user interaction → `addToolOutput` submits results → optionally auto-submit via `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls` helper.

Tool calls are integrated as typed tool parts in assistant messages, transitioning from tool call state to tool result state after execution.

## Implementation Example

**Server-side (API route):**
```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  tools: {
    getWeatherInformation: {
      description: 'show the weather in a given city to the user',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }: { city: string }) => {
        const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
        return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      },
    },
    askForConfirmation: {
      description: 'Ask the user for confirmation.',
      inputSchema: z.object({ message: z.string() }),
    },
    getLocation: {
      description: 'Get the user location.',
      inputSchema: z.object({}),
    },
  },
});
return result.toUIMessageStreamResponse();
```

**Client-side:**
```tsx
const { messages, sendMessage, addToolOutput } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  async onToolCall({ toolCall }) {
    if (toolCall.dynamic) return;
    if (toolCall.toolName === 'getLocation') {
      const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco'];
      addToolOutput({
        tool: 'getLocation',
        toolCallId: toolCall.toolCallId,
        output: cities[Math.floor(Math.random() * cities.length)],
      });
    }
  },
});

{messages?.map(message => (
  <div key={message.id}>
    {message.parts.map(part => {
      switch (part.type) {
        case 'text':
          return part.text;
        case 'tool-askForConfirmation': {
          const callId = part.toolCallId;
          switch (part.state) {
            case 'input-streaming':
              return <div>Loading confirmation request...</div>;
            case 'input-available':
              return (
                <div>
                  {part.input.message}
                  <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'Yes, confirmed.' })}>Yes</button>
                  <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'No, denied' })}>No</button>
                </div>
              );
            case 'output-available':
              return <div>Location access allowed: {part.output}</div>;
            case 'output-error':
              return <div>Error: {part.errorText}</div>;
          }
          break;
        }
        case 'tool-getLocation': {
          const callId = part.toolCallId;
          switch (part.state) {
            case 'input-streaming':
              return <div>Preparing location request...</div>;
            case 'input-available':
              return <div>Getting location...</div>;
            case 'output-available':
              return <div>Location: {part.output}</div>;
            case 'output-error':
              return <div>Error getting location: {part.errorText}</div>;
          }
          break;
        }
        case 'tool-getWeatherInformation': {
          const callId = part.toolCallId;
          switch (part.state) {
            case 'input-streaming':
              return <pre>{JSON.stringify(part, null, 2)}</pre>;
            case 'input-available':
              return <div>Getting weather information for {part.input.city}...</div>;
            case 'output-available':
              return <div>Weather in {part.input.city}: {part.output}</div>;
            case 'output-error':
              return <div>Error getting weather for {part.input.city}: {part.errorText}</div>;
          }
          break;
        }
      }
    })}
  </div>
))}
```

## Error Handling

For client-side tool execution errors, use `addToolOutput` with `state: 'output-error'` and `errorText`:
```tsx
async onToolCall({ toolCall }) {
  if (toolCall.dynamic) return;
  if (toolCall.toolName === 'getWeatherInformation') {
    try {
      const weather = await getWeatherInformation(toolCall.input);
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        output: weather,
      });
    } catch (err) {
      addToolOutput({
        tool: 'getWeatherInformation',
        toolCallId: toolCall.toolCallId,
        state: 'output-error',
        errorText: 'Unable to get the weather information',
      });
    }
  }
}
```

For server-side errors, use `onError` function in `toUIMessageStreamResponse`:
```tsx
function errorHandler(error: unknown) {
  if (error == null) return 'unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

return result.toUIMessageStreamResponse({ onError: errorHandler });
```

## Dynamic Tools

When tools have unknown types at compile time, use generic `dynamic-tool` type instead of specific `tool-${toolName}` types:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'tool-getWeatherInformation':
      return <WeatherDisplay part={part} />;
    case 'dynamic-tool':
      return (
        <div key={index}>
          <h4>Tool: {part.toolName}</h4>
          {part.state === 'input-streaming' && <pre>{JSON.stringify(part.input, null, 2)}</pre>}
          {part.state === 'output-available' && <pre>{JSON.stringify(part.output, null, 2)}</pre>}
          {part.state === 'output-error' && <div>Error: {part.errorText}</div>}
        </div>
      );
  }
});
```

Dynamic tools are useful for MCP (Model Context Protocol) tools, user-defined functions loaded at runtime, and external tool providers.

## Tool Call Streaming

Tool call streaming is enabled by default in AI SDK 5.0, allowing partial tool calls to stream in real-time. Access via `useChat` hook; typed tool parts contain partial tool calls with `state` property indicating `input-streaming`, `input-available`, `output-available`, or `output-error`.

```tsx
message.parts.map(part => {
  switch (part.type) {
    case 'tool-askForConfirmation':
    case 'tool-getLocation':
    case 'tool-getWeatherInformation':
      switch (part.state) {
        case 'input-streaming':
          return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
        case 'input-available':
          return <pre>{JSON.stringify(part.input, null, 2)}</pre>;
        case 'output-available':
          return <pre>{JSON.stringify(part.output, null, 2)}</pre>;
        case 'output-error':
          return <div>Error: {part.errorText}</div>;
      }
  }
});
```

## Step Start Parts

For multi-step tool calls, use `step-start` parts to display boundaries:
```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'step-start':
      return index > 0 ? <div className="text-gray-500"><hr className="my-2 border-gray-300" /></div> : null;
    case 'text':
    case 'tool-askForConfirmation':
    // ...
  }
});
```

## Server-side Multi-Step Calls

Use `streamText` with `stopWhen: stepCountIs(5)` for multi-step calls when all tools have `execute` functions:
```tsx
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  tools: {
    getWeatherInformation: {
      description: 'show the weather in a given city to the user',
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }: { city: string }) => {
        const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
        return weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      },
    },
  },
  stopWhen: stepCountIs(5),
});
return result.toUIMessageStreamResponse();
```

## Important Notes

- Always check `if (toolCall.dynamic)` first in `onToolCall` handler for proper type narrowing
- Call `addToolOutput` without `await` to avoid potential deadlocks
- Tool parts use typed names like `tool-askForConfirmation` for static tools
- Render messages using the `parts` property of the message, not the message text directly