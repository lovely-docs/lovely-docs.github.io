## Prompt Engineering
Temperature (0-1) controls prediction confidence. Add descriptive terms and examples to shape responses.

## Stream Management
- **Cancellation**: `abortSignal` + `onAbort` (server), `stop()` hook (client)
- **Back-pressure**: Use `ReadableStream.pull()` instead of eager `for await (...)` to prevent unbounded buffer growth

## Caching
Use `LanguageModelV3Middleware` with `wrapGenerate`/`wrapStream` or `onFinish` callbacks with KV storage.

## UI Rendering
- **Multiple Streamables**: Return independent streamable UIs from single server action
- **Server-Side Rendering**: `createStreamableUI()` renders React components server-side
- **Language Models as Routers**: Function calling determines UIs and multi-step sequences

## Multistep Interfaces
Compose tools and maintain application context so user input in one step affects model output in subsequent steps.

## Sequential Generations
Chain `generateText()` calls where outputs feed into subsequent prompts.

## Rate Limiting
```ts
const ratelimit = new Ratelimit({ redis: kv, limiter: Ratelimit.fixedWindow(5, '30s') });
const { success } = await ratelimit.limit(ip);
if (!success) return new Response('Ratelimited!', { status: 429 });
```

## Deployment
Set `maxDuration` for LLM timeouts (default 10s, max 60s on Hobby Tier).