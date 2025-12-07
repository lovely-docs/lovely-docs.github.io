

## Pages

### generatetext
API for generating text with language models, supporting tool calling, structured outputs, multi-step generation with callbacks, and fine-grained control over generation parameters.

## generateText()

Generates text and calls tools for a given prompt using a language model. Ideal for non-interactive use cases like automation tasks (drafting emails, summarizing web pages) and agents that use tools.

### Basic Usage

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

console.log(text);
```

### Parameters

**Core:**
- `model` (LanguageModel): The language model to use, e.g., `openai('gpt-4o')`
- `prompt` (string | Array<ModelMessage>): Input prompt or conversation messages
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `messages` (Array<ModelMessage>): Conversation messages (SystemModelMessage, UserModelMessage, AssistantModelMessage, ToolModelMessage)

**Message Content Types:**
- UserModelMessage: `role: 'user'`, content can be string or array of TextPart, ImagePart, FilePart
- AssistantModelMessage: `role: 'assistant'`, content can be string or array of TextPart, ReasoningPart, FilePart, ToolCallPart
- ToolModelMessage: `role: 'tool'`, content is array of ToolResultPart with toolCallId, toolName, output, isError

**Tools:**
- `tools` (ToolSet): Tools accessible to the model. Each tool has:
  - `description` (optional): Purpose and usage details
  - `inputSchema` (Zod Schema | JSON Schema): Expected input structure
  - `execute` (optional): Async function `(parameters, options) => RESULT` that runs the tool
- `toolChoice` (optional): "auto" | "none" | "required" | { type: "tool", toolName: string }. Default: "auto"
- `activeTools` (optional): Array limiting which tools are available

**Generation Control:**
- `maxOutputTokens` (optional): Maximum tokens to generate
- `temperature` (optional): Randomness (0-1 range, provider-dependent)
- `topP` (optional): Nucleus sampling (0-1 range, provider-dependent)
- `topK` (optional): Sample from top K options
- `presencePenalty` (optional): Penalizes repeating information in prompt
- `frequencyPenalty` (optional): Penalizes repeating same words/phrases
- `stopSequences` (optional): Sequences that stop generation
- `seed` (optional): Integer for deterministic results (if supported)

**Advanced:**
- `maxRetries` (optional): Max retry attempts. Default: 2
- `abortSignal` (optional): AbortSignal to cancel the call
- `headers` (optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (optional): Provider-specific options
- `output` (optional): Structured output specification:
  - `Output.text()`: Text generation (default)
  - `Output.object({ schema })`: Typed object generation
  - `Output.array({ element })`: Array generation
  - `Output.choice({ options })`: Choice from options
  - `Output.json()`: Unstructured JSON
- `stopWhen` (optional): Condition for stopping generation with tool results. Default: stepCountIs(1)
- `prepareStep` (optional): Function to modify settings per step (model, toolChoice, activeTools, system, messages)
- `experimental_telemetry` (optional): Telemetry configuration (isEnabled, recordInputs, recordOutputs, functionId, metadata)
- `experimental_context` (optional): Context passed to tool execution
- `experimental_download` (optional): Custom download function for URLs in prompts
- `experimental_repairToolCall` (optional): Function to repair failed tool call parsing

**Callbacks:**
- `onStepFinish` (optional): Called when a step finishes. Receives: finishReason, usage, totalUsage, text, toolCalls, toolResults, warnings, response, isContinued, providerMetadata
- `onFinish` (optional): Called when LLM response and all tool executions complete. Receives: finishReason, usage, providerMetadata, text, reasoning, reasoningDetails, sources, files, toolCalls, toolResults, warnings, response, steps

### Return Value

- `content` (Array<ContentPart>): Generated content in last step
- `text` (string): Generated text
- `reasoning` (Array<ReasoningOutput>): Full reasoning from last step (if available)
- `reasoningText` (string | undefined): Reasoning text from last step
- `sources` (Array<Source>): URL sources used (from RAG models)
- `files` (Array<GeneratedFile>): Generated files with base64, uint8Array, mediaType
- `toolCalls` (ToolCallArray): Tool calls made in last step
- `toolResults` (ToolResultArray): Results of tool calls from last step
- `finishReason` ('stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown')
- `usage` (LanguageModelUsage): Token usage of last step (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `totalUsage` (LanguageModelUsage): Cumulative token usage across all steps
- `request` (optional): Raw request HTTP body
- `response` (optional): Response metadata (id, modelId, timestamp, headers, body, messages)
- `warnings` (optional): Provider warnings
- `providerMetadata` (optional): Provider-specific metadata
- `steps` (Array<StepResult>): Response info for each step

### Examples

**Text generation:**
```ts
const { text } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Chat completion:**
```ts
const { text } = await generateText({
  model: openai('gpt-4o'),
  messages: [
    { role: 'user', content: 'What is the capital of France?' }
  ],
});
```

**Tool calling:**
```ts
const { toolCalls, toolResults } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Get the weather',
  tools: {
    getWeather: {
      description: 'Get weather for a location',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 72, location })
    }
  }
});
```

**Structured output:**
```ts
const { output } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Generate a person',
  output: Output.object({
    schema: z.object({ name: z.string(), age: z.number() })
  })
});
```

**With callbacks:**
```ts
const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Write a story',
  onStepFinish: ({ text, usage }) => console.log(text, usage),
  onFinish: ({ text, totalUsage }) => console.log('Done:', text, totalUsage)
});
```

**Multi-step with prepareStep:**
```ts
const { text, steps } = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Solve this problem',
  tools: { calculate: { ... } },
  prepareStep: ({ stepNumber, steps }) => {
    if (stepNumber === 1) return { toolChoice: 'required' };
    return { toolChoice: 'none' };
  }
});
```

### streamtext
Stream text from LLMs with tools, structured outputs, multi-step generation, and comprehensive callbacks; returns promises and async streams for text/events/parsed outputs.

## streamText()

Streams text generations from a language model for interactive use cases like chatbots and real-time applications. Supports tool calling and UI component generation.

### Basic Usage

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

const { textStream } = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### Key Parameters

**Model & Input:**
- `model` (LanguageModel): The language model to use
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `prompt` (string | Array<ModelMessage>): Input prompt or conversation messages
- `messages` (Array<ModelMessage>): Conversation messages with support for text, images, and files

**Message Types:**
- SystemModelMessage: `{ role: 'system', content: string }`
- UserModelMessage: `{ role: 'user', content: string | Array<TextPart | ImagePart | FilePart> }`
- AssistantModelMessage: `{ role: 'assistant', content: string | Array<TextPart | ReasoningPart | FilePart | ToolCallPart> }`
- ToolModelMessage: `{ role: 'tool', content: Array<ToolResultPart> }`

**Tools:**
- `tools` (ToolSet): Tools accessible to the model with description, inputSchema (Zod or JSON Schema), and optional execute function
- `toolChoice` ("auto" | "none" | "required" | { type: "tool", toolName: string }): How tools are selected
- `activeTools` (Array<string>): Which tools are currently active
- `stopWhen` (StopCondition | Array<StopCondition>): Condition for stopping generation with tool results

**Generation Control:**
- `maxOutputTokens` (number): Maximum tokens to generate
- `temperature` (number): Randomness (0-1 range, provider-dependent)
- `topP` (number): Nucleus sampling
- `topK` (number): Sample from top K options
- `presencePenalty` (number): Likelihood to repeat information in prompt
- `frequencyPenalty` (number): Likelihood to repeat same words/phrases
- `stopSequences` (string[]): Sequences that stop generation
- `seed` (number): For deterministic results

**Advanced:**
- `maxRetries` (number): Default 2
- `abortSignal` (AbortSignal): Cancel the call
- `headers` (Record<string, string>): Additional HTTP headers
- `output` (Output): Specification for parsing structured outputs (text, object, array, choice, json)
- `prepareStep` (function): Modify settings per step (model, toolChoice, activeTools, system, messages)
- `experimental_context` (unknown): Context passed to tool execution
- `experimental_download` (function): Custom URL download function
- `experimental_repairToolCall` (function): Repair failed tool call parsing
- `experimental_telemetry` (TelemetrySettings): Enable/disable telemetry, record inputs/outputs, add metadata
- `experimental_transform` (StreamTextTransform | Array<StreamTextTransform>): Stream transformations
- `includeRawChunks` (boolean): Include raw provider chunks
- `providerOptions` (Record<string, JSONObject>): Provider-specific options

**Callbacks:**
- `onChunk` (event: OnChunkResult): Called for each stream chunk
- `onError` (event: OnErrorResult): Called on errors
- `onStepFinish` (result: onStepFinishResult): Called when a step finishes
- `onFinish` (result: OnFinishResult): Called when LLM response and tool executions complete
- `onAbort` (event: OnAbortResult): Called when stream is aborted

### Return Values

**Promises (auto-consume stream):**
- `content` (Promise<Array<ContentPart>>): Generated content in last step
- `text` (Promise<string>): Full generated text
- `reasoning` (Promise<Array<ReasoningOutput>>): Model reasoning (if available)
- `reasoningText` (Promise<string | undefined>): Reasoning text
- `sources` (Promise<Array<Source>>): Sources used (RAG models)
- `files` (Promise<Array<GeneratedFile>>): Generated files
- `toolCalls` (Promise<TypedToolCall[]>): Executed tool calls
- `toolResults` (Promise<TypedToolResult[]>): Tool execution results
- `finishReason` (Promise<'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'>)
- `usage` (Promise<LanguageModelUsage>): Token usage of last step
- `totalUsage` (Promise<LanguageModelUsage>): Total token usage across all steps
- `providerMetadata` (Promise<ProviderMetadata | undefined>)
- `request` (Promise<LanguageModelRequestMetadata>): Request body sent to provider
- `response` (Promise<LanguageModelResponseMetadata>): Response metadata with messages
- `warnings` (Promise<Warning[] | undefined>): Provider warnings
- `steps` (Promise<Array<StepResult>>): Information for every step

**Streams:**
- `textStream` (AsyncIterableStream<string>): Text deltas only
- `fullStream` (AsyncIterable<TextStreamPart> & ReadableStream): All events including text, tool calls, tool results, errors
- `partialOutputStream` (AsyncIterableStream<PARTIAL_OUTPUT>): Partial parsed outputs using output specification
- `output` (Promise<COMPLETE_OUTPUT>): Complete parsed output

