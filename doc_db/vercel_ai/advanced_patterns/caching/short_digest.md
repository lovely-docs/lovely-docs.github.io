Two caching approaches:

1. **Language Model Middleware** (recommended): Intercept calls with `wrapGenerate` and `wrapStream` methods. For streams, use `simulateReadableStream()` to replay cached chunks.

2. **Lifecycle Callbacks**: Use `onFinish` callback to cache response after generation.

Both examples use Upstash Redis but work with any KV provider. Middleware approach shown with full implementation; callback approach shown with 1-hour expiration example.