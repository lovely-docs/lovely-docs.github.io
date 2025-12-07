## Provider Registry
Centralized registry for multiple AI providers and models, accessed via `providerId:modelId` format.

**Setup:**
```ts
const registry = createProviderRegistry({
  anthropic,
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
});
```

**Custom separator:**
```ts
const registry = createProviderRegistry(
  { anthropic, openai },
  { separator: ' > ' },
);
```

**Access models:**
```ts
registry.languageModel('openai:gpt-4.1')
registry.embeddingModel('openai:text-embedding-3-small')
registry.imageModel('openai:dall-e-3')
```

**API:** Takes `providers` object and optional `options` with `separator` field. Returns provider with `languageModel()`, `embeddingModel()`, `imageModel()` methods.