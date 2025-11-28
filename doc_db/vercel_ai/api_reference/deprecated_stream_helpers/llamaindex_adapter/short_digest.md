Convert LlamaIndex ChatEngine and QueryEngine streams to AI SDK data streams using `toDataStream()`, `toDataStreamResponse()`, or `mergeIntoDataStream()` methods.

**Example:**
```tsx
import { toDataStreamResponse } from '@ai-sdk/llamaindex';
const stream = await chatEngine.chat({ message: prompt, stream: true });
return toDataStreamResponse(stream);
```