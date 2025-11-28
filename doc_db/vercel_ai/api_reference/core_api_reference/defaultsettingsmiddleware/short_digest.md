Middleware that applies default settings to language model calls. Accepts a `settings` object with default `LanguageModelV3CallOptions` properties and provider metadata. Merges defaults with call-specific parameters, with explicit parameters taking precedence.

```ts
const modelWithDefaults = wrapLanguageModel({
  model: gateway('anthropic/claude-sonnet-4.5'),
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  }),
});
```