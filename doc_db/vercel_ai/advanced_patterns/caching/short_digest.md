## Caching Responses

**Language Model Middleware (Recommended):**
- Implement `LanguageModelV3Middleware` with `wrapGenerate` and `wrapStream` methods
- For `wrapGenerate`: cache result directly from `doGenerate()`
- For `wrapStream`: cache array of `LanguageModelV3StreamPart[]`, replay with `simulateReadableStream()` using `initialDelayInMs` and `chunkDelayInMs`
- Use `TransformStream` to collect chunks and cache after streaming completes

**Lifecycle Callbacks:**
- Use `onFinish` callback to cache response after generation
- Check cache before calling model, return cached response if available
- Set TTL with `redis.expire(key, seconds)`

Both approaches use KV storage (Upstash Redis example shown, any provider works).