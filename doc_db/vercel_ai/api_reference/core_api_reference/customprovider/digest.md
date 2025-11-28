## customProvider()

Creates a custom provider that maps model IDs to any model instance, enabling custom model configurations, aliases, and wrapping of existing providers with additional functionality.

### Parameters

- `languageModels` (optional): Record mapping model IDs to LanguageModel instances
- `embeddingModels` (optional): Record mapping model IDs to EmbeddingModel<string> instances
- `imageModels` (optional): Record mapping model IDs to ImageModel instances
- `fallbackProvider` (optional): A Provider to use when a requested model is not found in the custom provider

### Returns

A Provider instance with three methods:
- `languageModel(id: string): LanguageModel` - Returns a language model by ID (format: providerId:modelId)
- `embeddingModel(id: string): EmbeddingModel<string>` - Returns an embedding model by ID (format: providerId:modelId)
- `imageModel(id: string): ImageModel` - Returns an image model by ID (format: providerId:modelId)

### Example

```ts
import { openai } from '@ai-sdk/openai';
import { customProvider } from 'ai';

export const myOpenAI = customProvider({
  languageModels: {
    'gpt-4': wrapLanguageModel({
      model: openai('gpt-4'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
    'gpt-4o-reasoning-high': wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: openai,
});
```

This example creates a custom provider that wraps OpenAI models with custom settings (like reasoningEffort) and provides model aliases.