**Stream Part Types:**
- `{ type: 'text', text: string }`: Text delta
- `{ type: 'reasoning', text: string, providerMetadata?: ProviderMetadata }`: Reasoning
- `{ type: 'source', sourceType: 'url', id: string, url: string, title?: string, providerMetadata?: ProviderMetadata }`: Source
- `{ type: 'file', file: GeneratedFile }`: Generated file
- `{ type: 'tool-call', toolCallId: string, toolName: string, input: object }`: Tool call
- `{ type: 'tool-call-streaming-start', toolCallId: string, toolName: string }`: Tool call start
- `{ type: 'tool-call-delta', toolCallId: string, toolName: string, argsTextDelta: string }`: Tool call argument delta
- `{ type: 'tool-result', toolCallId: string, toolName: string, input: object, output: any }`: Tool result
- `{ type: 'start-step', request: LanguageModelRequestMetadata, warnings: Warning[] }`: Step start
- `{ type: 'finish-step', response: LanguageModelResponseMetadata, usage: LanguageModelUsage, finishReason: string, providerMetadata?: ProviderMetadata }`: Step finish
- `{ type: 'start' }`: Stream start
- `{ type: 'finish', finishReason: string, totalUsage: LanguageModelUsage }`: Stream finish
- `{ type: 'reasoning-part-finish' }`: Reasoning part end
- `{ type: 'error', error: unknown }`: Error
- `{ type: 'abort' }`: Abort

**Response Conversion:**
- `toUIMessageStream(options?: UIMessageStreamOptions)`: Convert to UI message stream
- `pipeUIMessageStreamToResponse(response: ServerResponse, options?: ResponseInit & UIMessageStreamOptions)`: Write to Node.js response
- `pipeTextStreamToResponse(response: ServerResponse, init?: ResponseInit)`: Write text deltas to Node.js response
- `toUIMessageStreamResponse(options?: ResponseInit & UIMessageStreamOptions)`: Create streamed response with UI messages
- `toTextStreamResponse(init?: ResponseInit)`: Create simple text stream response
- `consumeStream(options?: ConsumeStreamOptions)`: Consume stream without processing

### Examples

**Basic text streaming:**
```ts
const { textStream } = streamText({
  model: openai('gpt-4'),
  prompt: 'Invent a new holiday and describe its traditions.',
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

**Chat with messages:**
```ts
const { text } = await streamText({
  model: openai('gpt-4'),
  messages: [
    { role: 'user', content: 'What is the capital of France?' }
  ],
});
```

**With tools:**
```ts
const { fullStream } = streamText({
  model: openai('gpt-4'),
  prompt: 'Get the weather',
  tools: {
    getWeather: {
      description: 'Get weather for a location',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ temp: 72, location })
    }
  }
});

for await (const event of fullStream) {
  if (event.type === 'tool-call') {
    console.log(`Calling ${event.toolName}:`, event.input);
  } else if (event.type === 'tool-result') {
    console.log(`Result:`, event.output);
  } else if (event.type === 'text') {
    process.stdout.write(event.text);
  }
}
```

**Structured output:**
```ts
const { output } = await streamText({
  model: openai('gpt-4'),
  prompt: 'Generate a recipe',
  output: Output.object({
    schema: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string())
    })
  })
});

const recipe = await output;
```

**With callbacks:**
```ts
const result = streamText({
  model: openai('gpt-4'),
  prompt: 'Hello',
  onChunk: async (event) => {
    console.log('Chunk:', event.chunk);
  },
  onStepFinish: async (result) => {
    console.log('Step finished:', result.finishReason, result.usage);
  },
  onFinish: async (result) => {
    console.log('Complete:', result.text, result.totalUsage);
  },
  onError: async (event) => {
    console.error('Error:', event.error);
  }
});

await result.text;
```

**Response conversion in Next.js:**
```ts
export async function POST(req: Request) {
  const result = streamText({
    model: openai('gpt-4'),
    messages: await req.json()
  });
  
  return result.toTextStreamResponse();
}
```

**Multi-step with prepareStep:**
```ts
const { text } = await streamText({
  model: openai('gpt-4'),
  prompt: 'Solve this step by step',
  prepareStep: async ({ stepNumber, messages }) => {
    if (stepNumber > 1) {
      return {
        system: 'Continue solving the problem'
      };
    }
  }
});
```

### generateobject
API for generating structured objects/arrays/enums from LLMs with Zod/JSON schemas, supporting multiple output modes, token controls, and provider options.

## generateObject()

Generates typed, structured objects from language models using schemas for information extraction, synthetic data generation, and classification tasks.

### Core Functionality

The function forces language models to return structured data validated against a schema. It supports multiple output types:
- **object**: Single structured object (default)
- **array**: Array of objects matching a schema
- **enum**: Selection from predefined values
- **no-schema**: Unstructured JSON output

### Examples

**Generate object with Zod schema:**
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

**Generate array:**
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

**Generate enum:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole..."',
});
```

**Generate JSON without schema:**
```ts
const { object } = await generateObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

### Parameters

**Required:**
- `model`: Language model instance
- `prompt` or `messages`: Input text or message array

**Schema Configuration:**
- `schema`: Zod or JSON schema describing output shape (not for 'no-schema' or 'enum')
- `schemaName`: Optional name for provider guidance
- `schemaDescription`: Optional description for provider guidance
- `output`: Output type ('object' | 'array' | 'enum' | 'no-schema'), defaults to 'object'
- `enum`: Array of possible values (only for 'enum' output)
- `mode`: Generation mode ('auto' | 'json' | 'tool'), defaults to 'auto' for objects, 'json' for no-schema

**System & Messages:**
- `system`: System prompt string or SystemModelMessage
- `messages`: Array of conversation messages (SystemModelMessage, UserModelMessage, AssistantModelMessage, ToolModelMessage)

**User Messages** can contain:
- `TextPart`: `{ type: 'text', text: string }`
- `ImagePart`: `{ type: 'image', image: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType?: string }`
- `FilePart`: `{ type: 'file', data: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType: string }`

**Assistant Messages** can contain:
- `TextPart`, `ReasoningPart`, `FilePart`, `ToolCallPart`

**Tool Messages** contain:
- `ToolResultPart`: `{ type: 'tool-result', toolCallId: string, toolName: string, result: unknown, isError?: boolean }`

**Generation Parameters:**
- `maxOutputTokens`: Maximum tokens to generate
- `temperature`: Sampling temperature (0-1 range depends on provider)
- `topP`: Nucleus sampling (alternative to temperature)
- `topK`: Sample from top K options
- `presencePenalty`: Penalize repeated information
- `frequencyPenalty`: Penalize repeated words/phrases
- `seed`: Integer for deterministic results

**Request Control:**
- `maxRetries`: Maximum retry attempts (default: 2)
- `abortSignal`: AbortSignal for cancellation
- `headers`: Additional HTTP headers
- `providerOptions`: Provider-specific options

**Advanced:**
- `experimental_repairText`: Function to repair malformed JSON output
- `experimental_download`: Custom URL download function
- `experimental_telemetry`: Telemetry configuration (isEnabled, recordInputs, recordOutputs, functionId, metadata)

### Return Value

- `object`: Generated object validated by schema
- `finishReason`: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown'
- `usage`: Token usage (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `request`: Request metadata (body as string)
- `response`: Response metadata (id, modelId, timestamp, headers, body)
- `reasoning`: Concatenated reasoning text (if available)
- `warnings`: Provider warnings
- `providerMetadata`: Provider-specific metadata
- `toJsonResponse(init?)`: Converts to JSON Response with status 200

### streamobject
Stream typed structured objects with schema validation; supports object/array/enum/no-schema modes; returns partial streams, full event stream, and final object with token usage.

## streamObject()

Streams a typed, structured object for a given prompt and schema using a language model. Forces the model to return structured data for information extraction, synthetic data generation, or classification tasks.

### Output Modes

- **'object'** (default): Stream a single typed object matching a schema
- **'array'**: Stream array elements individually; schema describes array items
- **'enum'**: Generate one of predefined enum values
- **'no-schema'**: Generate JSON without schema validation

### Generation Modes

- **'auto'** (default for 'object'): Automatically choose between json/tool modes
- **'json'**: Force JSON mode
- **'tool'**: Force tool/function calling mode (not available for 'no-schema')

### Examples

Stream object with schema:
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

Stream array elements:
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

Generate JSON without schema:
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

Generate enum value:
```ts
const { partialObjectStream } = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['action', 'comedy', 'drama', 'horror', 'sci-fi'],
  prompt: 'Classify the genre of this movie plot: "A group of astronauts travel through a wormhole in search of a new habitable planet for humanity."',
});
```

### Parameters

**Core:**
- `model` (LanguageModel): The language model to use
- `output` ('object' | 'array' | 'enum' | 'no-schema'): Type of output to generate
- `mode` ('auto' | 'json' | 'tool'): Generation mode
- `schema` (Zod Schema | JSON Schema): Describes the shape of object/array elements; not available with 'no-schema' or 'enum'
- `schemaName` (string): Optional name for additional LLM guidance
- `schemaDescription` (string): Optional description for additional LLM guidance
- `prompt` (string | message array): Input prompt
- `system` (string): System prompt
- `messages` (message array): Conversation messages with support for text, image, and file parts

**Sampling:**
- `temperature` (number): Controls randomness
- `topP` (number): Nucleus sampling
- `topK` (number): Sample from top K options
- `presencePenalty` (number): Penalizes repeating information from prompt
- `frequencyPenalty` (number): Penalizes repeated words/phrases
- `seed` (number): For deterministic results

**Limits & Control:**
- `maxOutputTokens` (number): Maximum tokens to generate
- `maxRetries` (number): Retry attempts (default: 2)
- `abortSignal` (AbortSignal): Cancel the call
- `headers` (Record<string, string>): Additional HTTP headers

**Advanced:**
- `experimental_repairText` (function): Repair malformed JSON output
- `experimental_download` (function): Custom URL download handler
- `experimental_telemetry` (TelemetrySettings): Enable telemetry with input/output recording and metadata
- `providerOptions` (Record<string, JSONObject>): Provider-specific options
- `onError` (callback): Called when error occurs
- `onFinish` (callback): Called when LLM response finishes; receives usage, metadata, final object, and errors

### Returns

**Promises:**
- `usage`: Token usage (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `object`: Final generated object typed to schema
- `providerMetadata`: Provider-specific metadata
- `request`: Raw HTTP request body sent to provider
- `response`: Response metadata (id, model, timestamp, headers)

**Streams:**
- `partialObjectStream` (AsyncIterableStream<DeepPartial<T>>): Partial objects as they stream; not validated
- `elementStream` (AsyncIterableStream<ELEMENT>): Array elements (array mode only)
- `textStream` (AsyncIterableStream<string>): JSON text chunks
- `fullStream` (AsyncIterableStream<ObjectStreamPart<T>>): All events including object parts, text deltas, errors, and finish events with finishReason and logprobs

**Response Helpers:**
- `pipeTextStreamToResponse(response, init)`: Write text deltas to Node.js response with Content-Type text/plain
- `toTextStreamResponse(init)`: Create simple text stream Response

**Other:**
- `warnings`: Provider warnings (e.g. unsupported settings)

### embed
embed() generates a single embedding vector from a value using a specified embedding model, with configurable retries, abort signals, headers, and optional telemetry.

## embed()

Generate an embedding for a single value using an embedding model.

**Use case:** Embed a single value to retrieve similar items or use the embedding in downstream tasks.

**Example:**
```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

