## Overview
`streamToResponse` pipes a data stream to a Node.js `ServerResponse` object and sets the status code and headers. **Note: This function has been removed in AI SDK 4.0 - use `pipeDataStreamToResponse` from `streamText` instead.**

## Purpose
Creates data stream responses in environments using `ServerResponse` objects, such as Node.js HTTP servers.

## Default Behavior
- Status code: 200
- Content-Type header: `text/plain; charset=utf-8`

## Import
```ts
import { streamToResponse } from "ai"
```

## Example
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

## API Signature

### Parameters
- **stream** (ReadableStream): The Web Stream to pipe to the response. Can be return value of OpenAIStream, HuggingFaceStream, AnthropicStream, or AIStream instance.
- **response** (ServerResponse): The Node.js ServerResponse object to pipe the stream to (usually second argument of HTTP request handler).
- **options** (Options): Configure the response
  - **status** (number): Status code to set on response. Defaults to 200.
  - **headers** (Record<string, string>): Additional headers to set on response. Defaults to `{ 'Content-Type': 'text/plain; charset=utf-8' }`.
- **data** (StreamData): StreamData object for forwarding additional data to the client.