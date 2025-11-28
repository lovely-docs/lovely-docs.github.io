Message metadata attaches custom information at the message level (timestamps, model info, token usage, user context, performance metrics).

**Define schema:**
```tsx
export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
});
export type MyUIMessage = UIMessage<z.infer<typeof messageMetadataSchema>>;
```

**Send from server:**
```ts
return result.toUIMessageStreamResponse({
  originalMessages: messages,
  messageMetadata: ({ part }) => {
    if (part.type === 'start') return { createdAt: Date.now(), model: 'gpt-5.1' };
    if (part.type === 'finish') return { totalTokens: part.totalUsage.totalTokens };
  },
});
```

**Access on client:**
```tsx
const { messages } = useChat<MyUIMessage>({ transport: new DefaultChatTransport({ api: '/api/chat' }) });
{messages.map(msg => <div>{msg.metadata?.createdAt} {msg.metadata?.totalTokens} tokens</div>)}
```

Differs from data parts: metadata is message-level and static, data parts are content-level and dynamic.