**Parameters:**
- `model` (EmbeddingModel, required): The embedding model to use. Example: `openai.embeddingModel('text-embedding-3-small')`
- `value` (VALUE, required): The value to embed. Type depends on the model.
- `maxRetries` (number, optional): Maximum number of retries. Default: 2. Set to 0 to disable.
- `abortSignal` (AbortSignal, optional): Cancel the call.
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers.
- `experimental_telemetry` (TelemetrySettings, optional): Telemetry configuration with options:
  - `isEnabled` (boolean): Enable/disable telemetry. Disabled by default.
  - `recordInputs` (boolean): Record inputs. Enabled by default.
  - `recordOutputs` (boolean): Record outputs. Enabled by default.
  - `functionId` (string): Identifier to group telemetry data.
  - `metadata` (Record<string, ...>): Additional telemetry data.
  - `tracer` (Tracer): Custom tracer for telemetry.

**Returns:**
- `value` (VALUE): The value that was embedded.
- `embedding` (number[]): The embedding vector.
- `usage` (EmbeddingModelUsage): Token usage with `tokens` (number).
- `response` (Response, optional): Response data with `headers` and `body`.
- `providerMetadata` (ProviderMetadata | undefined, optional): Provider-specific metadata.

### embedmany
embedMany() embeds multiple values with automatic request chunking; accepts model, values array, optional retries/abort/headers/telemetry; returns embeddings array, usage tokens, and provider metadata.

## embedMany()

Embed multiple values using an embedding model. The function automatically chunks large requests if the model has embedding limits.

### Basic Usage

```ts
import { embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

### Parameters

- **model** (EmbeddingModel): The embedding model to use. Example: `openai.embeddingModel('text-embedding-3-small')`
- **values** (Array<VALUE>): The values to embed. Type depends on the model.
- **maxRetries** (number, optional): Maximum retry attempts. Default: 2. Set to 0 to disable.
- **abortSignal** (AbortSignal, optional): Signal to cancel the call.
- **headers** (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers.
- **experimental_telemetry** (TelemetrySettings, optional): Telemetry configuration with options:
  - **isEnabled** (boolean, optional): Enable/disable telemetry. Disabled by default.
  - **recordInputs** (boolean, optional): Record inputs. Enabled by default.
  - **recordOutputs** (boolean, optional): Record outputs. Enabled by default.
  - **functionId** (string, optional): Identifier to group telemetry by function.
  - **metadata** (Record<string, ...>, optional): Additional telemetry metadata.
  - **tracer** (Tracer, optional): Custom tracer for telemetry.

### Returns

- **values** (Array<VALUE>): The values that were embedded.
- **embeddings** (number[][]): The embeddings in the same order as input values.
- **usage** (EmbeddingModelUsage): Token usage with:
  - **tokens** (number): Total input tokens.
  - **body** (unknown, optional): Response body.
- **providerMetadata** (ProviderMetadata | undefined, optional): Provider-specific metadata.

### rerank
Rerank documents by semantic relevance to a query; returns ranking array with scores and indices, reranked documents, and response metadata.

## Purpose
Rerank documents based on relevance to a query using a reranking model. Useful for improving search results by reordering documents, emails, or other content based on semantic understanding.

## Basic Usage
```ts
import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
});
```

## Parameters
- `model` (RerankingModel): The reranking model to use, e.g., `cohere.reranking('rerank-v3.5')`
- `documents` (Array<VALUE>): Documents to rerank - can be strings or JSON objects
- `query` (string): Search query to rank documents against
- `topN` (number, optional): Maximum number of top documents to return; if not specified, all are returned
- `maxRetries` (number, optional): Maximum retries, default 2
- `abortSignal` (AbortSignal, optional): Cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (ProviderOptions, optional): Provider-specific options
- `experimental_telemetry` (TelemetrySettings, optional): Telemetry configuration with `isEnabled`, `recordInputs`, `recordOutputs`, `functionId`, `metadata`, and `tracer`

## Return Value
- `originalDocuments` (Array<VALUE>): Original documents in original order
- `rerankedDocuments` (Array<VALUE>): Documents sorted by relevance score (descending)
- `ranking` (Array<RankingItem<VALUE>>): Array of ranking items with:
  - `originalIndex` (number): Index in original array
  - `score` (number): Relevance score (typically 0-1, higher = more relevant)
  - `document` (VALUE): The document itself
- `response` (Response): Response metadata including `id`, `timestamp`, `modelId`, `headers`, `body`
- `providerMetadata` (ProviderMetadata, optional): Provider-specific metadata

## Examples

### String Documents
```ts
const { ranking, rerankedDocuments } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
  query: 'talk about rain',
  topN: 2,
});

console.log(rerankedDocuments);
// ['rainy afternoon in the city', 'sunny day at the beach']

console.log(ranking);
// [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon...' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day...' }
// ]
```

### Object Documents
```ts
const documents = [
  {
    from: 'Paul Doe',
    subject: 'Follow-up',
    text: 'We are happy to give you a discount of 20%.',
  },
  {
    from: 'John McGill',
    subject: 'Missing Info',
    text: 'Here is the pricing from Oracle: $5000/month',
  },
];

const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});

console.log(ranking[0].document);
// { from: 'John McGill', subject: 'Missing Info', ... }
```

### With Provider Options
```ts
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents: ['sunny day at the beach', 'rainy afternoon in the city'],
  query: 'talk about rain',
  providerOptions: {
    cohere: {
      maxTokensPerDoc: 1000,
    },
  },
});
```

### generateimage
Experimental API to generate images from text prompts; accepts model, prompt, and optional n/size/aspectRatio/seed/providerOptions/maxRetries/abortSignal/headers; returns image, images array, warnings, and response metadata with base64/uint8Array/mediaType.

## generateImage()

Generates images based on a given prompt using an image model. Experimental feature.

### Import
```ts
import { experimental_generateImage as generateImage } from 'ai';
```

### Usage
```ts
const { images } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A futuristic cityscape at sunset',
  n: 3,
  size: '1024x1024',
});
```

### Parameters
- `model` (ImageModelV3): The image model to use
- `prompt` (string): The input prompt to generate the image from
- `n` (number, optional): Number of images to generate
- `size` (string, optional): Size of images in format `{width}x{height}`
- `aspectRatio` (string, optional): Aspect ratio in format `{width}:{height}`
- `seed` (number, optional): Seed for reproducible generation
- `providerOptions` (ProviderOptions, optional): Provider-specific options
- `maxRetries` (number, optional): Maximum retries, default 2
- `abortSignal` (AbortSignal, optional): Cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers

### Returns
- `image` (GeneratedFile): The first generated image
- `images` (Array<GeneratedFile>): All generated images
- `warnings` (Warning[]): Warnings from the model provider
- `providerMetadata` (ImageModelProviderMetadata, optional): Provider-specific metadata
- `responses` (Array<ImageModelResponseMetadata>): Response metadata from provider

Each GeneratedFile contains:
- `base64` (string): Image as base64 encoded string
- `uint8Array` (Uint8Array): Image as Uint8Array
- `mediaType` (string): IANA media type of the image

Response metadata includes:
- `timestamp` (Date): Start time of response
- `modelId` (string): ID of the model used
- `headers` (Record<string, string>, optional): Response headers

### transcribe
Experimental transcribe() function converts audio files to text with segment timing, language detection, and provider metadata.

## Overview
Generates a transcript from an audio file using a transcription model.

**Status**: Experimental feature

## Usage
```ts
import { experimental_transcribe as transcribe } from 'ai';
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const { text: transcript } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

console.log(transcript);
```

## Parameters
- `model` (TranscriptionModelV3): The transcription model to use
- `audio` (DataContent | URL): The audio file to transcribe (string, Uint8Array, ArrayBuffer, Buffer, or URL)
- `providerOptions` (Record<string, JSONObject>, optional): Additional provider-specific options
- `maxRetries` (number, optional): Maximum number of retries, default 2
- `abortSignal` (AbortSignal, optional): Signal to cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers

## Returns
- `text` (string): Complete transcribed text
- `segments` (Array): Transcript segments with text, startSecond, and endSecond
- `language` (string | undefined): ISO-639-1 language code (e.g., "en")
- `durationInSeconds` (number | undefined): Duration of audio in seconds
- `warnings` (Warning[]): Provider warnings
- `responses` (Array<TranscriptionModelResponseMetadata>): Provider response metadata including timestamp, modelId, and headers

### generatespeech
Text-to-speech function supporting OpenAI/ElevenLabs with configurable voice, format, speed, language; returns audio in base64/Uint8Array with metadata.

## generateSpeech()

Generates speech audio from text using various AI providers.

**Status**: Experimental feature

**Basic Usage**:
```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

**Provider Examples**:
- OpenAI: `openai.speech('tts-1')` with voice 'alloy'
- ElevenLabs: `elevenlabs.speech('eleven_multilingual_v2')` with voice ID from account

