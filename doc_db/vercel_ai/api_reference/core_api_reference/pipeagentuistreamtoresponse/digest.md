## pipeAgentUIStreamToResponse

Executes an Agent and streams its output as a UI message stream directly to a Node.js `ServerResponse` object. Designed for building API endpoints in Node.js servers (Express, Hono, custom servers) that need low-latency, real-time UI message streaming from agents for chat or tool-use applications.

### Import
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
```

### Usage
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
import { MyCustomAgent } from './agent';

export async function handler(req, res) {
  const { messages } = JSON.parse(req.body);
  const abortController = new AbortController();

  await pipeAgentUIStreamToResponse({
    response: res,
    agent: MyCustomAgent,
    messages,
    abortSignal: abortController.signal,
  });
}
```

### Parameters
- **response** (ServerResponse, required): The Node.js ServerResponse object to which the UI message stream will be piped.
- **agent** (Agent, required): The agent instance to use for streaming responses. Must implement `.stream({ prompt })` and define tools.
- **messages** (unknown[], required): Array of input UI messages sent to the agent (typically user and assistant message objects).
- **abortSignal** (AbortSignal, optional): Abort signal to cancel streaming when client disconnects or timeout occurs. Provide an instance from `AbortController`.
- **...options** (UIMessageStreamResponseInit & UIMessageStreamOptions, optional): Options for response headers, status, and additional streaming configuration.

### Returns
`Promise<void>` - resolves when piping the UI message stream to the ServerResponse is complete.

### Example: Hono/Express Route Handler
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
import { openaiWebSearchAgent } from './openai-web-search-agent';

app.post('/chat', async (req, res) => {
  const { messages } = await getJsonBody(req);
  const abortController = new AbortController();

  await pipeAgentUIStreamToResponse({
    response: res,
    agent: openaiWebSearchAgent,
    messages,
    abortSignal: abortController.signal,
  });
});
```

### How It Works
1. Creates a UI message stream from the agent and pipes it to the provided Node.js `ServerResponse`, setting appropriate HTTP headers (content type, streaming-friendly headers) and status.
2. If `abortSignal` is provided, you can cancel the streaming response early (e.g., on client disconnect or timeout), improving resource usage and responsiveness.
3. Unlike serverless `Response`-returning APIs, this function does not return a Response object. It writes streaming bytes directly to the Node.js response, which is more memory- and latency-efficient for Node.js server frameworks.

### Notes
- **abortSignal for Cancellation**: Use `abortSignal` to stop agent and stream processing early. In Express or Hono, tie this to server disconnect or timeout events when possible.
- **Only for Node.js**: Intended for Node.js environments with access to `ServerResponse` objects, not for Edge/serverless/server-side frameworks using web `Response` objects.
- **Streaming Support**: Ensure client and reverse proxy/server infrastructure support streaming HTTP responses.
- Supports Hono (`@hono/node-server`), Express, and similar Node.js frameworks.

### Related
- `createAgentUIStreamResponse` - alternative for creating agent UI stream responses
- `Agent` - agent interface
- `UIMessageStreamOptions` - streaming configuration options
- `UIMessage` - message type