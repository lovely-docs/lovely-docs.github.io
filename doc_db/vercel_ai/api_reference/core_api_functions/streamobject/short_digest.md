## streamObject()

Streams typed structured objects matching a schema. Supports object, array, enum, and no-schema modes.

**Examples:**
```ts
// Object with schema
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({ recipe: z.object({ name: z.string(), ingredients: z.array(z.string()), steps: z.array(z.string()) }) }),
  prompt: 'Generate a lasagna recipe.',
});
for await (const obj of partialObjectStream) console.log(obj);

// Array elements
const { elementStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({ name: z.string(), class: z.string(), description: z.string() }),
  prompt: 'Generate 3 hero descriptions.',
});
for await (const hero of elementStream) console.log(hero);

// JSON without schema
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});

// Enum classification
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify genre: "A group of astronauts travel through a wormhole..."',
});
```

**Key Parameters:** model, output ('object'|'array'|'enum'|'no-schema'), mode ('auto'|'json'|'tool'), schema, prompt, temperature, topP, maxOutputTokens, onFinish callback

**Returns:** partialObjectStream, elementStream (array mode), textStream, fullStream (with object/text-delta/error/finish parts), usage, object, response metadata, helpers (pipeTextStreamToResponse, toTextStreamResponse)