**Parameters**:
- `model` (required): SpeechModelV3 - the speech model to use
- `text` (required): string - text to generate speech from
- `voice` (optional): string - voice identifier
- `outputFormat` (optional): string - output format like "mp3", "wav"
- `instructions` (optional): string - generation instructions
- `speed` (optional): number - speech generation speed
- `language` (optional): string - ISO 639-1 language code or "auto" for detection
- `providerOptions` (optional): Record<string, JSONObject> - provider-specific options
- `maxRetries` (optional): number - default 2
- `abortSignal` (optional): AbortSignal - for cancellation
- `headers` (optional): Record<string, string> - HTTP headers

**Returns**:
- `audio`: GeneratedAudioFile object containing:
  - `base64`: string - base64 encoded audio
  - `uint8Array`: Uint8Array - audio as bytes
  - `mimeType`: string - MIME type (e.g. "audio/mpeg")
  - `format`: string - format (e.g. "mp3")
- `warnings`: Warning[] - provider warnings
- `responses`: SpeechModelResponseMetadata[] - response metadata with timestamp, modelId, body, headers

### agent.mdx
Agent interface contract: version, id, tools properties; generate() and stream() methods accepting prompt/messages with optional call options and abort signal; supports custom implementations and tool-based workflows.

## Agent Interface

The `Agent` interface defines a contract for AI agents that generate or stream responses to prompts. Agents can encapsulate advanced logic like tool usage, multi-step workflows, and prompt handling.

### Interface Definition

```ts
export type AgentCallParameters<CALL_OPTIONS> = ([CALL_OPTIONS] extends [never]
  ? { options?: never }
  : { options: CALL_OPTIONS }) &
  (
    | { prompt: string | Array<ModelMessage>; messages?: never }
    | { messages: Array<ModelMessage>; prompt?: never }
  ) & {
    abortSignal?: AbortSignal;
  };

export interface Agent<
  CALL_OPTIONS = never,
  TOOLS extends ToolSet = {},
  OUTPUT extends Output = never,
> {
  readonly version: 'agent-v1';
  readonly id: string | undefined;
  readonly tools: TOOLS;
  generate(options: AgentCallParameters<CALL_OPTIONS>): PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>;
  stream(options: AgentCallParameters<CALL_OPTIONS>): PromiseLike<StreamTextResult<TOOLS, OUTPUT>>;
}
```

### Core Properties & Methods

- `version`: `'agent-v1'` — Interface version for compatibility
- `id`: `string | undefined` — Optional agent identifier
- `tools`: `ToolSet` — Available tools for the agent
- `generate()`: Returns `PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>` — Non-streaming output
- `stream()`: Returns `PromiseLike<StreamTextResult<TOOLS, OUTPUT>>` — Streaming output

### Generic Parameters

- `CALL_OPTIONS` (default: `never`): Type for additional call options
- `TOOLS` (default: `{}`): Type of the tool set
- `OUTPUT` (default: `never`): Type of additional output data

### Method Parameters

Both `generate()` and `stream()` accept `AgentCallParameters<CALL_OPTIONS>`:
- `prompt`: String or array of `ModelMessage` objects
- `messages`: Array of `ModelMessage` objects (mutually exclusive with `prompt`)
- `options`: Additional call options when `CALL_OPTIONS` is not `never`
- `abortSignal`: `AbortSignal` to cancel the operation

### Custom Agent Implementation

```ts
import { Agent } from 'ai';
import type { ModelMessage } from '@ai-sdk/provider-utils';

class MyEchoAgent implements Agent {
  version = 'agent-v1' as const;
  id = 'echo';
  tools = {};

  async generate({ prompt, messages, abortSignal }) {
    const text = prompt ?? JSON.stringify(messages);
    return { text, steps: [] };
  }

  async stream({ prompt, messages, abortSignal }) {
    const text = prompt ?? JSON.stringify(messages);
    return {
      textStream: (async function* () {
        yield text;
      })(),
    };
  }
}
```

### Usage with SDK Utilities

All SDK utilities that accept agents (like `createAgentUIStream`, `createAgentUIStreamResponse`, `pipeAgentUIStreamToResponse`) expect an object adhering to the `Agent` interface. Use the official `ToolLoopAgent` for multi-step workflows with tool use, or supply a custom implementation:

```ts
import { ToolLoopAgent, createAgentUIStream } from "ai";

const agent = new ToolLoopAgent({ ... });
const stream = await createAgentUIStream({
  agent,
  messages: [{ role: "user", content: "What is the weather in NYC?" }]
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

### Key Notes

- Agents should define `tools` property even if empty (`{}`)
- Accept either `prompt` or `messages`, not both
- `CALL_OPTIONS` generic allows agents to accept additional call-specific options
- `abortSignal` enables operation cancellation
- Design supports both complex autonomous agents and simple LLM wrappers

### toolloopagent
Multi-step agent class with generate()/stream() methods, tool calling, configurable stop conditions, structured output parsing, and type-safe UI message inference.

## ToolLoopAgent

A reusable AI agent class that creates autonomous, multi-step agents capable of generating text, streaming responses, and iteratively invoking tools until a stop condition is reached. Unlike single-step calls, agents can collect tool results and decide next actions in a reasoning-and-acting loop.

### Constructor Parameters

- `model` (required): LanguageModel instance
- `instructions`: System prompt/context (string or SystemModelMessage)
- `tools`: Record of available tools (requires model support for tool calling)
- `toolChoice`: Tool selection strategy ('auto' | 'none' | 'required' | {type: 'tool', toolName: string}), default 'auto'
- `stopWhen`: Stop condition(s), default stepCountIs(20)
- `activeTools`: Array limiting available tools for a specific call
- `output`: Structured output specification for type-safe parsing
- `prepareStep`: Function to mutate step settings or inject state per step
- `experimental_repairToolCall`: Callback for automatic recovery on unparseable tool calls
- `onStepFinish`: Callback after each agent step completes
- `experimental_context`: Custom context object passed to tool calls
- `experimental_telemetry`: Telemetry configuration
- `experimental_download`: Custom download function for files/URLs
- `maxOutputTokens`, `temperature`, `topP`, `topK`, `presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`: Model parameters
- `maxRetries`: Retry count on failure, default 2
- `abortSignal`: Cancel ongoing request
- `providerOptions`: Provider-specific configuration
- `id`: Custom agent identifier

### Methods

**`generate()`**: Runs agent loop and returns final result as GenerateTextResult
- Parameters: `prompt` (string | ModelMessage[]), `messages` (ModelMessage[]), `abortSignal`
- Returns: GenerateTextResult with text, steps array, and other metadata

**`stream()`**: Streams agent response including reasoning and tool calls as they occur, returns StreamTextResult
- Parameters: `prompt`, `messages`, `abortSignal`, `experimental_transform`
- Returns: StreamTextResult with textStream and other metadata

### Types

**`InferAgentUIMessage<AgentType, MetadataType?>`**: Infers type-safe UI message type for given agent instance, optionally with custom metadata schema.

### Examples

Basic agent with tools:
```ts
const assistant = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
  stopWhen: stepCountIs(3),
});
const result = await assistant.generate({
  prompt: 'What is the weather in NYC and what is 100 * 25?',
});
console.log(result.text, result.steps);
```

Streaming:
```ts
const stream = agent.stream({
  prompt: 'Tell me a short story about a time traveler.',
});
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

Output parsing with Zod schema:
```ts
const analysisAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  output: {
    schema: z.object({
      sentiment: z.enum(['positive', 'negative', 'neutral']),
      score: z.number(),
      summary: z.string(),
    }),
  },
});
const result = await analysisAgent.generate({
  prompt: 'Analyze this review: "The product exceeded my expectations!"',
});
console.log(result.output); // Type-safe output
```

Type-safe UI messages with metadata:
```ts
const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: weatherTool },
});
type WeatherAgentUIMessage = InferAgentUIMessage<typeof weatherAgent>;

// With custom metadata
const metadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
  finishReason: z.string().optional(),
});
type MetadataAgentUIMessage = InferAgentUIMessage<typeof metadataAgent, z.infer<typeof metadataSchema>>;
```

### createagentuistream
Streams agent execution as async iterable of UI message chunks; validates/converts messages, invokes agent.stream(), supports AbortSignal cancellation.

## createAgentUIStream

Runs an Agent and returns a streaming UI message stream as an async iterable, allowing incremental consumption of agent reasoning and UI messages in servers, edge functions, or background jobs.

### Import
```ts
import { createAgentUIStream } from "ai"
```

### Usage
```ts
import { ToolLoopAgent, createAgentUIStream } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
});

export async function* streamAgent(messages: unknown[], abortSignal?: AbortSignal) {
  const stream = await createAgentUIStream({
    agent,
    messages,
    abortSignal,
  });

  for await (const chunk of stream) {
    yield chunk; // UI message chunk object
  }
}

// Or directly:
const controller = new AbortController();
const stream = await createAgentUIStream({
  agent,
  messages: [{ role: 'user', content: 'What is the weather in SF today?' }],
  abortSignal: controller.signal,
  sendStart: true,
});

for await (const chunk of stream) {
  console.log(chunk);
}
// Call controller.abort() to stop streaming early
```

### Parameters
- `agent` (Agent, required): Agent instance with defined tools and `.stream({ prompt })` method
- `messages` (unknown[], required): Array of input UI messages
- `abortSignal` (AbortSignal, optional): Signal to cancel streaming
- `...options` (UIMessageStreamOptions, optional): Additional customization options

### Returns
`Promise<AsyncIterableStream<UIMessageChunk>>` - async iterable of UI message chunks representing incremental agent output

### How It Works
1. Validates and normalizes incoming messages according to agent's tools
2. Converts validated UI messages to model message format
3. Invokes agent's `.stream({ prompt, abortSignal })` method
4. Exposes result stream as async iterable of UI message chunks

### Notes
- Agent must define tools and `.stream({ prompt })` method
- For HTTP responses, use createAgentUIStreamResponse or pipeAgentUIStreamToResponse instead
- Supports UIMessageStreamOptions for fine-grained output control
- Supply AbortSignal to cancel streaming operations

### createagentuistreamresponse
Streams Agent output as HTTP Response with UI messages; validates/transforms messages, calls agent.stream(), returns Promise<Response> with chunks; server-side only.

## Purpose
Executes an Agent and streams its output as a UI message stream in an HTTP Response body. Designed for building API endpoints that deliver real-time streaming results from agents (chat, tool-use applications).

## Import
```ts
import { createAgentUIStreamResponse } from "ai"
```

