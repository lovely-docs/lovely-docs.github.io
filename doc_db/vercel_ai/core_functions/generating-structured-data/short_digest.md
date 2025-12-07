## Generating Structured Data

Use `generateObject` and `streamObject` to generate validated structured data with Zod/Valibot/JSON schemas.

**generateObject**: Generates and validates structured data from a prompt:
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

**streamObject**: Streams response as it's generated with `partialObjectStream` and optional `onError` callback.

**Output strategies**: `object` (default), `array` (with `elementStream`), `enum` (classification), `no-schema` (dynamic).

**Error handling**: Throws `NoObjectGeneratedError` with `text`, `response`, `usage`, `cause` properties.

**Repair**: Use `experimental_repairText` to fix malformed JSON.

**With generateText/streamText**: Use `Output.text()`, `Output.object()`, `Output.array()`, `Output.choice()`, `Output.json()` for structured outputs.

**Schema options**: `schemaName`, `schemaDescription` for LLM guidance; access `result.reasoning` for model reasoning (OpenAI).

**Response access**: Use `result.response.headers` and `result.response.body` for provider-specific data.