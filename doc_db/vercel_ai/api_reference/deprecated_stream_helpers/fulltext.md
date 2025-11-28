

## Pages

### aistream
Deprecated stream helper that converts fetch responses to readable streams with custom parsing and callbacks; replaced by streamText.toDataStreamResponse().

AIStream creates a readable stream for AI responses from fetch responses. It serves as the basis for OpenAIStream and AnthropicStream, enabling controlled handling of AI response streams compatible with useChat and useCompletion.

**Deprecation**: AIStream has been removed in AI SDK 4.0. Use `streamText.toDataStreamResponse()` instead.

**Error Handling**: AIStream throws an error if the response doesn't have a 2xx status code, ensuring streams are only created for successful responses.

**API Parameters**:
- `response` (Response): The fetch response object used as the source of the readable stream
- `customParser` ((data: string) => string | void): Function that parses stream events by extracting message content from stringified chunks from the LLM
- `callbacks` (AIStreamCallbacksAndOptions): Optional callback functions:
  - `onStart` (() => Promise<void>): Called at the start of stream processing
  - `onToken` ((token: string) => Promise<void>): Called for each token in the stream
  - `onCompletion` ((completion: string) => Promise<void>): Called for every completion with the completion string
  - `onFinal` ((completion: string) => Promise<void>): Called once when the stream closes with the final completion message

**Import**: `import { AIStream } from "ai"`

### streamingtextresponse
Deprecated utility for streaming text responses; use streamText.toDataStreamResponse() instead. Wraps ReadableStream with auto status 200 and text/plain Content-Type.

**DEPRECATED**: StreamingTextResponse has been removed in AI SDK 4.0. Use `streamText.toDataStreamResponse()` instead.

**Purpose**: Utility class that simplifies returning a ReadableStream of text in HTTP responses. Lightweight wrapper around the native Response class.

**Automatic Setup**:
- Status code: 200
- Content-Type header: 'text/plain; charset=utf-8'

**Import**:
```
import { StreamingTextResponse } from "ai"
```

**Parameters**:
1. `stream` (ReadableStream, required): The stream of content representing the HTTP response
2. `init` (ResponseInit, optional): Customize HTTP response properties
   - `status` (number, optional): Status code - StreamingTextResponse overwrites with 200
   - `statusText` (string, optional): Status message for the status code
   - `headers` (HeadersInit, optional): Custom headers - StreamingTextResponse adds 'Content-Type': 'text/plain; charset=utf-8'
3. `data` (StreamData, optional): StreamData object for generating additional response data

**Returns**: Response instance with the provided ReadableStream as body, status 200, and Content-Type header set to 'text/plain; charset=utf-8'. Additional headers and properties can be added via init parameter.

### streamtoresponse
Deprecated function (removed in v4.0) that pipes ReadableStream to Node.js ServerResponse with configurable status/headers; use pipeDataStreamToResponse instead.

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

### openaistream
Deprecated OpenAIStream converts OpenAI responses to ReadableStream with onStart/onToken/onCompletion/onFinal callbacks; replaced by AI SDK OpenAI Provider in v4.0.

OpenAIStream is a legacy helper function that transforms responses from OpenAI's language models into a ReadableStream. It has been removed in AI SDK 4.0 and is not compatible with AI SDK 3.1 functions - the AI SDK OpenAI Provider should be used instead.

The function accepts a Response object from the OpenAI Provider SDK and optional callbacks for stream processing:
- `onStart()`: Called at the beginning of stream processing
- `onToken(token: string)`: Called for each token in the stream
- `onCompletion(completion: string)`: Called for every completion
- `onFinal(completion: string)`: Called once when the stream closes with the final message

Prior to v4, the official OpenAI API SDK did not support the Edge Runtime and only worked in serverless environments. The openai-edge package (based on fetch instead of axios) works in the Edge Runtime, so openai v4+ or openai-edge is recommended.

Import: `import { OpenAIStream } from "ai"`

### anthropicstream
Deprecated AnthropicStream utility (removed in v4.0) converts Anthropic SDK responses to ReadableStream with optional callbacks for start/token/completion/final events; use AI SDK Anthropic Provider instead.

**AnthropicStream** is a legacy utility function that transforms Anthropic SDK responses into a ReadableStream. It has been removed in AI SDK 4.0 and is not compatible with AI SDK 3.1 functions.

**Import:**
```
import { AnthropicStream } from "ai"
```