## Parameters
- `agent` (required): Agent instance with `.stream({ prompt })` method and defined tools
- `messages` (required): Array of input UI messages (user and assistant message objects)
- `abortSignal` (optional): AbortSignal for cancellation on client disconnect
- `...options` (optional): UIMessageStreamOptions like `sendSources`, `includeUsage`, `experimental_transform`

## Returns
`Promise<Response>` with streaming UI messages in body, suitable for HTTP API routes.

## Usage Examples

**Next.js API Route:**
```ts
import { createAgentUIStreamResponse } from 'ai';
import { ToolLoopAgent } from 'ai';

const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
});

export async function POST(request: Request) {
  const { messages } = await request.json();
  const abortController = new AbortController();

  return createAgentUIStreamResponse({
    agent,
    messages,
    abortSignal: abortController.signal,
    sendSources: true,
    includeUsage: true,
  });
}
```

## How It Works
1. Validates and normalizes incoming messages array
2. Transforms messages to internal model format
3. Calls agent's `.stream({ prompt })` method
4. Returns stream of UI message chunks as HTTP Response

## Important Notes
- Agent must define `tools` and implement `.stream({ prompt })`
- Server-side only, not for browser use
- Supports Readable Streams for HTTP consumption
- Can customize with UIMessageStreamOptions including experimental transforms

### pipeagentuistreamtoresponse
Pipes Agent UI message stream to Node.js ServerResponse for low-latency real-time streaming in chat/tool-use endpoints; supports AbortSignal cancellation; Node.js-only (not Edge/serverless).

## Purpose
Executes an Agent and streams its UI message output directly to a Node.js `ServerResponse` object. Designed for building API endpoints in Node.js servers (Express, Hono, custom servers) that need low-latency, real-time UI message streaming from agents for chat or tool-use applications.

## Import
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
```

## Parameters
- `response` (ServerResponse, required): Node.js ServerResponse object to pipe the UI message stream to
- `agent` (Agent, required): Agent instance that implements `.stream({ prompt })` and defines tools
- `messages` (unknown[], required): Array of input UI messages (user and assistant message objects)
- `abortSignal` (AbortSignal, optional): Signal to cancel streaming when client disconnects or timeout occurs
- `...options` (UIMessageStreamResponseInit & UIMessageStreamOptions, optional): Response headers, status, and streaming configuration

## Returns
Promise<void> that resolves when piping is complete.

## Usage Example
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
import { openaiWebSearchAgent } from './openai-web-search-agent';

app.post('/chat', async (req, res) => {
  const { messages } = await getJsonBody(req);
  const abortController = new AbortController();

  await pipeAgentUIStreamToResponse({
    response: res,
    agent: openaiWebSearchAgent,
    messages,
    abortSignal: abortController.signal,
    // status: 200,
    // headers: { 'X-Custom': 'foo' },
  });
});
```

## How It Works
1. Creates a UI message stream from the agent and pipes it to the ServerResponse with appropriate HTTP headers and status
2. Supports abort signal for cancellation, improving resource usage when clients disconnect
3. Writes streaming bytes directly to Node.js response (more memory and latency efficient than returning Response objects)

## Key Notes
- **Node.js only**: For Node.js environments with ServerResponse access, not for Edge/serverless/web Response APIs
- **Abort support**: Use abortSignal to stop processing early; tie to server disconnect/timeout events when possible
- **Streaming infrastructure**: Ensure client and reverse proxy support streaming HTTP responses
- **Framework support**: Works with Hono (@hono/node-server), Express, and similar Node.js frameworks

## Related
- createAgentUIStreamResponse
- Agent
- UIMessageStreamOptions
- UIMessage

### tool
Helper function enabling TypeScript type inference for tool definitions by connecting inputSchema to execute method parameters.

## Purpose
`tool()` is a helper function that enables TypeScript type inference for tool definitions. It connects the `inputSchema` to the `execute` method so that input argument types are automatically inferred.

## Example
```ts
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

## Parameters

**description** (optional, string): Information about the tool's purpose, how and when it can be used by the model.

**inputSchema** (required, Zod Schema | JSON Schema): The schema of input the tool expects. The language model uses this to generate input and validate output. Use descriptions to make input understandable for the model.

**execute** (optional, async function): Called with tool call arguments and produces a result or results iterable. Signature: `async (input: INPUT, options: ToolCallOptions) => RESULT | Promise<RESULT> | AsyncIterable<RESULT>`. If not provided, the tool won't be executed automatically.
- **ToolCallOptions** parameters:
  - **toolCallId** (string): ID of the tool call for tracking.
  - **messages** (ModelMessage[]): Messages sent to the model that initiated the tool call (excludes system prompt and assistant response).
  - **abortSignal** (optional, AbortSignal): Signal to abort the operation.
  - **experimental_context** (optional, unknown): Experimental context passed into tool execution.

**outputSchema** (optional, Zod Schema | JSON Schema): Schema of the tool's output for validation and type inference.

**toModelOutput** (optional, function): Converts tool result to output for the language model. Signature: `(output: RESULT) => LanguageModelV3ToolResultPart['output']`. If not provided, result is sent as JSON.

**onInputStart** (optional, function): Called when argument streaming starts in streaming context.

**onInputDelta** (optional, function): Called when argument streaming delta is available. Signature: `(options: { inputTextDelta: string } & ToolCallOptions) => void | PromiseLike<void>`.

**onInputAvailable** (optional, function): Called when tool call can be started, even without execute function. Signature: `(options: { input: INPUT } & ToolCallOptions) => void | PromiseLike<void>`.

**providerOptions** (optional, ProviderOptions): Additional provider-specific metadata for provider-specific functionality.

**type** (optional, 'function' | 'provider-defined'): Tool type. Defaults to "function". Use "provider-defined" for provider-specific tools.

**id** (optional, string): ID for provider-defined tools in format `<provider-name>.<unique-tool-name>`. Required when type is "provider-defined".

**name** (optional, string): Name of the tool for provider-defined tools. Required when type is "provider-defined".

**args** (optional, Record<string, unknown>): Arguments for configuring provider-defined tools.

## Returns
The tool object that was passed in.

### dynamictool
Function creating tools with unknown types for runtime schemas; requires runtime validation; use dynamic flag for type narrowing with static tools.

## Purpose
Creates tools with unknown input/output types determined at runtime, useful for MCP tools without schemas, user-defined functions loaded at runtime, tools from external sources, and dynamic tool generation.

## Key Differences from `tool()`
- Accepts and returns `unknown` types instead of compile-time known types
- Requires runtime validation/casting of inputs
- Marked with `type: 'dynamic'` in the returned Tool object

## API

**Parameters:**
- `description` (optional string): Purpose and usage details for the model
- `inputSchema` (FlexibleSchema<unknown>): Schema for validation; use `z.unknown()` or `z.any()` for fully dynamic inputs
- `execute` (async function): Called with tool arguments; input typed as `unknown`; receives `ToolCallOptions` with `toolCallId`, `messages`, and optional `abortSignal`
- `toModelOutput` (optional function): Converts tool result to format usable by language model
- `providerOptions` (optional): Provider-specific metadata

**Returns:** `Tool<unknown, unknown>` with `type: 'dynamic'`

## Examples

Basic dynamic tool:
```ts
import { dynamicTool } from 'ai';
import { z } from 'zod';

const customTool = dynamicTool({
  description: 'Execute a custom user-defined function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return { result: `Executed ${action} with ${JSON.stringify(parameters)}` };
  },
});
```

Type-safe usage with mixed static/dynamic tools:
```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: weatherTool,  // static
    custom: dynamicTool({ /* ... */ }),  // dynamic
  },
  onStepFinish: ({ toolCalls }) => {
    for (const toolCall of toolCalls) {
      if (toolCall.dynamic) {
        console.log('Dynamic:', toolCall.toolName, toolCall.input);
      } else {
        switch (toolCall.toolName) {
          case 'weather':
            console.log(toolCall.input.location);  // fully typed
        }
      }
    }
  },
});
```

With `useChat` (UIMessage format), dynamic tools appear as `dynamic-tool` parts:
```tsx
message.parts.map(part => {
  if (part.type === 'dynamic-tool') {
    return <div><h4>Tool: {part.toolName}</h4><pre>{JSON.stringify(part.input, null, 2)}</pre></div>;
  }
});
```

### createmcpclient
Lightweight MCP client factory with tools/resources/prompts/elicitation support; configurable transport (stdio/SSE/HTTP with OAuth); error handling via MCPClientError and onUncaughtError callback.

## Overview
Creates a lightweight Model Context Protocol (MCP) client for connecting to MCP servers. Provides automatic tool conversion, resource management, prompt handling, and elicitation support.

## Configuration
The client accepts `MCPClientConfig` with:
- **transport**: Message transport layer - either `MCPTransport` (custom/stdio) or `MCPTransportConfig` (SSE/HTTP with optional OAuth)
- **name**: Client identifier (defaults to "ai-sdk-mcp-client")
- **onUncaughtError**: Error handler callback
- **capabilities**: Optional client capabilities (e.g., `{ elicitation: {} }` to handle server elicitation requests)

## Methods

**tools(options?)**: Retrieves tools from MCP server with optional schema definitions for type checking.

**listResources(options?)**: Lists available resources with optional pagination and request options.

**readResource({ uri, options? })**: Reads resource contents by URI.

**listResourceTemplates(options?)**: Lists available resource templates.

**listPrompts(options?)**: Lists available prompts with optional pagination.

**getPrompt({ name, arguments?, options? })**: Retrieves a prompt by name with optional arguments.

**onElicitationRequest(schema, handler)**: Registers handler for server elicitation requests during tool execution. Handler receives request with message and requestedSchema, returns object with action ("accept", "decline", "cancel") and optional content.

**close()**: Closes connection and cleans up resources.

## Example
```typescript
import { experimental_createMCPClient as createMCPClient, generateText } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { openai } from '@ai-sdk/openai';

