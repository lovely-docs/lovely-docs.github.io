## Common Issues and Solutions

### Streaming Problems
- **Azure OpenAI slow streaming**: Change Azure content filter to "Asynchronous Filter" or use `smoothStream()` transformation to stream word-by-word
- **Streaming fails in deployed environments**: Add `Transfer-Encoding: chunked` and `Connection: keep-alive` headers to `toUIMessageStreamResponse()`
- **Streaming broken in proxied environments**: Set `Content-Encoding: none` header to disable compression
- **Streaming timeouts on Vercel**: Increase `maxDuration` (300s Hobby, 800s Pro/Enterprise) via route export or vercel.json
- **Raw protocol data in stream output (v3.0.20+)**: Use `streamText().toTextStreamResponse()` instead of `StreamingTextResponse`, or set `streamProtocol: 'text'` in `useChat`/`useCompletion`
- **Unclosed streamable UI streams**: Call `.done()` method to properly close and flush updates

### useChat/useCompletion Issues
- **"Failed to parse stream" error (v3.0.20+)**: Set `streamProtocol: 'text'` parameter for raw text streams
- **Tool calls logged but no model response**: Convert messages with `convertToModelMessages()` before `streamText()`
- **Duplicate assistant messages**: Pass `originalMessages` to `toUIMessageStreamResponse()` to reuse message IDs
- **Custom headers/body/credentials**: Use `DefaultChatTransport` for static values or pass options to `sendMessage()` for dynamic values; request-level options override hook-level
- **Stale body data**: Pass dynamic values to `sendMessage()`'s second argument instead of hook initialization
- **Status shows "streaming" before text arrives**: Check if last assistant message has content parts before showing loader
- **Type errors with onToolCall**: Check `toolCall.dynamic` to narrow `toolName` type from string to specific tool names
- **"Maximum update depth exceeded"**: Use `experimental_throttle` option (milliseconds) to throttle UI updates

### Server Actions and RSC
- **Cannot inline "use server" in Client Components**: Export from separate file, pass via props from Server Component, or use `createAI`/`useActions` hooks
- **Streamable UI component errors (.ts vs .tsx)**: Rename file to `.tsx` to enable JSX support
- **Non-serializable objects from streamText/streamObject**: Extract only serializable data; use `createStreamableValue` to wrap data for client passage
- **Client-side function calls not invoked (v3.0.20+)**: Add empty `experimental_onFunctionCall` callback to `OpenAIStream` options

### Tool Calling
- **"ToolInvocation must have a result" error**: Add `execute` function to tool definition for server-side execution, or use `useChat` with `addToolOutput` for client-side handling
- **Tool calling with structured outputs**: Use `generateText`/`streamText` with `output` option; adjust `stopWhen` step count to include structured output generation step
- **onFinish not executing on stream abort**: Add `consumeSseStream: consumeStream` to `toUIMessageStreamResponse()` config; use `isAborted` parameter in callback

### Error Handling
- **Generic "An error occurred" messages**: Use `getErrorMessage` callback with `toUIMessageStreamResponse` or `onError` with `createDataStreamResponse` to expose error details
- **streamText silent failures**: Use `onError` callback to log errors since they become part of stream rather than thrown exceptions

### Compatibility Issues
- **TypeScript performance degradation with Zod**: Upgrade Zod to 4.1.8+ or set `moduleResolution: "nodenext"` in tsconfig.json
- **AI_UnsupportedModelVersionError**: Update all `@ai-sdk/*` packages to 2.0.0+, `ai` to 5.0.0+, `zod` to 4.1.8+
- **OpenAI structured outputs reject schema**: Use `.nullable()` instead of `.nullish()` or `.optional()` in Zod schemas
- **Model type incompatibility errors**: Update provider packages and AI SDK to latest versions
- **"Cannot find namespace 'JSX'" in non-React projects**: Install `@types/react` as dependency
- **Jest "Cannot find module '@ai-sdk/rsc'"**: Add moduleNameMapper in jest.config.js mapping '@ai-sdk/rsc' to node_modules/@ai-sdk/rsc/dist
- **resume and abort features conflict**: Choose one approach; both cannot be used together in `useChat`

### Examples
```tsx
// Azure streaming fix
import { smoothStream, streamText } from 'ai';
const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});

// Deployed streaming fix
return result.toUIMessageStreamResponse({
  headers: {
    'Transfer-Encoding': 'chunked',
    Connection: 'keep-alive',
  },
});

// Proxied streaming fix
return result.toUIMessageStreamResponse({
  headers: { 'Content-Encoding': 'none' },
});

// Vercel timeout fix (Next.js)
export const maxDuration = 600;

// useChat with custom headers
const { messages, sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});
sendMessage({ text: input }, {
  headers: { Authorization: `Bearer ${token}` },
  body: { temperature: 0.7 },
});

// Tool with execute function
const tools = {
  weather: tool({
    description: 'Get weather',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ temperature: 72 }),
  }),
};

// Error handling
const result = streamText({
  model,
  prompt,
  onError({ error }) {
    console.error(error);
  },
});

// Zod schema fix for OpenAI
schema: z.object({
  name: z.string().nullable(), // ✅ instead of .nullish()
  email: z.string().nullable(), // ✅ instead of .optional()
})
```