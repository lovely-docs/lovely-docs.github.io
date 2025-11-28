## generateObject()

Generates structured objects, arrays, enums, or unschema'd JSON from prompts using language models.

### Output Types
- **object** (default): Single object matching schema
- **array**: Array of items matching schema
- **enum**: One value from provided list
- **no-schema**: JSON without validation

### Examples

```ts
// Object
const { object } = await generateObject({
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

// Array
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z.string().describe('Character class'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions.',
});

// Enum
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre...',
});

// No-schema
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Key Parameters
- `model`: Language model to use
- `output`: 'object' | 'array' | 'enum' | 'no-schema' (default: 'object')
- `mode`: 'auto' | 'json' | 'tool' (default: 'auto' for object, 'json' for no-schema)
- `schema`: Zod or JSON schema (not for 'no-schema' or 'enum')
- `schemaName`, `schemaDescription`: Optional guidance for providers
- `enum`: List of values for 'enum' output
- `prompt` or `messages`: Input prompt or conversation
- `system`: System prompt
- `temperature`, `topP`, `topK`: Sampling controls
- `presencePenalty`, `frequencyPenalty`: Penalty settings
- `seed`: For deterministic results
- `maxOutputTokens`, `maxRetries`: Limits
- `abortSignal`, `headers`: Control options
- `experimental_repairText`, `experimental_download`, `experimental_telemetry`: Advanced features
- `providerOptions`: Provider-specific options

### Return Value
- `object`: Generated object (validated by schema if applicable)
- `finishReason`: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
- `usage`: Token counts (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `request`: Raw request HTTP body
- `response`: Response metadata (id, modelId, timestamp, headers, body)
- `reasoning`: Concatenated reasoning from all reasoning parts
- `warnings`: Provider warnings
- `providerMetadata`: Provider-specific metadata
- `toJsonResponse()`: Convert to JSON response