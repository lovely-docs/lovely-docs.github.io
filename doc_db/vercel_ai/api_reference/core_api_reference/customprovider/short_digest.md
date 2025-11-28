## customProvider()

Maps model IDs to custom model instances with optional fallback provider. Returns a Provider with `languageModel()`, `embeddingModel()`, and `imageModel()` methods.

**Example:**
```ts
const myOpenAI = customProvider({
  languageModels: {
    'gpt-4': wrapLanguageModel({
      model: openai('gpt-4'),
      middleware: defaultSettingsMiddleware({
        settings: { providerOptions: { openai: { reasoningEffort: 'high' } } }
      }),
    }),
  },
  fallbackProvider: openai,
});
```