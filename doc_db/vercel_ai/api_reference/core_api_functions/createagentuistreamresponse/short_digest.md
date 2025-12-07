Executes an Agent and streams output as HTTP Response with UI messages. Takes agent, messages array, optional abortSignal, and UIMessageStreamOptions. Validates messages, calls agent's `.stream()` method, returns Promise<Response> with streaming chunks. Server-side only.

**Example:**
```ts
export async function POST(request: Request) {
  const { messages } = await request.json();
  return createAgentUIStreamResponse({
    agent: new ToolLoopAgent({ model, instructions, tools }),
    messages,
    sendSources: true,
    includeUsage: true,
  });
}
```