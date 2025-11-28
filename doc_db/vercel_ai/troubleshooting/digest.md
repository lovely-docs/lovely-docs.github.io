## Common Issues and Solutions

**Streaming Problems**
- Azure OpenAI slow streaming: Update content filter to "Asynchronous Filter" in Azure AI Studio or use `smoothStream()` transformation
- Streaming not working when deployed: Add `Transfer-Encoding: chunked` and `Connection: keep-alive` headers to `toUIMessageStreamResponse()`
- Streaming not working when proxied: Disable compression with `'Content-Encoding': 'none'` header
- Streaming timeouts on Vercel: Increase `maxDuration` (default 300s, Pro/Enterprise up to 800s)
- Unclosed streams: Call `.done()` on streamable UI to close streams

**useChat/useCompletion Issues**
- Failed to parse stream: Set `streamProtocol: 'text'` when using incompatible stream sources
- No response: Convert messages with `convertToModelMessages()` before `streamText()`
- Custom headers/body/credentials not working: Use `DefaultChatTransport` for static values or pass options to `sendMessage()` for dynamic values
- Stale body values: Pass dynamic values via `sendMessage()`'s second argument, not hook-level config
- Status shows but no text appears: Check `lastMessage?.parts?.length === 0` to distinguish metadata streaming from content
- Maximum update depth exceeded: Use `experimental_throttle` option to batch stream chunks

**Tool Calling**
- Tool invocation missing result: Add `execute` functions to tools or provide results via `addToolOutput` in `onToolCall` handler
- Type errors with onToolCall: Check `toolCall.dynamic` before using `toolCall.toolName` with `addToolOutput`
- Tool calling with structured outputs: Use `generateText`/`streamText` with `output` option; adjust `stopWhen` to account for extra generation step

**Server Actions & RSC**
- Server Actions in Client Components: Export from separate file with `"use server"` at top level, pass via props, or use `createAI` and `useActions` hooks
- Streamable UI errors: Use `.tsx` extension instead of `.ts` for JSX support
- Plain objects error: Use `createStreamableValue` to wrap serializable data instead of returning entire streamText result

**Stream Protocol & Response Format**
- Stream output contains protocol markers: Use `streamText().toTextStreamResponse()` or pin SDK to 3.0.19
- Client-side function calls not invoked: Add stub `experimental_onFunctionCall` to OpenAIStream options

**Error Handling**
- Generic "An error occurred": Pass `getErrorMessage` to `toUIMessageStreamResponse()` or `onError` to `createDataStreamResponse()`
- streamText fails silently: Use `onError` callback to capture and log errors

**Message Management**
- Repeated assistant messages: Pass `originalMessages` to `toUIMessageStreamResponse()` to reuse message IDs
- onFinish not called on abort: Add `consumeSseStream: consumeStream` to `toUIMessageStreamResponse()`

**Stream Resumption & Abort**
- Abort breaks resumable streams: Choose between `resume: true` or abort functionality, not both

**Schema & Type Issues**
- TypeScript performance crashes with Zod: Upgrade Zod to 4.1.8+ or set `moduleResolution: "nodenext"`
- OpenAI structured outputs reject `.nullish()` and `.optional()`: Use `.nullable()` instead
- Unsupported model version error: Update `@ai-sdk/*` to 2.0.0+ and `ai` to 5.0.0+
- Type incompatibility with LanguageModelV1: Update SDK and provider packages to latest versions
- Cannot find namespace 'JSX': Install `@types/react`

**Testing**
- Jest cannot find '@ai-sdk/rsc': Add `moduleNameMapper` entry mapping to dist directory