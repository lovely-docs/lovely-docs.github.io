Collection of utilities for converting and streaming responses from various AI frameworks and APIs into AI SDK-compatible data streams.

**StreamingTextResponse** (DEPRECATED in SDK 4.0, use `streamText.toDataStreamResponse()` instead)
- Wraps native Response class to return ReadableStream of text
- Auto-sets status 200 and Content-Type: 'text/plain; charset=utf-8'
- Accepts optional ResponseInit for customization and StreamData for additional response data

**AWSBedrockLlama2Stream** (DEPRECATED in SDK 4.0)
- Transforms AWS Bedrock API responses into ReadableStream using AIStream
- Supports callbacks: onStart(), onToken(token), onCompletion(completion), onFinal(completion)

**LangChain Adapter** (@ai-sdk/langchain)
- `toDataStream`: Converts LangChain StringOutputParser or AIMessageChunk streams to AIStream
- `toDataStreamResponse`: Converts to Response object with optional ResponseInit, StreamData, callbacks
- `mergeIntoDataStream`: Merges LangChain streams into existing DataStreamWriter
- Supports LangChain Expression Language, StringOutputParser, and StreamEvents v2

Example:
```tsx
import { toDataStream } from '@ai-sdk/langchain';
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({ model: 'gpt-3.5-turbo-0125' });
const stream = await model.stream(prompt);
const aiStream = toDataStream(stream);
```

**LlamaIndex Adapter** (@ai-sdk/llamaindex)
- `toDataStream`: Converts LlamaIndex ChatEngine/QueryEngine streams to data stream
- `toDataStreamResponse`: Converts to Response with optional init, data, callbacks
- `mergeIntoDataStream`: Merges into existing DataStreamWriter

Example:
```tsx
import { SimpleChatEngine } from 'llamaindex';
import { toDataStreamResponse } from '@ai-sdk/llamaindex';

const chatEngine = new SimpleChatEngine({ llm });
const stream = await chatEngine.chat({ message: prompt, stream: true });
return toDataStreamResponse(stream);
```