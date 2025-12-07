**Custom Providers** with `customProvider()`: pre-configure settings, aliases, and limit models.

**Provider Registry** with `createProviderRegistry()`: manage multiple providers with string IDs (format: `providerId:modelId`, customizable separator).

**Access models:** `registry.languageModel()`, `registry.embeddingModel()`, `registry.imageModel()`.

**Global Provider:** Set `globalThis.AI_SDK_DEFAULT_PROVIDER` to customize default provider (defaults to gateway).