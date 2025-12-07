## API
- **toDataStream**: Converts LangChain streams to AIStream
- **toDataStreamResponse**: Converts LangChain streams to Response
- **mergeIntoDataStream**: Merges LangChain streams into existing DataStreamWriter

## Example
```tsx
import { toUIMessageStream } from '@ai-sdk/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { createUIMessageStreamResponse } from 'ai';

const model = new ChatOpenAI({ model: 'gpt-3.5-turbo-0125' });
const stream = await model.stream(prompt);
return createUIMessageStreamResponse({
  stream: toUIMessageStream(stream),
});
```