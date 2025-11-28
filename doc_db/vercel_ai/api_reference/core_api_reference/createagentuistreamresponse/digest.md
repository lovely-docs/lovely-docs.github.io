## Purpose
Executes an Agent and streams its output as a UI message stream in an HTTP Response body, designed for building API endpoints that deliver real-time streaming results from agents in chat or tool-use applications.

## Import
```ts
import { createAgentUIStreamResponse } from "ai"
```

## Parameters
- `agent` (required): Agent instance that implements `.stream({ prompt })` and defines tools
- `messages` (required): Array of input UI messages (typically user and assistant message objects)
- `abortSignal` (optional): AbortSignal for cancellation support when client disconnects
- `...options` (optional): Additional UIMessageStreamOptions like `sendSources`, `includeUsage`, `experimental_transform`

## Returns
`Promise<Response>` with a stream of UI messages from the agent, suitable as HTTP response in server-side API routes.

## Usage Example
```ts
import { ToolLoopAgent, createAgentUIStreamResponse } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
});

export async function POST(request: Request) {
  const { messages } = await request.json();
  const abortController = new AbortController();

  return createAgentUIStreamResponse({
    agent,
    messages,
    abortSignal: abortController.signal,
    sendSources: true,
    includeUsage: true,
  });
}
```

## How It Works
1. **Message Validation**: Incoming messages are validated and normalized according to agent's tools and requirements
2. **Conversion**: Validated messages are transformed to internal model message format
3. **Streaming**: Agent's `.stream({ prompt })` method is called, producing stream of UI message chunks
4. **HTTP Response**: Stream is returned as streaming Response object for consumption by clients

## Important Notes
- Agent must define its `tools` and implement `.stream({ prompt })`
- Server-side only; do not use in browser
- Returned Response uses Readable Streams; ensure client/framework can consume streamed HTTP responses
- Supports cancellation via abortSignal for long-running requests