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