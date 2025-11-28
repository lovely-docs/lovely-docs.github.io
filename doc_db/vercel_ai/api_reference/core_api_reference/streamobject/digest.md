## streamObject()

Streams a typed, structured object for a given prompt and schema using a language model. Forces the model to return structured data for information extraction, synthetic data generation, or classification tasks.

### Core Functionality

Supports multiple output modes:
- **object** (default): Stream a single typed object matching a schema
- **array**: Stream array elements individually as they're generated
- **enum**: Generate a specific enum value from a provided list
- **no-schema**: Generate JSON without schema validation

### Basic Usage

```ts
import { streamObject } from 'ai';
import { z } from 'zod';

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

### Array Streaming

For arrays, specify the schema of array items and use `elementStream` to get complete elements:

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

### No-Schema JSON Generation

```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

### Enum Generation

```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole in search of a new habitable planet for humanity."',
});
```

### Key Parameters

- **model**: Language model to use (e.g., `openai('gpt-4.1')`)
- **output**: Type of output - 'object' | 'array' | 'enum' | 'no-schema' (defaults to 'object')
- **mode**: Generation mode - 'auto' | 'json' | 'tool' (defaults to 'auto' for object, 'json' for no-schema)
- **schema**: Zod or JSON schema describing the output shape. For arrays, describes array elements. Not available with 'no-schema' or 'enum'
- **schemaName**: Optional name for additional LLM guidance
- **schemaDescription**: Optional description for additional LLM guidance
- **system**: System prompt specifying model behavior
- **prompt**: Input prompt (string or array of messages)
- **messages**: Array of conversation messages (SystemModelMessage, UserModelMessage, AssistantModelMessage, ToolModelMessage)
- **maxOutputTokens**: Maximum tokens to generate
- **temperature**: Temperature setting (0-1 range depends on provider)
- **topP**: Nucleus sampling
- **topK**: Sample from top K options
- **presencePenalty**: Likelihood to repeat information in prompt
- **frequencyPenalty**: Likelihood to repeat same words/phrases
- **seed**: Integer seed for deterministic results
- **maxRetries**: Maximum retries (default: 2)
- **abortSignal**: AbortSignal to cancel the call
- **headers**: Additional HTTP headers
- **experimental_repairText**: Function to repair malformed JSON output
- **experimental_download**: Custom download function for URLs in prompts
- **experimental_telemetry**: Telemetry configuration (isEnabled, recordInputs, recordOutputs, functionId, metadata)
- **providerOptions**: Provider-specific options
- **onError**: Callback when error occurs
- **onFinish**: Callback when LLM response finishes

### Message Types

**UserModelMessage**: Can contain TextPart, ImagePart, or FilePart
- TextPart: `{ type: 'text', text: string }`
- ImagePart: `{ type: 'image', image: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType?: string }`
- FilePart: `{ type: 'file', data: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType: string }`

**AssistantModelMessage**: Can contain TextPart, ReasoningPart, FilePart, or ToolCallPart
- ReasoningPart: `{ type: 'reasoning', text: string }`
- ToolCallPart: `{ type: 'tool-call', toolCallId: string, toolName: string, args: object }`

**ToolModelMessage**: Contains ToolResultPart
- ToolResultPart: `{ type: 'tool-result', toolCallId: string, toolName: string, result: unknown, isError?: boolean }`

### Return Values

- **usage**: Promise<LanguageModelUsage> - Token usage (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- **providerMetadata**: Promise<Record<string, JSONObject>> - Provider-specific metadata
- **object**: Promise<T> - Final generated object typed according to schema
- **partialObjectStream**: AsyncIterableStream<DeepPartial<T>> - Stream of partial objects (not validated)
- **elementStream**: AsyncIterableStream<ELEMENT> - Stream of array elements (array mode only)
- **textStream**: AsyncIterableStream<string> - Text stream of JSON representation
- **fullStream**: AsyncIterableStream<ObjectStreamPart<T>> - Stream of events (object, text-delta, error, finish parts)
  - ObjectPart: `{ type: 'object', object: DeepPartial<T> }`
  - TextDeltaPart: `{ type: 'text-delta', textDelta: string }`
  - ErrorPart: `{ type: 'error', error: unknown }`
  - FinishPart: `{ type: 'finish', finishReason: FinishReason, logprobs?: Logprobs, usage: Usage, response?: Response }`
- **request**: Promise<LanguageModelRequestMetadata> - Raw request body
- **response**: Promise<LanguageModelResponseMetadata> - Response metadata (id, model, timestamp, headers)
- **warnings**: CallWarning[] - Provider warnings
- **pipeTextStreamToResponse**: (response: ServerResponse, init?: ResponseInit) => void - Write to Node.js response
- **toTextStreamResponse**: (init?: ResponseInit) => Response - Create text stream Response