## Resumable Streams

Enable stream resumption after page reloads using `resume: true` in `useChat`. Requires Redis, `resumable-stream` package, and persistence layer.

**Incompatible with abort functionality** - don't use if abort is needed.

### Client Setup
```tsx
const { messages, sendMessage } = useChat({
  id: chatData.id,
  messages: chatData.messages,
  resume: true,
  transport: new DefaultChatTransport({
    prepareSendMessagesRequest: ({ id, messages }) => ({
      body: { id, message: messages[messages.length - 1] },
    }),
  }),
});
```

### POST Handler (Create Stream)
```ts
export async function POST(req: Request) {
  const { message, id } = await req.json();
  const chat = await readChat(id);
  const messages = [...chat.messages, message];
  saveChat({ id, messages, activeStreamId: null });

  const result = streamText({
    model: 'openai/gpt-5-mini',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: ({ messages }) => saveChat({ id, messages, activeStreamId: null }),
    async consumeSseStream({ stream }) {
      const streamId = generateId();
      const streamContext = createResumableStreamContext({ waitUntil: after });
      await streamContext.createNewResumableStream(streamId, () => stream);
      saveChat({ id, activeStreamId: streamId });
    },
  });
}
```

### GET Handler (Resume Stream)
```ts
export async function GET(_, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chat = await readChat(id);
  if (chat.activeStreamId == null) return new Response(null, { status: 204 });

  const streamContext = createResumableStreamContext({ waitUntil: after });
  return new Response(
    await streamContext.resumeExistingStream(chat.activeStreamId),
    { headers: UI_MESSAGE_STREAM_HEADERS },
  );
}
```

Customize resume endpoint with `prepareReconnectToStreamRequest` in `DefaultChatTransport`.