## Stream Resumption

`useChat` with `resume: true` automatically reconnects to active streams after page reloads for long-running generations. Incompatible with abort functionality.

**Prerequisites**: `resumable-stream` package, Redis instance, persistence layer for stream IDs.

**Client setup**:
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

**POST handler** creates resumable stream:
```ts
const result = streamText({ model: 'openai/gpt-5-mini', messages });
return result.toUIMessageStreamResponse({
  onFinish: ({ messages }) => saveChat({ id, messages, activeStreamId: null }),
  async consumeSseStream({ stream }) {
    const streamId = generateId();
    const streamContext = createResumableStreamContext({ waitUntil: after });
    await streamContext.createNewResumableStream(streamId, () => stream);
    saveChat({ id, activeStreamId: streamId });
  },
});
```

**GET handler** resumes stream:
```ts
const chat = await readChat(id);
if (chat.activeStreamId == null) return new Response(null, { status: 204 });
const streamContext = createResumableStreamContext({ waitUntil: after });
return new Response(
  await streamContext.resumeExistingStream(chat.activeStreamId),
  { headers: UI_MESSAGE_STREAM_HEADERS },
);
```

Customize resume endpoint via `prepareReconnectToStreamRequest` in `DefaultChatTransport`.