**Parameters:**
- `response` (Response): The response object from an Anthropic Provider SDK call
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object containing callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns:** ReadableStream

**Note:** This is part of the legacy Anthropic integration. The recommended approach is to use the AI SDK Anthropic Provider instead.

### awsbedrockanthropicmessagesstream
Deprecated AWS Bedrock stream helper (removed in SDK 4.0) that converts Bedrock responses to ReadableStream with optional lifecycle callbacks.

**DEPRECATED**: AWSBedrockAnthropicMessagesStream has been removed in AI SDK 4.0 and is part of the legacy AWS Bedrock integration, incompatible with AI SDK 3.1 functions.

**Purpose**: Utility function that transforms AWS Bedrock API outputs into a ReadableStream, using AIStream under the hood to handle parsing Bedrock's response format.

**Import**:
```
import { AWSBedrockAnthropicMessagesStream } from "ai"
```

**Parameters**:
- `response` (AWSBedrockResponse, required): The response object from AWS Bedrock containing:
  - `body` (AsyncIterable<{ chunk?: { bytes?: Uint8Array } }>, optional): Async iterable of objects with optional binary data chunks
  
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream

### awsbedrockcoherestream
Deprecated stream helper (removed in v4.0) that converts AWS Bedrock Cohere responses to ReadableStream with optional lifecycle callbacks.

AWSBedrockCohereStream is a deprecated utility function that transforms AWS Bedrock API outputs into a ReadableStream. It has been removed in AI SDK 4.0 and is part of the legacy AWS Bedrock integration that is incompatible with AI SDK 3.1 functions.

**Import:**
```
import { AWSBedrockCohereStream } from "ai"
```

**Parameters:**
- `response` (AWSBedrockResponse): The response object from AWS Bedrock containing an optional async iterable `body` property with binary data chunks (`AsyncIterable<{ chunk?: { bytes?: Uint8Array } }>`)
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with optional callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns:** ReadableStream

The function uses AIStream under the hood and handles parsing Bedrock's response format.

### googlegenerativeaistream
Deprecated utility converting Google Generative AI SDK responses to ReadableStream with optional lifecycle callbacks; removed in AI SDK 4.0, replaced by native provider.

GoogleGenerativeAIStream is a deprecated utility function that transforms Google Generative AI SDK responses into ReadableStream objects. It uses AIStream internally with a parser specific to Google's response structure.

**Status**: Removed in AI SDK 4.0. Part of legacy Google Generative AI integration, incompatible with AI SDK 3.1 functions. Use the AI SDK Google Generative AI Provider instead.

**Import**: `import { GoogleGenerativeAIStream } from "ai"`

**Parameters**:
- `response`: Object with `stream: AsyncIterable<GenerateContentResponse>` - the response object from Google Generative AI API
- `callbacks` (optional): AIStreamCallbacksAndOptions object with optional callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message

**Returns**: ReadableStream

**Environments**: Supported in Node.js, Edge Runtime, and browser environments.

### langchain_adapter
Helper functions to convert LangChain output streams (StringOutputParser, AIMessageChunk, StreamEvents v2) to AI SDK data streams via toDataStream, toDataStreamResponse, or mergeIntoDataStream

## Overview
The `@ai-sdk/langchain` module provides helper functions to convert LangChain output streams into AI SDK data streams and responses.

## Supported Stream Types
- LangChain StringOutputParser streams
- LangChain AIMessageChunk streams
- LangChain StreamEvents v2 streams

## API Methods

**toDataStream**
- Signature: `(stream: ReadableStream<LangChainAIMessageChunk> | ReadableStream<string>, AIStreamCallbacksAndOptions) => AIStream`
- Converts LangChain output streams to data stream

**toDataStreamResponse**
- Signature: `(stream: ReadableStream<LangChainAIMessageChunk> | ReadableStream<string>, options?: {init?: ResponseInit, data?: StreamData, callbacks?: AIStreamCallbacksAndOptions}) => Response`
- Converts LangChain output streams to data stream response

**mergeIntoDataStream**
- Signature: `(stream: ReadableStream<LangChainStreamEvent> | ReadableStream<LangChainAIMessageChunk> | ReadableStream<string>, options: { dataStream: DataStreamWriter; callbacks?: StreamCallbacks }) => void`
- Merges LangChain output streams into an existing data stream

## Examples

**LangChain Expression Language Stream**
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

