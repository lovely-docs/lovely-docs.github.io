## streamToResponse

**Status**: Removed in AI SDK 4.0. Use `pipeDataStreamToResponse` from `streamText` instead.

Pipes a data stream to a Node.js `ServerResponse` object and sets the status code and headers. Useful for creating data stream responses in Node.js HTTP servers.

Default behavior: status code 200, Content-Type header `text/plain; charset=utf-8`.

### Example

```ts
import { openai } from '@ai-sdk/openai';
import { StreamData, streamText, streamToResponse } from 'ai';
import { createServer } from 'http';

createServer(async (req, res) => {
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'What is the weather in San Francisco?',
  });

  const data = new StreamData();
  data.append('initialized call');

  streamToResponse(
    result.toAIStream({
      onFinal() {
        data.append('call completed');
        data.close();
      },
    }),
    res,
    {},
    data,
  );
}).listen(8080);
```

### API Signature

**Parameters:**
- `stream` (ReadableStream): Web Stream to pipe to response (from OpenAIStream, HuggingFaceStream, AnthropicStream, or AIStream)
- `response` (ServerResponse): Node.js ServerResponse object (second argument of HTTP request handler)
- `options` (Options): Configure response
  - `status` (number): HTTP status code, defaults to 200
  - `headers` (Record<string, string>): Additional headers, defaults to `{ 'Content-Type': 'text/plain; charset=utf-8' }`
- `data` (StreamData): StreamData object for forwarding additional data to client