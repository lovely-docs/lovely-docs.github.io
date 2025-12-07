Common settings for all AI SDK functions: `maxOutputTokens`, `temperature`/`topP`/`topK` for output control, `presencePenalty`/`frequencyPenalty` for penalties, `stopSequences`, `seed`, `maxRetries`, `abortSignal` for cancellation/timeout, and `headers` for HTTP requests. Example:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  maxOutputTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  abortSignal: AbortSignal.timeout(5000),
  headers: { 'Prompt-Id': 'id' },
  prompt: 'Invent a new holiday and describe its traditions.',
});
```