## Key Differences

AI SDK RSC is experimental with production limitations. Migrate to AI SDK UI by:

1. **Separate concerns:** Move generation to route handlers with `streamText`, rendering to client with `useChat`
2. **Tool calls:** AI SDK UI supports parallel and multi-step tool calls automatically
3. **Generative UI:** Stream props data instead of components; render on client based on `toolInvocations` state
4. **Client interactions:** Use `useChat` with same `id` instead of `useActions`
5. **Loading states:** Use tool invocation `state` property instead of `initial` parameter
6. **Saving chats:** Use `onFinish` callback in `streamText` instead of `onSetAIState`
7. **Restoring chats:** Pass `initialMessages` to `useChat` instead of `onGetUIState`
8. **Object streaming:** Use `useObject` hook instead of `createStreamableValue`

**Example - Before (RSC):**
```tsx
const { value: stream } = await streamUI({
  model: openai('gpt-4o'),
  messages: messages.get(),
  tools: { displayWeather: { generate: async function* () { /* ... */ } } },
});
```

**Example - After (UI):**
```ts
// Route handler
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  tools: { displayWeather: { execute: async () => ({ /* props */ }) } },
});

// Client
const { messages } = useChat();
message.toolInvocations.map(inv => inv.state === 'result' ? <Weather {...inv.result} /> : <Loading />)
```