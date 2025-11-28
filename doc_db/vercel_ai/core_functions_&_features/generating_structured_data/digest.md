## Overview
Generate structured data from LLM outputs using `generateObject` and `streamObject` functions. These standardize structured generation across model providers with schema validation to ensure type safety and correctness.

## Core Functions

**generateObject**: Generates structured data from a prompt with schema validation.
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

**streamObject**: Streams generated structured data as it's produced, useful for interactive use cases. Errors are part of the stream and don't throw. Use `onError` callback for error logging:
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  schema: z.object({ /* ... */ }),
  prompt: 'Generate data.',
  onError({ error }) {
    console.error(error);
  },
});
for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

## Schema Support
Use Zod schemas, Valibot, or JSON schemas. Pass Zod objects directly or use `zodSchema` helper. Optionally specify `schemaName` and `schemaDescription` for provider guidance.

## Output Strategies

**object** (default): Returns generated data as an object.

**array**: Generate array of objects. Schema specifies element shape. With `streamObject`, stream elements via `elementStream`:
```ts
const { elementStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z.string().describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});
for await (const hero of elementStream) {
  console.log(hero);
}
```

**enum**: Generate specific enum value for classification. Only with `generateObject`:
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole..."',
});
```

**no-schema**: Generate without schema for dynamic user requests:
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

## Response Access
Access raw response headers and body via `response` property:
```ts
const result = await generateObject({ /* ... */ });
console.log(result.response.headers);
console.log(result.response.body);
```

## Reasoning Access
Access model reasoning via `reasoning` property (if available):
```ts
const result = await generateObject({
  model: 'openai/gpt-5',
  schema: z.object({ /* ... */ }),
  prompt: 'Generate a lasagna recipe.',
  providerOptions: {
    openai: {
      strictJsonSchema: true,
      reasoningSummary: 'detailed',
    },
  },
});
console.log(result.reasoning);
```

## Error Handling
`generateObject` throws `AI_NoObjectGeneratedError` when it cannot generate a valid object. Error properties include:
- `text`: Generated text (raw or tool call text)
- `response`: Metadata about language model response
- `usage`: Request token usage
- `cause`: Underlying error (e.g., JSON parsing error)

```ts
import { generateObject, NoObjectGeneratedError } from 'ai';
try {
  await generateObject({ model, schema, prompt });
} catch (error) {
  if (NoObjectGeneratedError.isInstance(error)) {
    console.log('Cause:', error.cause);
    console.log('Text:', error.text);
    console.log('Response:', error.response);
    console.log('Usage:', error.usage);
  }
}
```

## JSON Repair
Experimental `experimental_repairText` function attempts to repair invalid/malformed JSON:
```ts
const { object } = await generateObject({
  model,
  schema,
  prompt,
  experimental_repairText: async ({ text, error }) => {
    return text + '}'; // example: add closing brace
  },
});
```

## Structured Outputs with generateText and streamText
Use `output` setting with `generateText` and `streamText` for structured data generation.

**generateText with Output.object()**:
```ts
const { output } = await generateText({
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable().describe('Age of the person.'),
      contact: z.object({
        type: z.literal('email'),
        value: z.string(),
      }),
      occupation: z.object({
        type: z.literal('employed'),
        company: z.string(),
        position: z.string(),
      }),
    }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

**streamText with Output.object()**:
```ts
const { partialOutputStream } = await streamText({
  output: Output.object({
    schema: z.object({ /* ... */ }),
  }),
  prompt: 'Generate an example person for testing.',
});
```

## Output Types

**Output.text()**: Generate plain text without schema enforcement:
```ts
const { output } = await generateText({
  output: Output.text(),
  prompt: 'Tell me a joke.',
});
```

**Output.object()**: Generate structured object with schema validation. Partial outputs validated as much as possible:
```ts
const { output } = await generateText({
  output: Output.object({
    schema: z.object({
      name: z.string(),
      age: z.number().nullable(),
      labels: z.array(z.string()),
    }),
  }),
  prompt: 'Generate information for a test user.',
});
```

**Output.array()**: Generate array of typed objects. Model returns object with `elements` property; SDK extracts and validates:
```ts
const { output } = await generateText({
  output: Output.array({
    element: z.object({
      location: z.string(),
      temperature: z.number(),
      condition: z.string(),
    }),
  }),
  prompt: 'List the weather for San Francisco and Paris.',
});
// Returns: [
//   { location: 'San Francisco', temperature: 70, condition: 'Sunny' },
//   { location: 'Paris', temperature: 65, condition: 'Cloudy' },
// ]
```

**Output.choice()**: Model chooses from specific string options for classification:
```ts
const { output } = await generateText({
  output: Output.choice({
    options: ['sunny', 'rainy', 'snowy'],
  }),
  prompt: 'Is the weather sunny, rainy, or snowy today?',
});
// Returns one of: 'sunny', 'rainy', or 'snowy'
```

**Output.json()**: Generate and parse unstructured JSON without schema enforcement. Useful for arbitrary objects, flexible structures, or dynamic data:
```ts
const { output } = await generateText({
  output: Output.json(),
  prompt: 'For each city, return the current temperature and weather condition as a JSON object.',
});
// Could return any valid JSON structure
```