let client;
try {
  client = await createMCPClient({
    transport: new Experimental_StdioMCPTransport({
      command: 'node server.js',
    }),
  });
  const tools = await client.tools();
  const response = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    tools,
    messages: [{ role: 'user', content: 'Query the data' }],
  });
  console.log(response);
} catch (error) {
  console.error('Error:', error);
} finally {
  if (client) await client.close();
}
```

## Error Handling
Throws `MCPClientError` for initialization failures, protocol mismatches, missing capabilities, and connection failures. Tool execution errors propagate as `CallToolError`. Unknown errors trigger `onUncaughtError` callback.

## Limitations
Does not support server notifications or custom client configuration. Feature is experimental.

### stdiomcptransport
Experimental stdio-based MCP transport for Node.js with configurable command, args, environment, stderr handling, and working directory.

## Experimental_StdioMCPTransport

Creates a transport for Model Context Protocol (MCP) clients to communicate with MCP servers using standard input and output streams. Node.js only.

### Import
```javascript
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio"
```

### Configuration (StdioConfig)
- `command` (string, required): The command to run the MCP server
- `args` (string[], optional): Arguments to pass to the MCP server
- `env` (Record<string, string>, optional): Environment variables for the MCP server
- `stderr` (IOType | Stream | number, optional): Stream to write the MCP server's stderr to
- `cwd` (string, optional): Current working directory for the MCP server

**Note:** This feature is experimental and may change or be removed in the future.

### jsonschema
jsonSchema() creates typed JSON schema objects for structured data generation and tools; alternative to Zod with optional custom validation function.

## Overview
`jsonSchema()` is a helper function that creates JSON schema objects compatible with the AI SDK. It's an alternative to Zod schemas, useful for dynamic situations like OpenAPI definitions or when using other validation libraries. Can be used for generating structured data and in tools.

## Usage
Takes a JSON schema definition and optional validation function, with TypeScript support:

```ts
import { jsonSchema } from 'ai';

const mySchema = jsonSchema<{
  recipe: {
    name: string;
    ingredients: { name: string; amount: string }[];
    steps: string[];
  };
}>({
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              amount: { type: 'string' },
            },
            required: ['name', 'amount'],
          },
        },
        steps: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name', 'ingredients', 'steps'],
    },
  },
  required: ['recipe'],
});
```

## Parameters
- `schema` (JSONSchema7): The JSON schema definition
- `options` (SchemaOptions, optional):
  - `validate`: Optional validation function with signature `(value: unknown) => { success: true; value: OBJECT } | { success: false; error: Error }`. Returns object with `success` boolean and either `value` (if valid) or `error` (if invalid).

## Returns
A JSON schema object compatible with the AI SDK.

### zodschema
Helper to convert Zod schemas to JSON schema for AI SDK; enables recursive schemas via `useReferences` option; metadata methods must be last in chain.

## Purpose
`zodSchema()` converts Zod schemas into JSON schema objects compatible with the AI SDK. Use it for structured data generation and tool definitions, or pass Zod objects directly (the SDK converts them internally).

## Key Points
- Zod objects can be passed directly to AI SDK functions; `zodSchema()` is needed only when you want to specify options like `useReferences`
- **Critical**: When using `.meta()` or `.describe()` on Zod schemas, these methods must be called **last** in the chain, as most schema methods (`.min()`, `.optional()`, `.extend()`, etc.) return new instances that don't inherit metadata

## API
```ts
import { zodSchema } from 'ai';

zodSchema(zodSchema: z.Schema, options?: { useReferences?: boolean })
```

**Parameters:**
- `zodSchema`: The Zod schema definition
- `options.useReferences` (optional, boolean): Enables support for references in schemas. Required for recursive schemas using `z.lazy()`. Not all language models/providers support references. Defaults to `false`.

**Returns:** A Schema object compatible with the AI SDK with JSON schema representation and validation.

## Examples

Metadata placement (correct vs incorrect):
```ts
// ❌ Wrong - .min() returns new instance without metadata
z.string().meta({ describe: 'first name' }).min(1);

// ✅ Correct - .meta() is final
z.string().min(1).meta({ describe: 'first name' });
```

Recursive schema with `useReferences`:
```ts
const baseCategorySchema = z.object({ name: z.string() });

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

const mySchema = zodSchema(
  z.object({ category: categorySchema }),
  { useReferences: true }
);
```

### valibotschema
Experimental helper converting Valibot schemas to AI SDK-compatible JSON schemas for structured data generation and tool calling.

## valibotSchema()

Experimental helper function that converts Valibot schemas into JSON schema objects compatible with the AI SDK.

**Purpose**: Use Valibot schemas for structured data generation and tool definitions in the AI SDK.

**Usage**:
```ts
import { valibotSchema } from '@ai-sdk/valibot';
import { object, string, array } from 'valibot';

const recipeSchema = valibotSchema(
  object({
    name: string(),
    ingredients: array(
      object({
        name: string(),
        amount: string(),
      }),
    ),
    steps: array(string()),
  }),
);
```

**API**:
- **Parameter**: `valibotSchema` (GenericSchema<unknown, T>) - The Valibot schema definition
- **Returns**: A Schema object compatible with the AI SDK containing JSON schema representation and validation functionality

**Applications**: Structured data generation and tool calling

### modelmessage
Message structure types (system, user, assistant, tool) and content parts (text, image, file, tool-call, tool-result) for AI SDK Core with support for multimodal content and tool interactions.

## Overview
`ModelMessage` is the fundamental message structure for AI SDK Core functions, used in the `messages` field. Access the Zod schema via `modelMessageSchema` export.

## Message Types

**SystemModelMessage**: System information message
```typescript
type SystemModelMessage = {
  role: 'system';
  content: string;
};
```
Note: Using the "system" property instead is recommended to prevent prompt injection attacks.

**UserModelMessage**: User message with text, images, or files
```typescript
type UserModelMessage = {
  role: 'user';
  content: string | Array<TextPart | ImagePart | FilePart>;
};
```

**AssistantModelMessage**: Assistant response with text and/or tool calls
```typescript
type AssistantModelMessage = {
  role: 'assistant';
  content: string | Array<TextPart | ToolCallPart>;
};
```

**ToolModelMessage**: Tool call results
```typescript
type ToolModelMessage = {
  role: 'tool';
  content: Array<ToolResultPart>;
};
```

## Content Parts

**TextPart**: Plain text content
```typescript
interface TextPart {
  type: 'text';
  text: string;
}
```

**ImagePart**: Image in user message
```typescript
interface ImagePart {
  type: 'image';
  image: DataContent | URL;  // base64, Uint8Array, ArrayBuffer, Buffer, or URL
  mediaType?: string;  // auto-detected if omitted
}
```

**FilePart**: File in user message
```typescript
interface FilePart {
  type: 'file';
  data: DataContent | URL;
  filename?: string;
  mediaType: string;  // required IANA media type
}
```

**ToolCallPart**: Tool invocation (typically AI-generated)
```typescript
interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string;  // matches with tool result
  toolName: string;
  args: unknown;  // JSON-serializable, matches tool's input schema
}
```

**ToolResultPart**: Tool call result
```typescript
interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  output: LanguageModelV3ToolResultOutput;
  providerOptions?: ProviderOptions;
}
```

**LanguageModelV3ToolResultOutput**: Tool result output types
- `{ type: 'text'; value: string; providerOptions?: ProviderOptions }`
- `{ type: 'json'; value: JSONValue; providerOptions?: ProviderOptions }`
- `{ type: 'execution-denied'; reason?: string; providerOptions?: ProviderOptions }`
- `{ type: 'error-text'; value: string; providerOptions?: ProviderOptions }`
- `{ type: 'error-json'; value: JSONValue; providerOptions?: ProviderOptions }`
- `{ type: 'content'; value: Array<...> }` - complex content with text, file-data, file-url, file-id, image-data, image-url, image-file-id, or custom types, each with optional providerOptions

### uimessage
Type-safe message container for UI state with id, role, optional metadata, and polymorphic parts (text, reasoning, tool invocations, files, sources, custom data, step markers).

# UIMessage

`UIMessage` is the source of truth for application state, representing complete message history with metadata, data parts, and contextual information. Unlike `ModelMessage` (state passed to model), `UIMessage` contains full application state for UI rendering and client-side functionality.

## Type Safety

Accepts three generic parameters:
1. **METADATA** - Custom metadata type
2. **DATA_PARTS** - Custom data part types for structured data
3. **TOOLS** - Tool definitions for type-safe interactions

## Creating Custom UIMessage Type

```typescript
import { InferUITools, ToolSet, UIMessage, tool } from 'ai';
import z from 'zod';

const metadataSchema = z.object({
  someMetadata: z.string().datetime(),
});
type MyMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({
  someDataPart: z.object({}),
  anotherDataPart: z.object({}),
});
type MyDataPart = z.infer<typeof dataPartSchema>;

const tools = {
  someTool: tool({}),
} satisfies ToolSet;
type MyTools = InferUITools<typeof tools>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;
```

## UIMessage Interface

```typescript
interface UIMessage<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> {
  id: string;
  role: 'system' | 'user' | 'assistant';
  metadata?: METADATA;
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}
```

## UIMessagePart Types

**TextUIPart**: Text content with streaming state
```typescript
type TextUIPart = {
  type: 'text';
  text: string;
  state?: 'streaming' | 'done';
};
```

**ReasoningUIPart**: Reasoning text with streaming state and provider metadata
```typescript
type ReasoningUIPart = {
  type: 'reasoning';
  text: string;
  state?: 'streaming' | 'done';
  providerMetadata?: Record<string, any>;
};
```

**ToolUIPart**: Tool invocations with states (input-streaming, input-available, output-available, output-error). Type name based on tool name (e.g., `tool-someTool`)
```typescript
type ToolUIPart<TOOLS extends UITools = UITools> = ValueOf<{
  [NAME in keyof TOOLS & string]: {
    type: `tool-${NAME}`;
    toolCallId: string;
  } & (
    | {
        state: 'input-streaming';
        input: DeepPartial<TOOLS[NAME]['input']> | undefined;
        providerExecuted?: boolean;
      }
    | {
        state: 'input-available';
        input: TOOLS[NAME]['input'];
        providerExecuted?: boolean;
      }
    | {
        state: 'output-available';
        input: TOOLS[NAME]['input'];
        output: TOOLS[NAME]['output'];
        providerExecuted?: boolean;
      }
    | {
        state: 'output-error';
        input: TOOLS[NAME]['input'];
        errorText: string;
        providerExecuted?: boolean;
      }
  );
}>;
```

**SourceUrlUIPart**: Source URL reference
```typescript
type SourceUrlUIPart = {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: Record<string, any>;
};
```

**SourceDocumentUIPart**: Document source reference
```typescript
type SourceDocumentUIPart = {
  type: 'source-document';
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
  providerMetadata?: Record<string, any>;
};
```

**FileUIPart**: File with IANA media type and URL (hosted or Data URL)
```typescript
type FileUIPart = {
  type: 'file';
  mediaType: string;
  filename?: string;
  url: string;
};
```

**DataUIPart**: Custom data types. Type name based on data part name (e.g., `data-someDataPart`)
```typescript
type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
  };
}>;
```

**StepStartUIPart**: Step boundary marker
```typescript
type StepStartUIPart = {
  type: 'step-start';
};
```

### validateuimessages
validateUIMessages: async validator for UI message arrays with optional Zod schemas for metadata, data parts, and tools

## validateUIMessages

Async function that validates UI messages against schemas for metadata, data parts, and tools. Ensures type safety and data integrity for message arrays before processing or rendering.

### Basic Usage

```typescript
import { validateUIMessages } from 'ai';

