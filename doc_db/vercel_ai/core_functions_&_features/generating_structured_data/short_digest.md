## Core Functions
- **generateObject**: Generate structured data with schema validation
- **streamObject**: Stream structured data with `partialObjectStream` or `elementStream` (for arrays)

## Output Strategies
- **object** (default): Single object
- **array**: Array of objects with `elementStream` support
- **enum**: Classification from predefined values (generateObject only)
- **no-schema**: Dynamic generation without schema

## Schema Support
Zod, Valibot, or JSON schemas. Optional `schemaName` and `schemaDescription`.

## Response & Reasoning
Access via `response.headers`, `response.body`, and `reasoning` properties.

## Error Handling
`AI_NoObjectGeneratedError` with `text`, `response`, `usage`, `cause` properties. Experimental `experimental_repairText` for JSON repair.

## generateText/streamText Integration
Use `Output.text()`, `Output.object()`, `Output.array()`, `Output.choice()`, or `Output.json()` with `output` setting.

## Examples
```ts
// generateObject
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({ recipe: z.object({ name: z.string(), ingredients: z.array(z.object({ name: z.string(), amount: z.string() })), steps: z.array(z.string()) }) }),
  prompt: 'Generate a lasagna recipe.',
});

// streamObject with array
const { elementStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({ name: z.string(), class: z.string(), description: z.string() }),
  prompt: 'Generate 3 hero descriptions.',
});
for await (const hero of elementStream) console.log(hero);

// enum classification
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify genre: "A group of astronauts travel through a wormhole..."',
});

// Output.choice with generateText
const { output } = await generateText({
  output: Output.choice({ options: ['sunny', 'rainy', 'snowy'] }),
  prompt: 'Is the weather sunny, rainy, or snowy?',
});
```