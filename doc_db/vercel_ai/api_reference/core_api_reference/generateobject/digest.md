## generateObject()

Generates a typed, structured object for a given prompt and schema using a language model. Forces the model to return structured data for information extraction, synthetic data generation, or classification tasks.

### Output Types

- **object** (default): Generate a single object matching the schema
- **array**: Generate an array of items matching the schema
- **enum**: Generate one value from a provided list of strings
- **no-schema**: Generate JSON without schema validation

### Basic Usage

```ts
import { generateObject } from 'ai';
import { z } from 'zod';

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
```

### Array Generation

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z.string().describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});
```

### Enum Generation

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole..."',
});
```

### No-Schema JSON

```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Parameters

**Core:**
- `model` (LanguageModel): The language model to use
- `output` ('object' | 'array' | 'enum' | 'no-schema'): Type of output to generate, defaults to 'object'
- `mode` ('auto' | 'json' | 'tool'): Generation mode, defaults to 'auto' for object and 'json' for no-schema
- `schema` (Zod Schema | JSON Schema): Describes the shape of the object/array items. Not available with 'no-schema' or 'enum'
- `schemaName` (string): Optional name for the output, used by some providers for LLM guidance
- `schemaDescription` (string): Optional description for the output
- `enum` (string[]): List of possible values for 'enum' output only
- `prompt` (string | message array): The input prompt
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `messages` (message array): Conversation messages, auto-converts from useChat hook

**Message Types:**
- SystemModelMessage: `{ role: 'system', content: string }`
- UserModelMessage: `{ role: 'user', content: string | TextPart[] | ImagePart[] | FilePart[] }`
- AssistantModelMessage: `{ role: 'assistant', content: string | TextPart[] | ReasoningPart[] | FilePart[] | ToolCallPart[] }`
- ToolModelMessage: `{ role: 'tool', content: ToolResultPart[] }`

**Sampling & Penalties:**
- `temperature` (number): Controls randomness, recommended to set either this or topP, not both
- `topP` (number): Nucleus sampling
- `topK` (number): Sample from top K options, for advanced use cases
- `presencePenalty` (number): Affects likelihood of repeating information in prompt
- `frequencyPenalty` (number): Affects likelihood of repeating same words/phrases
- `seed` (number): For deterministic results if supported

**Limits & Control:**
- `maxOutputTokens` (number): Maximum tokens to generate
- `maxRetries` (number): Maximum retries, defaults to 2
- `abortSignal` (AbortSignal): Cancel the call
- `headers` (Record<string, string>): Additional HTTP headers for HTTP-based providers

**Advanced:**
- `experimental_repairText` (function): Attempts to repair raw model output to enable JSON parsing
- `experimental_download` (function): Custom download function for URLs in prompts
- `experimental_telemetry` (TelemetrySettings): Telemetry configuration with isEnabled, recordInputs, recordOutputs, functionId, metadata
- `providerOptions` (Record<string, JSONObject>): Provider-specific options

### Return Value

- `object`: The generated object, validated by schema if applicable
- `finishReason`: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
- `usage` (LanguageModelUsage):
  - `inputTokens`: Number of input tokens used
  - `outputTokens`: Number of output tokens used
  - `totalTokens`: Total tokens as reported by provider
  - `reasoningTokens`: Number of reasoning tokens (optional)
  - `cachedInputTokens`: Number of cached input tokens (optional)
- `request` (LanguageModelRequestMetadata): Raw request HTTP body as string
- `response` (LanguageModelResponseMetadata):
  - `id`: Response identifier
  - `modelId`: Model used
  - `timestamp`: Response timestamp
  - `headers`: Optional response headers
  - `body`: Optional response body
- `reasoning`: Reasoning used to generate the object (concatenated from all reasoning parts)
- `warnings`: Warnings from model provider
- `providerMetadata`: Optional metadata from provider
- `toJsonResponse(init?: ResponseInit)`: Converts to JSON response with status 200 and content-type application/json