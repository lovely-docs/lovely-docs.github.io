## generateObject()

Generates typed, structured objects from language models using schemas.

**Output types:** object (default), array, enum, no-schema

**Basic example:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({ recipe: z.object({ name: z.string(), ingredients: z.array(z.string()), steps: z.array(z.string()) }) }),
  prompt: 'Generate a lasagna recipe.',
});
```

**Array output:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({ name: z.string(), class: z.string(), description: z.string() }),
  prompt: 'Generate 3 hero descriptions for a fantasy RPG.',
});
```

**Enum output:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre: "A group of astronauts travel through a wormhole..."',
});
```

**Key parameters:** model, prompt/messages, schema, output, mode, system, temperature, topP, maxOutputTokens, maxRetries, abortSignal, headers, experimental_telemetry, providerOptions

**Returns:** object, finishReason, usage (inputTokens, outputTokens, totalTokens), request, response, reasoning, warnings, toJsonResponse()