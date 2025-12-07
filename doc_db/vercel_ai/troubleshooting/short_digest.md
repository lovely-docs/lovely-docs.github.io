**Streaming**: Azure slow streaming → use `smoothStream()` or change content filter; deployed/proxied failures → add headers (`Transfer-Encoding: chunked`, `Connection: keep-alive`, `Content-Encoding: none`); Vercel timeouts → increase `maxDuration`; v3.0.20+ protocol data → use `toTextStreamResponse()` or `streamProtocol: 'text'`

**useChat**: Tool calls missing response → use `convertToModelMessages()`; duplicate messages → pass `originalMessages`; custom headers/body → use `DefaultChatTransport` or `sendMessage()` options; stale data → pass dynamic values to `sendMessage()`; type errors with tools → check `toolCall.dynamic`; update throttling → use `experimental_throttle`

**Server Actions**: Can't inline "use server" → export from separate file or use `createAI`/`useActions`; Streamable UI errors → use `.tsx` extension; non-serializable objects → extract serializable data only

**Tools**: Missing result → add `execute` function or use `useChat` with `addToolOutput`; structured outputs → use `streamText` with `output` option and adjust `stopWhen` step count; onFinish not called on abort → add `consumeSseStream: consumeStream`

**Errors**: Generic messages → use `getErrorMessage` callback; silent failures → use `onError` callback

**Compatibility**: Zod performance → upgrade to 4.1.8+ or set `moduleResolution: "nodenext"`; AI SDK 5 → update `@ai-sdk/*` to 2.0.0+; OpenAI schemas → use `.nullable()` not `.nullish()`; Jest RSC → add moduleNameMapper; resume/abort conflict → choose one