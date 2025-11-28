Wraps a language model with middleware to enhance behavior.

```ts
const wrapped = wrapLanguageModel({
  model: 'openai/gpt-4.1',
  middleware: yourMiddleware,
});
```

Parameters: model (LanguageModelV3), middleware (single or array), optional modelId and providerId overrides. Returns wrapped LanguageModelV3.