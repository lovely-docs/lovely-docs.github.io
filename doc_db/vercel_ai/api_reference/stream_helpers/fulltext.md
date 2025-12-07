

## Pages

### streamingtextresponse
Deprecated utility for streaming text responses; replaced by streamText.toDataStreamResponse() in AI SDK 4.0

**DEPRECATED**: StreamingTextResponse has been removed in AI SDK 4.0. Use `streamText.toDataStreamResponse()` instead.

A utility class that wraps the native Response class to simplify returning a ReadableStream of text in HTTP responses. It automatically sets the status code to 200 and Content-Type header to 'text/plain; charset=utf-8'.

**Import:**
```javascript
import { StreamingTextResponse } from "ai"
```

**Parameters:**
- `stream` (ReadableStream): The stream of content for the HTTP response
- `init` (ResponseInit, optional): Customize HTTP response properties
  - `status` (number, optional): Status code (StreamingTextResponse overwrites to 200)
  - `statusText` (string, optional): Status message
  - `headers` (HeadersInit, optional): Custom headers (Content-Type is automatically set to 'text/plain; charset=utf-8')
- `data` (StreamData, optional): StreamData object for generating additional response data

**Returns:** Response instance with the ReadableStream as body, status 200, and Content-Type header set to 'text/plain; charset=utf-8'

### awsbedrockllama2stream
Deprecated AWS Bedrock stream helper (removed in SDK 4.0) that converts Bedrock responses to ReadableStream with optional onStart/onToken/onCompletion/onFinal callbacks.

**DEPRECATED**: AWSBedrockLlama2Stream has been removed in AI SDK 4.0 and is part of the legacy AWS Bedrock integration, incompatible with AI SDK 3.1 functions.

**Purpose**: Utility function that transforms AWS Bedrock API outputs into a ReadableStream, using AIStream under the hood to handle Bedrock response parsing.

**Import**:
```javascript
import { AWSBedrockLlama2Stream } from "ai"
```

**Parameters**:
- `response` (AWSBedrockResponse): The response object from AWS Bedrock
  - `body` (AsyncIterable<{ chunk?: { bytes?: Uint8Array } }>, optional): Async iterable of objects containing optional binary data chunks
- `callbacks` (AIStreamCallbacksAndOptions, optional): Callback functions for stream lifecycle
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream

### langchain_adapter
toDataStream, toDataStreamResponse, mergeIntoDataStream helpers convert LangChain output streams (StringOutputParser, AIMessageChunk, StreamEvents v2) to AI SDK data streams/responses

## Overview
The `@ai-sdk/langchain` module provides helper functions to convert LangChain output streams into AI SDK data streams and responses. It supports LangChain StringOutputParser streams, AIMessageChunk streams, and StreamEvents v2 streams.

## API Methods

**toDataStream**: Converts LangChain output streams (ReadableStream<LangChainAIMessageChunk> or ReadableStream<string>) to AIStream.

**toDataStreamResponse**: Converts LangChain output streams to a Response object with optional ResponseInit, StreamData, and callbacks.

**mergeIntoDataStream**: Merges LangChain output streams into an existing DataStreamWriter with optional callbacks.

## Examples

Convert LangChain Expression Language stream:
```tsx
import { toUIMessageStream } from '@ai-sdk/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0,
  });
  const stream = await model.stream(prompt);
  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
```

Convert StringOutputParser stream:
```tsx
const parser = new StringOutputParser();
const stream = await model.pipe(parser).stream(prompt);
return createUIMessageStreamResponse({
  stream: toUIMessageStream(stream),
});
```

### llamaindex_adapter
LlamaIndex adapter with toDataStream/toDataStreamResponse/mergeIntoDataStream to convert ChatEngine/QueryEngine streams to AI SDK data streams.

## LlamaIndex Adapter

Transforms LlamaIndex output streams into data streams and data stream responses for use with the Vercel AI SDK.

### Supported Streams
- LlamaIndex ChatEngine streams
- LlamaIndex QueryEngine streams

### API Methods

**toDataStream**
- Converts LlamaIndex output streams to data stream
- Signature: `(stream: AsyncIterable<EngineResponse>, AIStreamCallbacksAndOptions) => AIStream`

**toDataStreamResponse**
- Converts LlamaIndex output streams to data stream response
- Signature: `(stream: AsyncIterable<EngineResponse>, options?: {init?: ResponseInit, data?: StreamData, callbacks?: AIStreamCallbacksAndOptions}) => Response`

**mergeIntoDataStream**
- Merges LlamaIndex output streams into an existing data stream
- Signature: `(stream: AsyncIterable<EngineResponse>, options: { dataStream: DataStreamWriter; callbacks?: StreamCallbacks }) => void`

### Example: Convert LlamaIndex ChatEngine Stream

```tsx
import { OpenAI, SimpleChatEngine } from 'llamaindex';
import { toDataStreamResponse } from '@ai-sdk/llamaindex';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const llm = new OpenAI({ model: 'gpt-4o' });
  const chatEngine = new SimpleChatEngine({ llm });
  const stream = await chatEngine.chat({
    message: prompt,
    stream: true,
  });
  return toDataStreamResponse(stream);
}
```

