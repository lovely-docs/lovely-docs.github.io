## Purpose
Centralized registry for managing multiple AI providers and models with string-based access (`providerId:modelId`).

## Setup
```ts
const registry = createProviderRegistry({
  anthropic,
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
});
```

## Custom Separator
```ts
const registry = createProviderRegistry(
  { anthropic, openai },
  { separator: ' > ' },
);
```

## Access Models
```ts
// Language models
const { text } = await generateText({
  model: registry.languageModel('openai:gpt-4.1'),
  prompt: 'Invent a new holiday...',
});

// Embedding models
const { embedding } = await embed({
  model: registry.embeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});

// Image models
const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset...',
});
```

## API
- `createProviderRegistry(providers, options?)` returns Provider with `languageModel()`, `embeddingModel()`, `imageModel()` methods
- Options: `separator` (string, default ":")