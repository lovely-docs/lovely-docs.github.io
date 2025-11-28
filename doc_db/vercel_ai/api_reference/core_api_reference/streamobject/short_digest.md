## streamObject()

Streams typed, structured objects from language models using schemas. Supports object, array, enum, and no-schema modes.

### Examples

**Object streaming with schema:**
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

**Array streaming:**
```ts
const { elementStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z.string().describe('Character class'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions.',
});

for await (const hero of elementStream) {
  console.log(hero);
}
```

**Enum generation:**
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: ...',
});
```

**No-schema JSON:**
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Key Parameters

- **model**: Language model to use
- **output**: 'object' | 'array' | 'enum' | 'no-schema' (default: 'object')
- **mode**: 'auto' | 'json' | 'tool' (default: 'auto')
- **schema**: Zod or JSON schema (not for 'no-schema' or 'enum')
- **schemaName/schemaDescription**: Optional guidance
- **prompt/messages**: Input prompt or conversation
- **temperature/topP/topK**: Sampling parameters
- **maxOutputTokens**: Token limit
- **seed**: For deterministic results
- **onError/onFinish**: Callbacks
- **experimental_telemetry**: Telemetry config

### Return Values

- **partialObjectStream**: Stream of partial objects
- **elementStream**: Stream of array elements (array mode)
- **textStream**: Stream of JSON text
- **fullStream**: Stream of all events (object, text-delta, error, finish)
- **object**: Promise resolving to final typed object
- **usage**: Promise with token counts
- **response**: Promise with response metadata