const messages = [
  {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'Hello!' }],
  },
];

const validatedMessages = await validateUIMessages({ messages });
```

### Advanced Usage with Custom Schemas

```typescript
import { validateUIMessages, tool } from 'ai';
import { z } from 'zod';

const metadataSchema = z.object({
  timestamp: z.string().datetime(),
  userId: z.string(),
});

const dataSchemas = {
  chart: z.object({
    data: z.array(z.number()),
    labels: z.array(z.string()),
  }),
  image: z.object({
    url: z.string().url(),
    caption: z.string(),
  }),
};

const tools = {
  weather: tool({
    description: 'Get weather info',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => `Weather in ${location}: sunny`,
  }),
};

const messages = [
  {
    id: '1',
    role: 'user',
    metadata: { timestamp: '2024-01-01T00:00:00Z', userId: 'user123' },
    parts: [
      { type: 'text', text: 'Show me a chart' },
      { type: 'data-chart', data: { data: [1, 2, 3], labels: ['A', 'B', 'C'] } },
    ],
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'tool-weather',
        toolCallId: 'call_123',
        state: 'output-available',
        input: { location: 'San Francisco' },
        output: 'Weather in San Francisco: sunny',
      },
    ],
  },
];

const validatedMessages = await validateUIMessages({
  messages,
  metadataSchema,
  dataSchemas,
  tools,
});
```

Accepts optional `metadataSchema`, `dataSchemas`, and `tools` parameters to validate corresponding message properties against Zod schemas.

### safevalidateuimessages
Safe wrapper around message validation returning result object with success flag, validated data, or error instead of throwing.

## safeValidateUIMessages

Async function that validates UI messages, returning `{success: boolean, data?: ValidatedMessages, error?: Error}` instead of throwing errors.

### Basic Usage
```typescript
import { safeValidateUIMessages } from 'ai';

const messages = [
  {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'Hello!' }],
  },
];

const result = await safeValidateUIMessages({ messages });

if (!result.success) {
  console.error(result.error.message);
} else {
  const validatedMessages = result.data;
}
```

### Advanced Usage with Custom Schemas
Supports validation of:
- **Metadata**: Custom schema applied to message metadata
- **Data parts**: Custom schemas for typed data parts (e.g., `data-chart`, `data-image`)
- **Tools**: Tool definitions with parameters and execution

```typescript
import { safeValidateUIMessages, tool } from 'ai';
import { z } from 'zod';

const metadataSchema = z.object({
  timestamp: z.string().datetime(),
  userId: z.string(),
});

const dataSchemas = {
  chart: z.object({
    data: z.array(z.number()),
    labels: z.array(z.string()),
  }),
  image: z.object({
    url: z.string().url(),
    caption: z.string(),
  }),
};

const tools = {
  weather: tool({
    description: 'Get weather info',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => `Weather in ${location}: sunny`,
  }),
};

const messages = [
  {
    id: '1',
    role: 'user',
    metadata: { timestamp: '2024-01-01T00:00:00Z', userId: 'user123' },
    parts: [
      { type: 'text', text: 'Show me a chart' },
      { type: 'data-chart', data: { data: [1, 2, 3], labels: ['A', 'B', 'C'] } },
    ],
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'tool-weather',
        toolCallId: 'call_123',
        state: 'output-available',
        input: { location: 'San Francisco' },
        output: 'Weather in San Francisco: sunny',
      },
    ],
  },
];

const result = await safeValidateUIMessages({
  messages,
  metadataSchema,
  dataSchemas,
  tools,
});
```

### provider_registry
Central registry for managing multiple AI providers and models with `providerId:modelId` access pattern; supports custom separators and provides methods for language, embedding, and image models.

## Overview
`createProviderRegistry()` creates a centralized registry for managing multiple AI providers and models, allowing access via simple string identifiers in the format `providerId:modelId`.

## Setup
Create a registry by passing an object with provider instances:

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createProviderRegistry } from 'ai';

export const registry = createProviderRegistry({
  anthropic,
  openai: createOpenAI({ apiKey: process.env.OPENAI_API_KEY }),
});
```

## Custom Separator
By default uses `:` as separator. Customize with the `separator` option:

```ts
const registry = createProviderRegistry(
  { anthropic, openai },
  { separator: ' > ' },
);
const model = registry.languageModel('anthropic > claude-3-opus-20240229');
```

## Accessing Models
The registry provides three methods to access different model types:

