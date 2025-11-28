# useChat Hook

Real-time conversational UI with message streaming, state management, and customization.

## Basic Usage
```tsx
const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});
```

## Status Values
- `submitted`: Awaiting response start
- `streaming`: Response actively streaming
- `ready`: Ready for new message
- `error`: Error occurred

## Key Functions
- `sendMessage(message, options)`: Send message with optional headers/body/metadata
- `stop()`: Abort streaming
- `regenerate()`: Regenerate last message
- `setMessages(messages)`: Modify message list
- `reload()`: Retry after error

## Event Callbacks
- `onFinish({ message, messages, isAbort, isDisconnect, isError })`
- `onError(error)`
- `onData(data)`

## Request Configuration
Hook-level (all requests):
```tsx
transport: new DefaultChatTransport({
  api: '/api/chat',
  headers: { Authorization: 'token' },
  body: { user_id: '123' },
})
```

Request-level (per-message, recommended):
```tsx
sendMessage({ text: input }, {
  headers: { Authorization: 'Bearer token' },
  body: { temperature: 0.7 },
  metadata: { userId: 'user123' },
})
```

## Message Metadata
Server-side:
```ts
return result.toUIMessageStreamResponse({
  messageMetadata: ({ part }) => {
    if (part.type === 'finish') return { totalTokens: part.totalUsage.totalTokens };
  },
});
```

Client-side: `message.metadata?.totalTokens`

## Transport Customization
```tsx
transport: new DefaultChatTransport({
  prepareSendMessagesRequest: ({ id, messages, trigger, messageId }) => ({
    body: { id, message: messages[messages.length - 1] },
  }),
})
```

## Advanced Features
- **Throttling**: `experimental_throttle: 50` (React only)
- **Text Streams**: `TextStreamChatTransport` for plain text
- **Reasoning Tokens**: `sendReasoning: true` (DeepSeek, Claude)
- **Sources**: `sendSources: true` (Perplexity, Google)
- **Image Generation**: Access via `part.type === 'file'`
- **Attachments**: Send via `FileList` or `FileUIPart[]`
- **Type Inference**: `InferUITool`, `InferUITools` for tool typing