**StringOutputParser Stream**
```tsx
import { toUIMessageStream } from '@ai-sdk/langchain';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import { createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const model = new ChatOpenAI({
    model: 'gpt-3.5-turbo-0125',
    temperature: 0,
  });
  const parser = new StringOutputParser();
  const stream = await model.pipe(parser).stream(prompt);
  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
```

### llamaindex_adapter
@ai-sdk/llamaindex adapter: toDataStream/toDataStreamResponse/mergeIntoDataStream convert LlamaIndex ChatEngine/QueryEngine streams to AI SDK data streams.

The `@ai-sdk/llamaindex` package provides helper functions to convert LlamaIndex output streams into AI SDK data streams and responses.

**Supported stream types:**
- LlamaIndex ChatEngine streams
- LlamaIndex QueryEngine streams

**API Methods:**

1. `toDataStream(stream: AsyncIterable<EngineResponse>, AIStreamCallbacksAndOptions): AIStream` - Converts LlamaIndex output streams to data stream.

2. `toDataStreamResponse(stream: AsyncIterable<EngineResponse>, options?: {init?: ResponseInit, data?: StreamData, callbacks?: AIStreamCallbacksAndOptions}): Response` - Converts LlamaIndex output streams to data stream response.

3. `mergeIntoDataStream(stream: AsyncIterable<EngineResponse>, options: { dataStream: DataStreamWriter; callbacks?: StreamCallbacks }): void` - Merges LlamaIndex output streams into an existing data stream.

**Example - Convert LlamaIndex ChatEngine Stream:**
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

Import: `import { toDataResponse } from "@ai-sdk/llamaindex"`

### mistralstream
Deprecated MistralStream helper converts Mistral API responses to ReadableStream with optional callbacks for token/completion events; removed in SDK 4.0, use Mistral Provider instead.

MistralStream is a deprecated helper function that transforms output from Mistral's language models into a ReadableStream. It has been removed in AI SDK 4.0 and is part of the legacy Mistral integration that is incompatible with AI SDK 3.1 functions. The recommended approach is to use the AI SDK Mistral Provider instead.

The function works with the official Mistral API and is supported in Node.js, Edge Runtime, and browser environments.

**Import:**
```
import { MistralStream } from "ai"
```

**Parameters:**
- `response` (Response): The response object returned by a call made by the Provider SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): An object containing callback functions:
  - `onStart()`: Called at the start of stream processing
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when the stream closes with the final completion message

**Returns:** A ReadableStream

### replicatestream
Deprecated ReplicateStream utility (removed in SDK 4.0) converts Replicate Prediction objects to Promise<ReadableStream> with optional callbacks and headers.

ReplicateStream is a deprecated utility function that has been removed in AI SDK 4.0 and is not compatible with AI SDK 3.1 functions. It was part of the legacy Replicate integration.

The function handles extracting streams from Replicate API output. It accepts a Prediction object (returned by the Replicate JavaScript SDK) and returns a ReadableStream wrapped in a Promise, since it makes a fetch call to Replicate's streaming API internally.

**Parameters:**
- `pre` (Prediction): Object returned by the Replicate JavaScript SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object with callback functions:
  - `onStart()`: Called at stream processing start
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when stream closes with final message
- `options` (optional): Object for passing additional headers via `{ headers?: Record<string, string> }`

**Returns:** Promise<ReadableStream>

**Import:** `import { ReplicateStream } from "ai"`

### inkeepstream
Deprecated utility (removed in SDK 4.0) that converts Inkeep API responses to ReadableStream with optional callbacks for stream lifecycle events.

InkeepStream is a utility function that transforms responses from Inkeep's API into a ReadableStream. It wraps AIStream under the hood with a parser specific to Inkeep's response data structure. The function is supported in Node.js, Edge Runtime, and browser environments.

**Status**: InkeepStream has been removed in AI SDK 4.0 and is part of the legacy Inkeep integration, incompatible with AI SDK 3.1 functions.

**Import**: `import { InkeepStream } from "ai"`

**Parameters**:
- `response` (Response): The response object returned by a call made by the Provider SDK
- `callbacks` (AIStreamCallbacksAndOptions, optional): Object containing callback functions:
  - `onStart()`: Called at the start of stream processing
  - `onToken(token: string)`: Called for each token in the stream
  - `onCompletion(completion: string)`: Called for every completion
  - `onFinal(completion: string)`: Called once when the stream closes with the final completion message

**Returns**: A ReadableStream