**Language models:**
```ts
const { text } = await generateText({
  model: registry.languageModel('openai:gpt-4.1'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Text embedding models:**
```ts
const { embedding } = await embed({
  model: registry.embeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

**Image models:**
```ts
const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset over a calm ocean',
});
```

## API
**Parameters:**
- `providers` (Record<string, Provider>): Object mapping provider IDs to provider instances. Each provider has `languageModel()`, `embeddingModel()`, and `imageModel()` methods.
- `options` (object, optional): Configuration object with `separator` (string, defaults to ":") to customize the provider:model delimiter.

**Returns:** Provider instance with methods:
- `languageModel(id: string) => LanguageModel`
- `embeddingModel(id: string) => EmbeddingModel<string>`
- `imageModel(id: string) => ImageModel`

### customprovider
customProvider() maps model IDs to custom LanguageModel/EmbeddingModel/ImageModel instances with optional fallback provider; returns Provider with languageModel(id), embeddingModel(id), imageModel(id) methods.

## customProvider()

Maps model IDs to any model, enabling custom model configurations, aliases, and wrapping existing providers with additional functionality.

### Parameters

- `languageModels` (optional): Record mapping model IDs to LanguageModel instances
- `embeddingModels` (optional): Record mapping model IDs to EmbeddingModel<string> instances
- `imageModels` (optional): Record mapping model IDs to ImageModel instances
- `fallbackProvider` (optional): Provider to use when a requested model is not found

### Returns

A Provider instance with methods:
- `languageModel(id: string) => LanguageModel`
- `embeddingModel(id: string) => EmbeddingModel<string>`
- `imageModel(id: string) => ImageModel`

### Example

```ts
import { openai } from '@ai-sdk/openai';
import { customProvider } from 'ai';

export const myOpenAI = customProvider({
  languageModels: {
    'gpt-4': wrapLanguageModel({
      model: openai('gpt-4'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
    'gpt-4o-reasoning-high': wrapLanguageModel({
      model: openai('gpt-4o'),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: 'high',
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: openai,
});
```

This example creates a custom provider that wraps OpenAI models with custom settings (e.g., reasoning effort) and provides aliases for easier access.

### cosinesimilarity
cosineSimilarity(vector1, vector2) → number [-1, 1]: compares embedding similarity

## cosineSimilarity()

Calculates the cosine similarity between two vectors. Returns a number between -1 and 1, where values close to 1 indicate very similar vectors and values close to -1 indicate different vectors.

### Usage

```ts
import { cosineSimilarity, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(`cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`);
```

### API

**Parameters:**
- `vector1` (number[]): The first vector to compare
- `vector2` (number[]): The second vector to compare

**Returns:** number between -1 and 1 representing cosine similarity

**Import:** `import { cosineSimilarity } from "ai"`

### wraplanguagemodel
wrapLanguageModel() applies middleware to LanguageModelV3 instances; accepts model, middleware (single/array), optional modelId/providerId overrides.

## wrapLanguageModel()

Wraps a language model with middleware to enhance its behavior.

### Usage

```ts
import { wrapLanguageModel } from 'ai';

const wrappedLanguageModel = wrapLanguageModel({
  model: 'openai/gpt-4.1',
  middleware: yourLanguageModelMiddleware,
});
```

### Parameters

- **model** (LanguageModelV3): The original language model instance to wrap.
- **middleware** (LanguageModelV3Middleware | LanguageModelV3Middleware[]): Middleware to apply. Multiple middlewares are chained with the first transforming input first and the last wrapping directly around the model.
- **modelId** (string, optional): Custom model ID to override the original.
- **providerId** (string, optional): Custom provider ID to override the original.

### Returns

A new LanguageModelV3 instance with middleware applied.

### languagemodelv3middleware
Experimental middleware interface with transformParams, wrapGenerate, and wrapStream hooks for intercepting and modifying language model calls.

## LanguageModelV3Middleware

Experimental middleware system for intercepting and modifying language model calls in a model-agnostic way.

### Purpose
Enables enhancement of language model behavior through middleware patterns. Common use cases include guardrails, RAG (Retrieval-Augmented Generation), caching, and logging.

### API

**transformParams**
- Type: `({ type: "generate" | "stream", params: LanguageModelV3CallOptions }) => Promise<LanguageModelV3CallOptions>`
- Transforms parameters before passing to the language model

**wrapGenerate**
- Type: `({ doGenerate: DoGenerateFunction, params: LanguageModelV3CallOptions, model: LanguageModelV3 }) => Promise<DoGenerateResult>`
- Wraps the generate operation of the language model

**wrapStream**
- Type: `({ doStream: DoStreamFunction, params: LanguageModelV3CallOptions, model: LanguageModelV3 }) => Promise<DoStreamResult>`
- Wraps the stream operation of the language model

### Import
```javascript
import { LanguageModelV3Middleware } from "ai"
```

**Note:** This is an experimental feature.

### extract-reasoning-middleware
Middleware extracting XML-tagged reasoning from generated text; params: tagName (required), separator (default "\n"), startWithReasoning (default false); returns middleware processing streaming/non-streaming, exposing reasoning separately.

## extractReasoningMiddleware

Middleware function that extracts XML-tagged reasoning sections from generated text, separating the AI model's reasoning process from its final output.

### Usage

```ts
import { extractReasoningMiddleware } from 'ai';

const middleware = extractReasoningMiddleware({
  tagName: 'reasoning',
  separator: '\n',
});
```

### Parameters

- `tagName` (string, required): The name of the XML tag to extract reasoning from (without angle brackets)
- `separator` (string, optional): The separator to use between reasoning and text sections. Defaults to `"\n"`
- `startWithReasoning` (boolean, optional): Starts with reasoning tokens. Set to true when the response always starts with reasoning and the initial tag is omitted. Defaults to false

### Returns

A middleware object that:
- Processes both streaming and non-streaming responses
- Extracts content between specified XML tags as reasoning
- Removes the XML tags and reasoning from the main text
- Adds a `reasoning` property to the result containing the extracted content
- Maintains proper separation between text sections using the specified separator

Works with the `LanguageModelV3StreamPart` type for streaming responses.

### simulate-streaming-middleware
Middleware that converts non-streaming model responses into simulated streams, preserving text, reasoning, tool calls, and metadata.

## simulateStreamingMiddleware

Middleware that converts non-streaming language model responses into simulated streams, maintaining a consistent streaming interface regardless of model capabilities.

### Purpose
Allows you to use a uniform streaming interface even when working with models that only provide complete responses rather than streaming chunks.

### How It Works
1. Awaits the complete response from the language model
2. Creates a `ReadableStream` that emits chunks in the correct sequence
3. Breaks down the response into appropriate chunk types
4. Preserves all metadata, reasoning, tool calls, and other response properties

### Usage
```ts
import { streamText, wrapLanguageModel, simulateStreamingMiddleware } from 'ai';

const result = streamText({
  model: wrapLanguageModel({
    model: nonStreamingModel,
    middleware: simulateStreamingMiddleware(),
  }),
  prompt: 'Your prompt here',
});

for await (const chunk of result.fullStream) {
  // Process streaming chunks
}
```

### API
- **Parameters**: None
- **Returns**: Middleware object that handles response conversion and streaming simulation
- **Handles**: Text content, reasoning (string or array of objects), tool calls, metadata, usage information, and warnings

### defaultsettingsmiddleware
Middleware applying default language model settings (temperature, tokens, provider options) that can be overridden per-call; used with wrapLanguageModel().

## defaultSettingsMiddleware

Middleware function that applies default settings to language model calls, enabling consistent default parameters across multiple invocations.

### Import
```ts
import { defaultSettingsMiddleware } from 'ai';
```

### API

**Parameters:**
- `settings`: Object containing default parameter values (any valid `LanguageModelV3CallOptions` properties and optional provider metadata)

**Returns:** Middleware object that merges defaults with call parameters, with explicit parameters taking precedence over defaults, and provider metadata objects merged.

### Examples

Basic usage with default settings:
```ts
const middleware = defaultSettingsMiddleware({
  settings: {
    temperature: 0.7,
    maxOutputTokens: 1000,
  },
});
```

With model wrapping and provider options:
```ts
import { streamText, wrapLanguageModel, defaultSettingsMiddleware } from 'ai';

const modelWithDefaults = wrapLanguageModel({
  model: gateway('anthropic/claude-sonnet-4.5'),
  middleware: defaultSettingsMiddleware({
    settings: {
      providerOptions: {
        openai: {
          reasoningEffort: 'high',
        },
      },
    },
  }),
});

const result = await streamText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
  temperature: 0.8, // overrides default
});
```

### How It Works

1. Takes default settings as configuration
2. Merges defaults with parameters in each model call
3. Ensures explicitly provided parameters take precedence
4. Merges provider metadata objects from both sources

### stepcountis
stepCountIs(count) creates a StopCondition for tool-calling loops; stops after specified step count; combinable with other conditions via array.

## stepCountIs()

Creates a stop condition that halts a tool-calling loop when the number of steps reaches a specified count.

Used with the `stopWhen` parameter in `generateText()` and `streamText()`.

### API

**Parameters:**
- `count` (number): Maximum number of steps to execute before stopping

**Returns:** A `StopCondition` function that returns `true` when step count is reached

### Examples

Stop after 3 steps:
```ts
import { generateText, stepCountIs } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: stepCountIs(3),
});
```

Combine multiple stop conditions:
```ts
import { generateText, stepCountIs, hasToolCall } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: [stepCountIs(10), hasToolCall('finalAnswer')],
});
```

Related: `hasToolCall()`, `generateText()`, `streamText()`

### hastoolcall
Stop condition that triggers when a named tool is called; used with generateText/streamText stopWhen parameter for controlling agent loops.

## hasToolCall()

Creates a stop condition that halts tool-calling loops when a specific tool is invoked.

Used with the `stopWhen` parameter in `generateText()` and `streamText()` to control agent behavior.

### Parameters
- `toolName` (string): Name of the tool that triggers the stop condition

### Returns
A `StopCondition` function that returns `true` when the specified tool is called in the current step.

### Examples

Basic usage - stop when a tool is called:
```ts
import { generateText, hasToolCall } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: {
    submitAnswer: submitAnswerTool,
    search: searchTool,
  },
  stopWhen: hasToolCall('submitAnswer'),
});
```

Combining multiple stop conditions:
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    weather: weatherTool,
    search: searchTool,
    finalAnswer: finalAnswerTool,
  },
  stopWhen: [
    hasToolCall('weather'),
    hasToolCall('finalAnswer'),
    stepCountIs(5),
  ],
});
```

Agent pattern - run until final answer:
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    search: searchTool,
    calculate: calculateTool,
    finalAnswer: {
      description: 'Provide the final answer to the user',
      parameters: z.object({ answer: z.string() }),
      execute: async ({ answer }) => answer,
    },
  },
  stopWhen: hasToolCall('finalAnswer'),
});
```

### simulatereadablestream
Utility to create a ReadableStream emitting array values with configurable initial and inter-chunk delays for testing/simulating streamed data.

## simulateReadableStream()

Creates a ReadableStream that emits provided values sequentially with configurable delays. Useful for testing streaming functionality or simulating time-delayed data streams.

### Parameters

- `chunks` (T[]): Array of values to be emitted by the stream
- `initialDelayInMs` (number | null, optional): Initial delay in milliseconds before emitting the first value. Defaults to 0. Set to null to skip.
- `chunkDelayInMs` (number | null, optional): Delay in milliseconds between emitting each value. Defaults to 0. Set to null to skip.

### Returns

ReadableStream<T> that emits each value from chunks sequentially, respecting the configured delays, and closes automatically after all chunks are emitted.

### Examples

```ts
import { simulateReadableStream } from 'ai';

// Basic usage
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
});

// With delays
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: 1000,
  chunkDelayInMs: 500,
});

// Without delays
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: null,
  chunkDelayInMs: null,
});
```

### smoothstream
TransformStream for smoothing text streaming with configurable delays and chunking strategies (word/line/regex/callback), with special handling for non-space-delimited languages.

## Purpose
`smoothStream` is a TransformStream utility for the `streamText` `experimental_transform` option that smooths text streaming by buffering and releasing complete words/lines with configurable delays, creating a more natural reading experience.

## Basic Usage
```ts
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream({
    delayInMs: 20,      // optional, defaults to 10ms, set to null to disable
    chunking: 'line',   // optional, defaults to 'word'
  }),
});
```

## Parameters

**delayInMs** (number | null, optional)
- Delay in milliseconds between outputting each chunk
- Defaults to 10ms
- Set to `null` to disable delays

**chunking** (optional, defaults to 'word')
- `"word"` - stream word by word
- `"line"` - stream line by line
- `RegExp` - custom regex pattern for splitting
- `(buffer: string) => string | undefined | null` - custom callback function

## Chunking Details

### Word chunking limitations
Word-based chunking doesn't work well with languages that don't delimit words with spaces (Chinese, Japanese, Vietnamese, Thai, Javanese). Use custom regex or callback instead.

### Regex examples
```ts
// Split on underscores
smoothStream({ chunking: /_+/ });
// or equivalently
smoothStream({ chunking: /[^_]*_/ });
```

### Language-specific regex
```ts
// Japanese
smoothStream({ chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/ });

// Chinese
smoothStream({ chunking: /[\u4E00-\u9FFF]|\S+\s+/ });
```

### Custom callback
```ts
smoothStream({
  chunking: text => {
    const findString = 'some string';
    const index = text.indexOf(findString);
    return index === -1 ? null : text.slice(0, index) + findString;
  },
});
```

## Returns
A TransformStream that:
- Buffers incoming text chunks
- Releases text when chunking pattern is encountered
- Adds configurable delays between chunks
- Passes through non-text chunks (like step-finish events) immediately

### generateid
generateId() produces unique ID strings (default 16 chars); size parameter deprecated

Generates a unique identifier string. Optionally accepts a `size` parameter (number) to specify the ID length, defaulting to 16 characters. This is the same ID generator used internally by the AI SDK.

```ts
import { generateId } from 'ai';

const id = generateId();
const customId = generateId(32); // custom length (deprecated parameter)
```

Returns a string representing the generated ID. The `size` parameter is deprecated and will be removed in the next major version.

### createidgenerator
Customizable ID generator with configurable prefix, separator, alphabet, and random part size; uses non-secure randomization.

## createIdGenerator()

Creates a customizable ID generator function with configurable alphabet, prefix, separator, and size.

**Import:**
```ts
import { createIdGenerator } from 'ai';
```

**Parameters (options object):**
- `alphabet` (string): Characters for random part. Defaults to alphanumeric (0-9, A-Z, a-z)
- `prefix` (string): String prepended to all IDs. Defaults to none
- `separator` (string): Character(s) between prefix and random part. Defaults to "-"
- `size` (number): Length of random part. Defaults to 16

**Returns:** Function that generates IDs based on configured options

**Examples:**
```ts
const generateCustomId = createIdGenerator({
  prefix: 'user',
  separator: '_',
});
const id = generateCustomId(); // "user_1a2b3c4d5e6f7g8h"

const generateUserId = createIdGenerator({
  prefix: 'user',
  separator: '_',
  size: 8,
});
const id1 = generateUserId(); // "user_1a2b3c4d"
```

**Notes:**
- Uses non-secure random generation, not for security-critical purposes
- Separator character must not be part of alphabet for reliable prefix checking

