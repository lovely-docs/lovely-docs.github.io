Middleware intercepts language model calls to add features like guardrails, RAG, caching, logging. Use `wrapLanguageModel({ model, middleware })` with single or multiple middlewares.

**Built-in:** `extractReasoningMiddleware`, `simulateStreamingMiddleware`, `defaultSettingsMiddleware`.

**Community:** `@ai-sdk-tool/parser` for function calling on non-native models.

**Custom Implementation:** Implement `LanguageModelV3Middleware` with `transformParams`, `wrapGenerate`, or `wrapStream`.

**Examples:**
- Logging: `wrapGenerate` logs params and text
- Caching: `wrapGenerate` caches by stringified params
- RAG: `transformParams` augments user message with sources
- Guardrails: `wrapGenerate` filters text for sensitive content
- Metadata: Pass via `providerOptions`, access in middleware via `params?.providerMetadata`