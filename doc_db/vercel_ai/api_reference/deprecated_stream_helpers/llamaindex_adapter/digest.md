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