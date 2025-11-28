## Quick Fixes

**Streaming**: Azure slow → use `smoothStream()`; deployed → add `Transfer-Encoding: chunked` header; proxied → add `Content-Encoding: none`; Vercel timeout → increase `maxDuration`

**useChat**: Parse error → `streamProtocol: 'text'`; no response → `convertToModelMessages()`; stale body → pass to `sendMessage()` not hook; status but no text → check `lastMessage?.parts?.length === 0`

**Tools**: Missing result → add `execute` or use `addToolOutput`; type errors → check `toolCall.dynamic` first

**Server Actions**: Use separate file with `"use server"` or pass via props; `.tsx` for Streamable UI

**Errors**: Generic error → use `getErrorMessage`; silent failure → add `onError` callback

**Schema**: Zod perf → upgrade to 4.1.8+; OpenAI structured → use `.nullable()` not `.optional()`

**Versions**: Model error → update `@ai-sdk/*` to 2.0.0+, `ai` to 5.0.0+