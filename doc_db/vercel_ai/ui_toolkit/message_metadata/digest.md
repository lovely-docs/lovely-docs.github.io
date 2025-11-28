Message metadata allows attaching custom information at the message level (distinct from data parts which are content-level). It's useful for tracking timestamps, model information, token usage, user context, and performance metrics.

**Setup:**
Define a metadata schema using Zod for type safety:
```tsx
import { UIMessage } from 'ai';
import { z } from 'zod';

export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type MyUIMessage = UIMessage<MessageMetadata>;
```

**Server-side (sending metadata):**
Use the `messageMetadata` callback in `toUIMessageStreamResponse` to attach metadata at different streaming stages:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
});

return result.toUIMessageStreamResponse({
  originalMessages: messages,
  messageMetadata: ({ part }) => {
    if (part.type === 'start') {
      return {
        createdAt: Date.now(),
        model: 'gpt-5.1',
      };
    }
    if (part.type === 'finish') {
      return {
        totalTokens: part.totalUsage.totalTokens,
      };
    }
  },
});
```

**Client-side (accessing metadata):**
Access metadata through `message.metadata` property:
```tsx
const { messages } = useChat<MyUIMessage>({
  transport: new DefaultChatTransport({
    api: '/api/chat',
  }),
});

{messages.map(message => (
  <div key={message.id}>
    {message.metadata?.createdAt && (
      <span>{new Date(message.metadata.createdAt).toLocaleTimeString()}</span>
    )}
    {message.parts.map((part, index) =>
      part.type === 'text' ? <div key={index}>{part.text}</div> : null,
    )}
    {message.metadata?.totalTokens && (
      <div>{message.metadata.totalTokens} tokens</div>
    )}
  </div>
))}
```

**Key differences from data parts:**
Message metadata is attached at message level and is static/complete, while data parts are content-level and can change during generation. Use metadata for information about the message itself, data parts for dynamic content forming part of the message.

**Common use cases:**
- Timestamps (creation/completion)
- Model information
- Token usage and cost tracking
- User context (IDs, session info)
- Performance metrics (generation time, time to first token)
- Quality indicators (finish reason, confidence scores)