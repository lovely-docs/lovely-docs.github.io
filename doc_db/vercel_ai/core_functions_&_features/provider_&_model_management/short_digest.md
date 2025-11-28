## Custom Providers

Use `customProvider()` to pre-configure settings, create aliases, and limit models:

```ts
export const openai = customProvider({
  languageModels: {
    'gpt-5.1': wrapLanguageModel({
      model: gateway('openai/gpt-5.1'),
      middleware: defaultSettingsMiddleware({
        settings: { providerOptions: { openai: { reasoningEffort: 'high' } } }
      })
    })
  },
  fallbackProvider: gateway
});
```

## Provider Registry

Use `createProviderRegistry()` to manage multiple providers with `providerId:modelId` format:

```ts
export const registry = createProviderRegistry({
  gateway,
  anthropic,
  openai
}, { separator: ' > ' });

// Access models
const model = registry.languageModel('openai:gpt-5.1');
const embedding = registry.embeddingModel('openai:text-embedding-3-small');
const image = registry.imageModel('openai:dall-e-3');
```

## Global Provider

Set a default global provider to use plain model IDs:

```ts
globalThis.AI_SDK_DEFAULT_PROVIDER = openai;

// Then use without prefix
const result = await streamText({
  model: 'gpt-5.1',
  prompt: 'Your prompt'
});
```