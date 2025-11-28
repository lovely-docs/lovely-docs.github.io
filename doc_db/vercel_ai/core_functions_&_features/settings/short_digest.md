## Common Settings

All AI SDK functions support: `maxOutputTokens`, `temperature`, `topP`, `topK`, `presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`, `maxRetries`, `abortSignal`, `headers`.

**Sampling:** `temperature` (0=deterministic, higher=random) or `topP` (nucleus sampling 0-1), not both. `topK` for advanced use.

**Penalties:** `presencePenalty` (repeat info), `frequencyPenalty` (repeat words). `0` = no penalty.

**Control:** `maxRetries` (default 2), `abortSignal` for cancellation/timeout, `stopSequences` to stop generation.

**Headers:** Request-specific HTTP headers for observability or provider-specific metadata.

Example with timeout:
```ts
await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
  abortSignal: AbortSignal.timeout(5000),
});
```