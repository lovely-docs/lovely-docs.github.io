Language model middleware intercepts and modifies language model calls to add features like guardrails, RAG, caching, and logging in a model-agnostic way.

**Using Middleware:**
Wrap a model with `wrapLanguageModel({ model, middleware })`. Multiple middlewares are applied in order: `wrapLanguageModel({ model, middleware: [first, second] })` applies as `first(second(model))`.

**Built-in Middleware:**
- `extractReasoningMiddleware({ tagName: 'think' })`: Extracts reasoning from special tags and exposes as `reasoning` property. Supports `startWithReasoning` option to prepend tags.
- `simulateStreamingMiddleware()`: Simulates streaming for non-streaming models.
- `defaultSettingsMiddleware({ settings: { temperature, maxOutputTokens, providerOptions } })`: Applies default settings.

**Community Middleware:**
- Custom tool call parser (`@ai-sdk-tool/parser`): Enables function calling on models without native support via `createToolMiddleware`, `hermesToolMiddleware`, or `gemmaToolMiddleware`. Example: `wrapLanguageModel({ model: openrouter('google/gemma-3-27b-it'), middleware: gemmaToolMiddleware })`.

**Implementing Custom Middleware:**
Implement `LanguageModelV3Middleware` with any of:
1. `transformParams`: Modifies parameters before passing to model (for both `doGenerate` and `doStream`).
2. `wrapGenerate`: Wraps `doGenerate` method to modify params, call model, and modify result.
3. `wrapStream`: Wraps `doStream` method similarly.

**Examples:**

Logging - logs params and generated text:
```ts
export const yourLogMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    console.log('doGenerate called', JSON.stringify(params, null, 2));
    const result = await doGenerate();
    console.log('generated text:', result.text);
    return result;
  },
  wrapStream: async ({ doStream, params }) => {
    console.log('doStream called', JSON.stringify(params, null, 2));
    const { stream, ...rest } = await doStream();
    let generatedText = '';
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        if (chunk.type === 'text-delta') generatedText += chunk.delta;
        controller.enqueue(chunk);
      },
      flush() { console.log('generated text:', generatedText); }
    });
    return { stream: stream.pipeThrough(transformStream), ...rest };
  }
};
```

Caching - caches results by stringified params:
```ts
const cache = new Map();
export const yourCacheMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = JSON.stringify(params);
    if (cache.has(cacheKey)) return cache.get(cacheKey);
    const result = await doGenerate();
    cache.set(cacheKey, result);
    return result;
  }
};
```

RAG - augments last user message with retrieved sources:
```ts
export const yourRagMiddleware: LanguageModelV3Middleware = {
  transformParams: async ({ params }) => {
    const lastUserMessageText = getLastUserMessageText({ prompt: params.prompt });
    if (!lastUserMessageText) return params;
    const instruction = 'Use the following information:\n' + 
      findSources({ text: lastUserMessageText }).map(c => JSON.stringify(c)).join('\n');
    return addToLastUserMessage({ params, text: instruction });
  }
};
```

Guardrails - filters generated text:
```ts
export const yourGuardrailMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate }) => {
    const { text, ...rest } = await doGenerate();
    const cleanedText = text?.replace(/badword/g, '<REDACTED>');
    return { text: cleanedText, ...rest };
  }
};
```

**Custom Metadata Per Request:**
Pass metadata via `providerOptions` to access in middleware:
```ts
const { text } = await generateText({
  model: wrapLanguageModel({
    model: 'anthropic/claude-sonnet-4.5',
    middleware: yourLogMiddleware
  }),
  prompt: 'Invent a new holiday...',
  providerOptions: { yourLogMiddleware: { hello: 'world' } }
});
```
In middleware: `params?.providerMetadata?.yourLogMiddleware` contains the passed metadata.