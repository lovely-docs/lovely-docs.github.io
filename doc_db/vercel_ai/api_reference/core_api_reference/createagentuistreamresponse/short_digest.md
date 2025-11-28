Executes an Agent and streams output as UI messages in an HTTP Response for real-time API endpoints.

**Parameters**: `agent` (required), `messages` (required), `abortSignal` (optional), additional UIMessageStreamOptions

**Returns**: `Promise<Response>` with streamed UI messages

**Example**:
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: weatherTool, calculator: calculatorTool },
});

export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({
    agent,
    messages,
    sendSources: true,
    includeUsage: true,
  });
}
```

**Key points**: Server-side only, agent must implement `.stream()` and define tools, supports cancellation via abortSignal