## Tool Types and Flow

Three tool types: server-side auto-execute, client-side auto-execute, and user-interaction tools. Flow: user message → API route → `streamText` generates tool calls → forwarded to client → server tools execute via `execute` method → client tools handled via `onToolCall` callback with `addToolOutput` → interactive tools displayed in UI → user interaction submits results via `addToolOutput` → `sendAutomaticallyWhen` with `lastAssistantMessageIsCompleteWithToolCalls` auto-submits.

## Example

API route:
```tsx
export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
    tools: {
      getWeatherInformation: {
        description: 'show the weather in a given city',
        inputSchema: z.object({ city: z.string() }),
        execute: async ({ city }) => {
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
}
```

Client:
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

return (
  <>
    {messages?.map(message => (
      <div key={message.id}>
        <strong>{message.role}: </strong>
        {message.parts.map(part => {
          switch (part.type) {
            case 'text':
              return part.text;
            case 'tool-askForConfirmation': {
              const callId = part.toolCallId;
              switch (part.state) {
                case 'input-available':
                  return (
                    <div key={callId}>
                      {part.input.message}
                      <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'Yes' })}>Yes</button>
                      <button onClick={() => addToolOutput({ tool: 'askForConfirmation', toolCallId: callId, output: 'No' })}>No</button>
                    </div>
                  );
                case 'output-available':
                  return <div key={callId}>Confirmed: {part.output}</div>;
              }
              break;
            }
            case 'tool-getWeatherInformation': {
              const callId = part.toolCallId;
              switch (part.state) {
                case 'input-available':
                  return <div key={callId}>Getting weather for {part.input.city}...</div>;
                case 'output-available':
                  return <div key={callId}>Weather in {part.input.city}: {part.output}</div>;
              }
              break;
            }
          }
        })}
      </div>
    ))}
    <form onSubmit={e => { e.preventDefault(); sendMessage({ text: input }); }}>
      <input value={input} onChange={e => setInput(e.target.value)} />
    </form>
  </>
);
```

## Error Handling

For client-side tool errors, use `addToolOutput` with `state: 'output-error'`:
```tsx
try {
  const weather = await getWeatherInformation(toolCall.input);
  addToolOutput({ tool: 'getWeatherInformation', toolCallId: toolCall.toolCallId, output: weather });
} catch (err) {
  addToolOutput({ tool: 'getWeatherInformation', toolCallId: toolCall.toolCallId, state: 'output-error', errorText: 'Error message' });
}
```

For LLM tool errors, use `onError` in `toUIMessageStreamResponse`:
```tsx
return result.toUIMessageStreamResponse({ onError: error => error?.message || 'unknown error' });
```

## Dynamic Tools

For runtime-unknown tools, use `dynamic-tool` type:
```tsx
case 'dynamic-tool':
  return (
    <div key={index}>
      <h4>Tool: {part.toolName}</h4>
      {part.state === 'output-available' && <pre>{JSON.stringify(part.output, null, 2)}</pre>}
      {part.state === 'output-error' && <div>Error: {part.errorText}</div>}
    </div>
  );
```

## Tool Call Streaming

Enabled by default in v5.0. Partial tool calls stream in real-time. Use `part.state` to render: `input-streaming`, `input-available`, `output-available`, `output-error`.

## Multi-Step Calls

Server-side with `stopWhen: stepCountIs(5)` when all tools have `execute`. Client-side: use `step-start` parts to display boundaries between steps.

Key notes: Check `if (toolCall.dynamic)` first in `onToolCall`. Call `addToolOutput` without `await` to avoid deadlocks. Render with typed tool part names like `tool-askForConfirmation`.