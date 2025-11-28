## Tool Types and Flow

Three tool types: automatically executed server-side tools (with `execute`), automatically executed client-side tools (via `onToolCall`), and user-interaction tools (displayed in UI). Flow: user message → API route → `streamText` generates tool calls → forwarded to client → server-side tools execute → client-side tools handled or displayed → `addToolOutput` submits results → optionally auto-submit via `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls`.

## Implementation

**Server-side:**
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
      }
    })}
  </div>
))}
```

## Error Handling

Client-side errors: use `addToolOutput` with `state: 'output-error'` and `errorText`.
Server-side errors: use `onError` function in `toUIMessageStreamResponse`.

## Dynamic Tools

Use generic `dynamic-tool` type for tools with unknown types at compile time (MCP tools, runtime-loaded functions, external providers).

## Tool Call Streaming

Enabled by default in v5.0. Partial tool calls stream in real-time with `state` property: `input-streaming`, `input-available`, `output-available`, or `output-error`.

## Step Start Parts

Use `step-start` parts to display boundaries between multi-step tool calls.

## Server-side Multi-Step Calls

Use `streamText` with `stopWhen: stepCountIs(5)` when all tools have `execute` functions.

## Important Notes

- Always check `if (toolCall.dynamic)` first in `onToolCall` for type narrowing
- Call `addToolOutput` without `await` to avoid deadlocks
- Render messages using `parts` property, not message text