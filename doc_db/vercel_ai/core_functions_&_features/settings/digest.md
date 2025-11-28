## Common Settings

All AI SDK functions support these settings alongside the model and prompt:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  maxOutputTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Note:** Some providers don't support all settings. Check the `warnings` property in the result object for unsupported settings.

## Output Control

- **`maxOutputTokens`**: Maximum number of tokens to generate.
- **`stopSequences`**: Array of sequences that stop text generation when encountered. Providers may limit the number of sequences.

## Sampling & Randomness

- **`temperature`**: Controls output randomness. `0` means deterministic, higher values mean more randomness. Range depends on provider/model. Recommended to set either `temperature` or `topP`, not both. Default in AI SDK 5.0+ is no longer `0`.
- **`topP`**: Nucleus sampling between 0 and 1. E.g., `0.1` considers only top 10% probability tokens. Recommended to set either `temperature` or `topP`, not both.
- **`topK`**: Sample only from top K options per token. Removes low-probability responses. For advanced use cases only.
- **`seed`**: Integer seed for deterministic results if supported by the model.

## Penalties

- **`presencePenalty`**: Reduces likelihood of repeating information already in the prompt. `0` means no penalty. Range depends on provider/model.
- **`frequencyPenalty`**: Reduces likelihood of repeating same words/phrases. `0` means no penalty. Range depends on provider/model.

## Request Control

- **`maxRetries`**: Maximum retry attempts. Default: `2`. Set to `0` to disable.
- **`abortSignal`**: Cancels the call. Can be used for timeouts:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    abortSignal: AbortSignal.timeout(5000), // 5 seconds
  });
  ```

## HTTP Headers

- **`headers`**: Additional HTTP headers for HTTP-based providers. Useful for observability headers like `Prompt-Id`:
  ```ts
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt: 'Invent a new holiday and describe its traditions.',
    headers: {
      'Prompt-Id': 'my-prompt-id',
    },
  });
  ```
  Note: Separate from provider-level headers which apply to all requests.