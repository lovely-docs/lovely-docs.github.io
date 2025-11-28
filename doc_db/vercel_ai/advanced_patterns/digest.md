## Prompt Engineering

LLMs predict text sequences by assigning probabilities. Prompt engineering shapes responses through clear instructions, examples, and temperature tuning (0=deterministic, 1=random). Different models have varying performance, context windows, and costs—optimize the cost-performance tradeoff by adding descriptive terms, providing examples of expected output, and adjusting temperature for desired diversity.

## Stream Management

**Cancellation**: Use `abortSignal` with `onAbort` callback for server-side cancellation, or `stop()` hook for client-side cancellation. The `onAbort` callback receives completed steps for persisting partial results.

**Back-pressure**: Implement lazy evaluation using `ReadableStream.pull()` instead of eager `for await (...)` loops. This ensures producers only generate data when consumers request it, preventing unbounded buffer growth and memory leaks.

## Caching

Cache AI responses via language model middleware using `LanguageModelV3Middleware` with `wrapGenerate` and `wrapStream` methods. For streams, use `simulateReadableStream()` to replay cached chunks. Alternatively, use `onFinish` callbacks with KV storage like Upstash Redis.

## UI Rendering & Routing

**Multiple Streamables**: Return multiple independent streamable UIs from a single server action. Nest streamables as props for composable UIs that update separately.

**Server-Side Rendering**: Use `createStreamableUI()` from `@ai-sdk/rsc` to render React components server-side and stream them to clients, eliminating complex client-side conditional rendering.

**Language Models as Routers**: Use function calling to deterministically choose UIs and execute multi-step sequences based on user intent. Models can generate correct parameters for dynamic routes and sequences of function calls for complex tasks.

## Multistep Interfaces

Design multistep interfaces through tool composition and application context. Compose multiple tools to create new tools that break complex tasks into manageable steps. Maintain rich conversation history so user input in one step affects model output in subsequent steps.

Example: Flight booking with `searchFlights`, `lookupFlight`, and `bookFlight` tools. Compose with `lookupContacts` to auto-populate passenger details, reducing user steps.

## Sequential Generations

Chain multiple `generateText()` calls where outputs feed into subsequent prompts. Each generation is awaited sequentially, allowing the full text output to be used in the next prompt for dependent multi-step workflows.

## Rate Limiting

Implement API rate limiting with Vercel KV and Upstash Ratelimit. Extract client IP from request, check limit before processing, and return HTTP 429 on failure:

```ts
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '30s'),
});

const { success } = await ratelimit.limit(ip);
if (!success) return new Response('Ratelimited!', { status: 429 });
```

## Deployment

Deploy Next.js AI apps to Vercel via git workflow. Set `maxDuration` for LLM timeouts (default 10s on Hobby Tier, max 60s). Add rate limiting and firewall security for production.