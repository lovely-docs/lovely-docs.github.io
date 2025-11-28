

## Pages

### generatetext
Non-interactive text generation with tool calling, supporting multi-step agentic workflows, structured outputs, and comprehensive token/response metadata.

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

### Core Parameters

**Model & Input:**
- `model` (LanguageModel): The language model to use, e.g., `openai('gpt-4o')`
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `prompt` (string | Array of messages): Input prompt or conversation messages
- `messages` (Array): Conversation messages with support for system, user, assistant, and tool roles

**Message Content Types:**
- TextPart: `{ type: 'text', text: string }`
- ImagePart: `{ type: 'image', image: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType?: string }`
- FilePart: `{ type: 'file', data: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType: string }`
- ReasoningPart: `{ type: 'reasoning', text: string }`
- ToolCallPart: `{ type: 'tool-call', toolCallId: string, toolName: string, input: object }`
- ToolResultPart: `{ type: 'tool-result', toolCallId: string, toolName: string, output: unknown, isError?: boolean }`

**Tools:**
- `tools` (ToolSet): Tools accessible to the model with `description`, `inputSchema` (Zod or JSON Schema), and optional `execute` async function
- `toolChoice` (optional): "auto" | "none" | "required" | `{ type: "tool", toolName: string }` - controls tool selection (default: "auto")
- `activeTools` (optional): Array limiting which tools are available without changing types

**Generation Parameters:**
- `maxOutputTokens` (optional): Maximum tokens to generate
- `temperature` (optional): Controls randomness (0-1 range, provider-dependent)
- `topP` (optional): Nucleus sampling (0-1 range, provider-dependent)
- `topK` (optional): Sample from top K options per token
- `presencePenalty` (optional): Affects likelihood of repeating information in prompt
- `frequencyPenalty` (optional): Affects likelihood of repeating same words/phrases
- `stopSequences` (optional): Array of sequences that stop generation
- `seed` (optional): Integer seed for deterministic results (if supported)

**Advanced Control:**
- `maxRetries` (optional): Maximum retry attempts (default: 2, set to 0 to disable)
- `abortSignal` (optional): AbortSignal to cancel the call
- `headers` (optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (optional): Provider-specific options keyed by provider name
- `stopWhen` (optional): Condition for stopping generation with tool results (default: stepCountIs(1))
- `prepareStep` (optional): Function to modify settings per step (model, toolChoice, activeTools, system prompt, messages)
- `experimental_context` (optional): Context passed to tool execution
- `experimental_download` (optional): Custom download function for URLs in prompts
- `experimental_repairToolCall` (optional): Function to repair failed tool call parsing
- `experimental_telemetry` (optional): Telemetry configuration with isEnabled, recordInputs, recordOutputs, functionId, metadata

**Output Specification:**
- `output` (optional): Structured output specification:
  - `Output.text()`: Text generation (default)
  - `Output.object({ schema })`: Typed object generation from schema
  - `Output.array({ element })`: Array generation with element schema
  - `Output.choice({ options })`: Choice from array of strings
  - `Output.json()`: Unstructured JSON generation

**Callbacks:**
- `onStepFinish` (optional): Called when each step finishes with finishReason, usage, totalUsage, text, toolCalls, toolResults, warnings, response, isContinued, providerMetadata
- `onFinish` (optional): Called when LLM response and all tool executions complete with finishReason, usage, providerMetadata, text, reasoning, reasoningDetails, sources, files, toolCalls, toolResults, warnings, response, steps

### Return Value

- `content`: Array of content parts generated in last step
- `text`: Generated text string
- `reasoning`: Array of reasoning outputs (if available)
- `reasoningText`: Reasoning text from last step (if available)
- `sources`: Array of URL sources used (for RAG models)
- `files`: Array of generated files with base64, uint8Array, and mediaType
- `toolCalls`: Tool calls made in last step
- `toolResults`: Results of tool calls from last step
- `finishReason`: "stop" | "length" | "content-filter" | "tool-calls" | "error" | "other" | "unknown"
- `usage`: Token usage of last step (inputTokens, outputTokens, totalTokens, reasoningTokens, cachedInputTokens)
- `totalUsage`: Cumulative token usage across all steps
- `request` (optional): Raw request HTTP body metadata
- `response` (optional): Response metadata with id, modelId, timestamp, headers, body, messages
- `warnings` (optional): Provider warnings
- `providerMetadata` (optional): Provider-specific metadata
- `output` (optional): Structured output result
- `steps`: Array of StepResult objects with content, text, reasoning, files, sources, toolCalls, toolResults, finishReason, usage, warnings, request, response, providerMetadata for each step

### streamtext
Stream text from LLMs with tools, structured outputs, callbacks, and multi-step generation; returns promises and streams for text/reasoning/sources/tool-calls/results with token usage tracking.

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

### Core Parameters

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
- `toolChoice` ("auto" | "none" | "required" | { type: "tool", toolName: string }): How tools are selected (default: "auto")
- `activeTools` (Array<string>): Which tools are currently active (all by default)

**Generation Parameters:**
- `maxOutputTokens` (number): Maximum tokens to generate
- `temperature` (number): Randomness (0-1 range depends on provider)
- `topP` (number): Nucleus sampling (alternative to temperature)
- `topK` (number): Sample from top K options
- `presencePenalty` (number): Penalize repeating information from prompt
- `frequencyPenalty` (number): Penalize repeated words/phrases
- `stopSequences` (string[]): Sequences that stop generation
- `seed` (number): For deterministic results

**Advanced Options:**
- `maxRetries` (number): Retry attempts (default: 2)
- `abortSignal` (AbortSignal): Cancel the call
- `headers` (Record<string, string>): Additional HTTP headers
- `output` (Output): Specification for structured outputs (text, object, array, choice, json)
- `includeRawChunks` (boolean): Include unprocessed provider data
- `providerOptions` (Record<string, JSONObject>): Provider-specific options
- `stopWhen` (StopCondition | Array<StopCondition>): Stop generation condition with tool results
- `prepareStep` (function): Modify settings per step (model, toolChoice, activeTools, system, messages)
- `experimental_context` (unknown): Context passed to tool execution
- `experimental_download` (function): Custom URL download function
- `experimental_repairToolCall` (function): Repair failed tool call parsing
- `experimental_telemetry` (TelemetrySettings): Enable/disable telemetry, record inputs/outputs, add metadata
- `experimental_transform` (StreamTextTransform | Array<StreamTextTransform>): Stream transformations

**Callbacks:**
- `onChunk` (event: OnChunkResult): Called for each stream chunk (text, reasoning, source, tool-call, tool-result)
- `onError` (event: OnErrorResult): Called when error occurs
- `onStepFinish` (result: onStepFinishResult): Called when step finishes with stepType, finishReason, usage, text, reasoning, sources, files, toolCalls, toolResults, warnings, response, isContinued, providerMetadata
- `onFinish` (result: OnFinishResult): Called when LLM response and tool executions complete with finishReason, usage, totalUsage, text, reasoning, reasoningDetails, sources, files, toolCalls, toolResults, warnings, response, steps
- `onAbort` (event: OnAbortResult): Called when stream aborted via AbortSignal

### Return Values

**Promises (auto-consume stream):**
- `content` (Promise<Array<ContentPart>>): Generated content in last step
- `finishReason` (Promise<string>): Why generation finished
- `usage` (Promise<LanguageModelUsage>): Token usage of last step
- `totalUsage` (Promise<LanguageModelUsage>): Total token usage from all steps
- `text` (Promise<string>): Full generated text
- `reasoning` (Promise<Array<ReasoningOutput>>): Full reasoning from last step
- `reasoningText` (Promise<string | undefined>): Reasoning text from last step
- `sources` (Promise<Array<Source>>): Sources used (accumulated from all steps)
- `files` (Promise<Array<GeneratedFile>>): Generated files in final step
- `toolCalls` (Promise<TypedToolCall[]>): Executed tool calls
- `toolResults` (Promise<TypedToolResult[]>): Tool results
- `request` (Promise<LanguageModelRequestMetadata>): Request metadata
- `response` (Promise<LanguageModelResponseMetadata>): Response metadata with messages
- `warnings` (Promise<Warning[] | undefined>): Provider warnings
- `steps` (Promise<Array<StepResult>>): Info for every step

**Streams:**
- `textStream` (AsyncIterableStream<string>): Text deltas only, usable as AsyncIterable or ReadableStream
- `fullStream` (AsyncIterable<TextStreamPart> & ReadableStream<TextStreamPart>): All events including text, reasoning, source, tool-call, tool-call-streaming-start, tool-call-delta, tool-result, start-step, finish-step, start, finish, reasoning-part-finish, error, abort, raw chunks

**Structured Output:**
- `partialOutputStream` (AsyncIterableStream<PARTIAL_OUTPUT>): Stream of partial parsed outputs using output specification
- `output` (Promise<COMPLETE_OUTPUT>): Complete parsed output using output specification

**Utilities:**
- `consumeStream` (options?: ConsumeStreamOptions): Consume stream without processing
- `toUIMessageStream` (options?: UIMessageStreamOptions): Convert to UI message stream with originalMessages, onFinish callback, messageMetadata extraction, sendReasoning, sendSources, sendFinish, sendStart, onError, consumeSseStream
- `pipeUIMessageStreamToResponse` (response: ServerResponse, options?: ResponseInit & UIMessageStreamOptions): Write to Node.js response
- `toUIMessageStreamResponse` (options?: ResponseInit & UIMessageStreamOptions): Create streamed Response with UI messages
- `pipeTextStreamToResponse` (response: ServerResponse, init?: ResponseInit): Write text deltas to Node.js response with text/plain content-type
- `toTextStreamResponse` (init?: ResponseInit): Create simple text stream Response

### LanguageModelUsage
- `inputTokens` (number | undefined): Input prompt tokens
- `outputTokens` (number | undefined): Completion tokens
- `totalTokens` (number | undefined): Total as reported by provider
- `reasoningTokens` (number | undefined): Reasoning tokens
- `cachedInputTokens` (number | undefined): Cached input tokens

### TextStreamPart Types
- `{ type: 'text', text: string }`: Text delta
- `{ type: 'reasoning', text: string, providerMetadata?: ProviderMetadata }`: Reasoning delta
- `{ type: 'source', sourceType: 'url', id: string, url: string, title?: string, providerMetadata?: ProviderMetadata }`: Source reference
- `{ type: 'file', file: GeneratedFile }`: Generated file
- `{ type: 'tool-call', toolCallId: string, toolName: string, input: object }`: Tool call
- `{ type: 'tool-call-streaming-start', toolCallId: string, toolName: string }`: Tool call stream start
- `{ type: 'tool-call-delta', toolCallId: string, toolName: string, argsTextDelta: string }`: Tool call args delta
- `{ type: 'tool-result', toolCallId: string, toolName: string, input: object, output: any }`: Tool result
- `{ type: 'start-step', request: LanguageModelRequestMetadata, warnings: Warning[] }`: Step start
- `{ type: 'finish-step', response: LanguageModelResponseMetadata, usage: LanguageModelUsage, finishReason: string, providerMetadata?: ProviderMetadata }`: Step finish
- `{ type: 'start' }`: Stream start
- `{ type: 'finish', finishReason: string, totalUsage: LanguageModelUsage }`: Stream finish
- `{ type: 'reasoning-part-finish' }`: Reasoning part end
- `{ type: 'error', error: unknown }`: Error
- `{ type: 'abort' }`: Abort
- `{ type: 'raw', rawChunk: unknown }`: Raw provider chunk (when includeRawChunks enabled)

### generateobject
API for generating structured objects/arrays/enums/JSON from LLM prompts with schema validation, supporting multiple output modes, sampling controls, token limits, and provider-specific options.

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

### streamobject
Stream typed structured objects from LLMs with schema validation; supports object/array/enum/no-schema modes; returns partial streams, full event stream, and final typed object.

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

### embed
embed() generates embeddings for single values; accepts model, value, optional maxRetries/abortSignal/headers/telemetry; returns embedding vector, value, token usage, response data, and provider metadata.

## embed()

Generate an embedding for a single value using an embedding model.

### Purpose
Ideal for use cases where you need to embed a single value to retrieve similar items or use the embedding in downstream tasks.

### Basic Usage
```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';

const { embedding } = await embed({
  model: 'openai/text-embedding-3-small',
  value: 'sunny day at the beach',
});
```

### Parameters
- **model** (EmbeddingModel, required): The embedding model to use. Example: `openai.embeddingModel('text-embedding-3-small')`
- **value** (VALUE, required): The value to embed. Type depends on the model.
- **maxRetries** (number, optional): Maximum number of retries. Set to 0 to disable retries. Default: 2.
- **abortSignal** (AbortSignal, optional): Cancel the call.
- **headers** (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers.
- **experimental_telemetry** (TelemetrySettings, optional): Telemetry configuration (experimental).
  - **isEnabled** (boolean, optional): Enable/disable telemetry. Disabled by default.
  - **recordInputs** (boolean, optional): Enable/disable input recording. Enabled by default.
  - **recordOutputs** (boolean, optional): Enable/disable output recording. Enabled by default.
  - **functionId** (string, optional): Identifier to group telemetry data by function.
  - **metadata** (Record<string, string | number | boolean | Array>, optional): Additional telemetry information.
  - **tracer** (Tracer, optional): Custom tracer for telemetry data.

### Returns
- **value** (VALUE): The value that was embedded.
- **embedding** (number[]): The embedding vector of the value.
- **usage** (EmbeddingModelUsage): Token usage for generating the embeddings.
  - **tokens** (number): Number of tokens used.
- **response** (Response, optional): Optional response data.
  - **headers** (Record<string, string>, optional): Response headers.
  - **body** (unknown, optional): Response body.
- **providerMetadata** (ProviderMetadata | undefined, optional): Provider-specific metadata. Outer key is provider name, inner values depend on provider.

### embedmany
embedMany() generates embeddings for multiple values with automatic request chunking, supporting retry configuration, abort signals, custom headers, and experimental telemetry.

## embedMany()

Embed multiple values using an embedding model. The function automatically chunks large requests if the model has embedding limits.

### Basic Usage
```ts
import { openai } from '@ai-sdk/openai';
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
- **model** (EmbeddingModel): The embedding model to use, e.g., `openai.embeddingModel('text-embedding-3-small')`
- **values** (Array<VALUE>): The values to embed. Type depends on the model.
- **maxRetries** (number, optional): Maximum retry attempts. Default: 2. Set to 0 to disable.
- **abortSignal** (AbortSignal, optional): Signal to cancel the call.
- **headers** (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers.
- **experimental_telemetry** (TelemetrySettings, optional): Telemetry configuration with options:
  - **isEnabled** (boolean, optional): Enable/disable telemetry. Disabled by default.
  - **recordInputs** (boolean, optional): Record inputs. Enabled by default.
  - **recordOutputs** (boolean, optional): Record outputs. Enabled by default.
  - **functionId** (string, optional): Identifier to group telemetry by function.
  - **metadata** (Record<string, string | number | boolean | Array>, optional): Additional telemetry data.
  - **tracer** (Tracer, optional): Custom tracer for telemetry.

### Returns
- **values** (Array<VALUE>): The values that were embedded.
- **embeddings** (number[][]): The embeddings in the same order as input values.
- **usage** (EmbeddingModelUsage): Token usage information:
  - **tokens** (number): Total input tokens used.
  - **body** (unknown, optional): Response body from provider.
- **providerMetadata** (ProviderMetadata | undefined, optional): Provider-specific metadata with provider name as outer key.

### rerank
Rerank documents by semantic relevance to a query; accepts strings or objects, returns ranking with scores (0-1) and reordered documents; supports topN limiting, retries, custom headers, provider options, and telemetry.

## Purpose
Rerank documents based on relevance to a query using a reranking model. Improves search relevance by reordering documents, emails, or other content using semantic understanding.

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
- `model` (RerankingModel, required): The reranking model to use, e.g., `cohere.reranking('rerank-v3.5')`
- `documents` (Array<VALUE>, required): Documents to rerank - can be strings or JSON objects
- `query` (string, required): Search query to rank documents against
- `topN` (number, optional): Maximum number of top documents to return; if not specified, all documents are returned
- `maxRetries` (number, optional): Maximum retry attempts; default is 2, set to 0 to disable
- `abortSignal` (AbortSignal, optional): Signal to cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers
- `providerOptions` (ProviderOptions, optional): Provider-specific options
- `experimental_telemetry` (TelemetrySettings, optional): Telemetry configuration with `isEnabled`, `recordInputs`, `recordOutputs`, `functionId`, `metadata`, and `tracer` sub-options

## Return Value
- `originalDocuments` (Array<VALUE>): Original documents in original order
- `rerankedDocuments` (Array<VALUE>): Documents sorted by relevance score (descending)
- `ranking` (Array<RankingItem<VALUE>>): Array of ranking items, each containing:
  - `originalIndex` (number): Index in original documents array
  - `score` (number): Relevance score, typically 0-1 where higher is more relevant
  - `document` (VALUE): The document itself
- `response` (Response): Response metadata including `id`, `timestamp`, `modelId`, `headers`, `body`
- `providerMetadata` (ProviderMetadata | undefined): Optional provider-specific metadata

## Examples

**String documents with topN:**
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
// rerankedDocuments: ['rainy afternoon in the city', 'sunny day at the beach']
// ranking: [
//   { originalIndex: 1, score: 0.9, document: 'rainy afternoon...' },
//   { originalIndex: 0, score: 0.3, document: 'sunny day...' }
// ]
```

**Object documents:**
```ts
const documents = [
  { from: 'Paul Doe', subject: 'Follow-up', text: 'We are happy to give you a discount of 20%.' },
  { from: 'John McGill', subject: 'Missing Info', text: 'Here is the pricing from Oracle: $5000/month' },
];
const { ranking } = await rerank({
  model: cohere.reranking('rerank-v3.5'),
  documents,
  query: 'Which pricing did we get from Oracle?',
  topN: 1,
});
// ranking[0].document: { from: 'John McGill', subject: 'Missing Info', ... }
```

**With provider options:**
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
Experimental function to generate images from text prompts; accepts model, prompt, and optional n, size, aspectRatio, seed, providerOptions, maxRetries, abortSignal, headers; returns image, images array, warnings, providerMetadata, and responses with GeneratedFile objects containing base64, uint8Array, mediaType.

## generateImage()

Generates images based on a given prompt using an image model. Experimental feature.

### Usage

```ts
import { experimental_generateImage as generateImage } from 'ai';

const { images } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A futuristic cityscape at sunset',
  n: 3,
  size: '1024x1024',
});
```

### Parameters

- `model` (ImageModelV3, required): The image model to use
- `prompt` (string, required): The input prompt to generate the image from
- `n` (number, optional): Number of images to generate
- `size` (string, optional): Size of images in format `{width}x{height}`
- `aspectRatio` (string, optional): Aspect ratio in format `{width}:{height}`
- `seed` (number, optional): Seed for reproducible image generation
- `providerOptions` (ProviderOptions, optional): Additional provider-specific options
- `maxRetries` (number, optional): Maximum number of retries, default 2
- `abortSignal` (AbortSignal, optional): Signal to cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers

### Returns

- `image` (GeneratedFile): The first generated image
- `images` (Array<GeneratedFile>): All generated images
- `warnings` (Warning[]): Warnings from the model provider
- `providerMetadata` (ImageModelProviderMetadata, optional): Provider-specific metadata with an `images` key containing array matching top-level `images` length
- `responses` (Array<ImageModelResponseMetadata>): Response metadata from provider calls, each containing `timestamp`, `modelId`, and optional `headers`

### GeneratedFile Structure

- `base64` (string): Image as base64 encoded string
- `uint8Array` (Uint8Array): Image as Uint8Array
- `mediaType` (string): IANA media type of the image

### transcribe
Experimental transcribe() function converts audio files to text using transcription models, returning transcript text, segments with timing, language, duration, and provider metadata.

## Overview
`transcribe()` is an experimental function that generates a transcript from an audio file using a transcription model.

## Import
```ts
import { experimental_transcribe as transcribe } from 'ai';
```

## Basic Usage
```ts
import { openai } from '@ai-sdk/openai';
import { readFile } from 'fs/promises';

const { text: transcript } = await transcribe({
  model: openai.transcription('whisper-1'),
  audio: await readFile('audio.mp3'),
});

console.log(transcript);
```

## Parameters
- **model** (TranscriptionModelV3): The transcription model to use.
- **audio** (DataContent | URL): The audio file to transcribe. Accepts string, Uint8Array, ArrayBuffer, Buffer, or URL.
- **providerOptions** (Record<string, JSONObject>, optional): Additional provider-specific options.
- **maxRetries** (number, optional): Maximum number of retries. Default: 2.
- **abortSignal** (AbortSignal, optional): Signal to cancel the call.
- **headers** (Record<string, string>, optional): Additional HTTP headers for the request.

## Return Value
- **text** (string): The complete transcribed text from the audio input.
- **segments** (Array<{ text: string; startSecond: number; endSecond: number }>): Array of transcript segments with timing information.
- **language** (string | undefined): Language of the transcript in ISO-639-1 format (e.g., "en" for English).
- **durationInSeconds** (number | undefined): Duration of the audio in seconds.
- **warnings** (Warning[]): Warnings from the model provider.
- **responses** (Array<TranscriptionModelResponseMetadata>): Response metadata from the provider, including timestamp, modelId, and optional headers. Multiple responses may be present if multiple calls were made.

### generatespeech
Text-to-speech function supporting OpenAI and ElevenLabs with configurable voice, format, speed, language, and provider options; returns audio in multiple formats (base64, Uint8Array) with metadata.

## generateSpeech()

Generates speech audio from text using various AI providers.

**Import:**
```ts
import { experimental_generateSpeech as generateSpeech } from 'ai';
```

**Basic Usage:**
```ts
import { openai } from '@ai-sdk/openai';

const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

**Provider Examples:**

OpenAI:
```ts
const { audio } = await generateSpeech({
  model: openai.speech('tts-1'),
  text: 'Hello from the AI SDK!',
  voice: 'alloy',
});
```

ElevenLabs:
```ts
import { elevenlabs } from '@ai-sdk/elevenlabs';

const { audio } = await generateSpeech({
  model: elevenlabs.speech('eleven_multilingual_v2'),
  text: 'Hello from the AI SDK!',
  voice: 'your-voice-id',
});
```

**Parameters:**
- `model` (SpeechModelV3, required): The speech model to use
- `text` (string, required): The text to generate speech from
- `voice` (string, optional): The voice to use for speech
- `outputFormat` (string, optional): Output format (e.g. "mp3", "wav")
- `instructions` (string, optional): Instructions for speech generation
- `speed` (number, optional): Speed of speech generation
- `language` (string, optional): ISO 639-1 language code or "auto" for automatic detection
- `providerOptions` (Record<string, JSONObject>, optional): Provider-specific options
- `maxRetries` (number, optional): Maximum retries, default 2
- `abortSignal` (AbortSignal, optional): Signal to cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers

**Returns:**
- `audio` (GeneratedAudioFile): The generated audio with properties:
  - `base64` (string): Audio as base64 encoded string
  - `uint8Array` (Uint8Array): Audio as Uint8Array
  - `mimeType` (string): MIME type (e.g. "audio/mpeg")
  - `format` (string): Format (e.g. "mp3")
- `warnings` (Warning[]): Warnings from provider
- `responses` (SpeechModelResponseMetadata[]): Response metadata including timestamp, modelId, body, and headers

**Status:** Experimental feature

### agent_interface
Agent interface contract with `generate()` and `stream()` methods for AI agents supporting tools, multi-step workflows, and custom implementations; accepts prompt or messages with optional abort signal.

## Agent Interface

The `Agent` interface defines a contract for AI agents that generate or stream responses to prompts. Agents can encapsulate advanced logic like tool usage, multi-step workflows, and prompt handling for both simple and autonomous AI systems.

### Interface Definition

Agents implementing this interface integrate seamlessly with SDK APIs and utilities. Custom agent implementations and third-party chain wrappers are supported while maintaining compatibility with AI SDK features.

### Core Properties & Methods

- `version: 'agent-v1'` - Interface version for backwards compatibility
- `id: string | undefined` - Optional agent identifier
- `tools: ToolSet` - Set of tools available to the agent
- `generate(options): PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>` - Generates full non-streaming output
- `stream(options): PromiseLike<StreamTextResult<TOOLS, OUTPUT>>` - Streams output chunks or steps

### Generic Parameters

- `CALL_OPTIONS` (default: `never`) - Type for additional call options passed to the agent
- `TOOLS` (default: `{}`) - Type of the tool set available to the agent
- `OUTPUT` (default: `never`) - Type of additional output data the agent can produce

### Method Parameters

Both `generate()` and `stream()` accept `AgentCallParameters<CALL_OPTIONS>`:
- `prompt` (optional): String prompt or array of `ModelMessage` objects
- `messages` (optional): Array of `ModelMessage` objects (mutually exclusive with `prompt`)
- `options` (optional): Additional call options when `CALL_OPTIONS` is not `never`
- `abortSignal` (optional): `AbortSignal` to cancel the operation

### Custom Agent Implementation Example

```ts
import { Agent, GenerateTextResult, StreamTextResult } from 'ai';
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

All SDK utilities accepting agents (like `createAgentUIStream`, `createAgentUIStreamResponse`, `pipeAgentUIStreamToResponse`) expect objects adhering to the `Agent` interface. Use the official `ToolLoopAgent` for multi-step AI workflows with tool use, or supply custom implementations:

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

- Agents should define their `tools` property even if empty (`{}`) for SDK compatibility
- Only one of `prompt` or `messages` can be provided at a time
- The `CALL_OPTIONS` generic parameter enables agents to accept additional call-specific options
- The `abortSignal` parameter enables operation cancellation
- Design supports both complex autonomous agents and simple LLM wrappers

### toolloopagent
Multi-step autonomous AI agent with tool calling loop, generate/stream methods, structured output parsing, and type-safe UI message inference.

## ToolLoopAgent

A reusable AI agent class that creates autonomous, multi-step agents capable of generating text, streaming responses, and using tools iteratively until a stop condition is reached. Unlike single-step calls like `generateText()`, agents can invoke tools, collect results, and decide next actions in a reasoning-and-acting loop.

### Constructor Parameters

**Required:**
- `model` (LanguageModel): The language model instance to use

**Optional:**
- `instructions` (string | SystemModelMessage): System prompt/context for the agent
- `tools` (Record<string, Tool>): Set of tools the agent can call (requires model support for tool calling)
- `toolChoice` (ToolChoice): Tool selection strategy - 'auto' | 'none' | 'required' | { type: 'tool', toolName: string }. Default: 'auto'
- `stopWhen` (StopCondition | StopCondition[]): Condition(s) for ending the loop. Default: stepCountIs(20)
- `activeTools` (Array<string>): Limits available tools for a specific call
- `output` (Output): Structured output specification for type-safe response parsing
- `prepareStep` (PrepareStepFunction): Function to mutate step settings or inject state per step
- `experimental_repairToolCall` (ToolCallRepairFunction): Callback for automatic recovery from unparseable tool calls
- `onStepFinish` (GenerateTextOnStepFinishCallback): Callback after each agent step completes
- `experimental_context` (unknown): Custom context object passed to each tool call
- `experimental_telemetry` (TelemetrySettings): Telemetry configuration
- `experimental_download` (DownloadFunction): Custom download function for files/URLs
- `maxOutputTokens` (number): Maximum tokens the model can generate
- `temperature` (number): Sampling temperature for randomness
- `topP` (number): Top-p (nucleus) sampling parameter
- `topK` (number): Top-k sampling parameter
- `presencePenalty` (number): Presence penalty parameter
- `frequencyPenalty` (number): Frequency penalty parameter
- `stopSequences` (string[]): Custom token sequences that stop output
- `seed` (number): Seed for deterministic generation
- `maxRetries` (number): Retry attempts on failure. Default: 2
- `abortSignal` (AbortSignal): Signal to cancel the request
- `providerOptions` (ProviderOptions): Provider-specific configuration
- `id` (string): Custom agent identifier

### Methods

**`generate()`**: Generates a response and triggers tool calls as needed, running the agent loop until completion. Returns a GenerateTextResult.
- Parameters: `prompt` (string | Array<ModelMessage>) or `messages` (Array<ModelMessage>), optional `abortSignal`
- Example:
```ts
const agent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool, calculator: calculatorTool },
  stopWhen: stepCountIs(3),
});
const result = await agent.generate({
  prompt: 'What is the weather in NYC and what is 100 * 25?',
});
console.log(result.text);
console.log(result.steps); // Array of all steps taken
```

**`stream()`**: Streams a response from the agent including reasoning and tool calls as they occur. Returns a StreamTextResult.
- Parameters: `prompt` (string | Array<ModelMessage>) or `messages` (Array<ModelMessage>), optional `abortSignal`, optional `experimental_transform`
- Example:
```ts
const stream = agent.stream({
  prompt: 'Tell me a short story about a time traveler.',
});
for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

### Types

**`InferAgentUIMessage<AgentType, MetadataType?>`**: Infers the UI message type for a given agent instance for type-safe UI and message exchanges. Optionally accepts a second type argument for custom message metadata.

Example with metadata:
```ts
import { z } from 'zod';
const metadataSchema = z.object({
  createdAt: z.number().optional(),
  model: z.string().optional(),
  totalTokens: z.number().optional(),
  finishReason: z.string().optional(),
});
type AgentUIMessage = InferAgentUIMessage<typeof agent, z.infer<typeof metadataSchema>>;
```

### Additional Examples

**Agent with Output Parsing**:
```ts
import { z } from 'zod';
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

### createagentuistream
Async iterable function that streams agent UI messages incrementally; validates messages, converts to model format, invokes agent.stream(), yields UIMessageChunks; supports AbortSignal cancellation.

## createAgentUIStream

Runs an Agent and returns a streaming UI message stream as an async iterable, enabling incremental consumption of agent reasoning and UI messages in servers, edge functions, or background jobs.

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
```

### Parameters
- `agent` (Agent, required): The agent instance to run. Must define its tools and implement `.stream({ prompt })`.
- `messages` (unknown[], required): Array of input UI messages sent to the agent (e.g., from user/assistant).
- `abortSignal` (AbortSignal, optional): Optional abort signal to cancel the agent streaming, e.g., in response to client disconnection.
- `...options` (UIMessageStreamOptions, optional): Additional options for customizing UI message streaming, such as source inclusion or error formatting.

### Returns
A `Promise<AsyncIterableStream<UIMessageChunk>>`, where each yielded value is a UI message chunk representing incremental agent UI output. This stream can be piped to HTTP responses, processed for dashboards, or logged.

### Example
```ts
import { createAgentUIStream } from 'ai';

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

// Call controller.abort() to stop streaming early if needed.
```

### How It Works
1. **Message Validation:** The incoming array of messages is validated and normalized according to the agent's tools and requirements. Invalid messages will cause an error.
2. **Model Message Conversion:** The validated UI messages are converted into the model message format the agent expects.
3. **Agent Streaming:** The agent's `.stream({ prompt, abortSignal })` method is invoked to produce a low-level result stream. If an abortSignal is provided and triggered, streaming will be canceled promptly.
4. **UI Message Stream:** That result stream is exposed as a streaming async iterable of UI message chunks.

### Notes
- The agent must define its tools and a `.stream({ prompt })` method.
- This utility returns an async iterator for full streaming flexibility. For HTTP responses, use createAgentUIStreamResponse or pipeAgentUIStreamToResponse.
- You can provide UI message stream options for fine-grained control over the output.
- To cancel a streaming agent operation, supply an AbortSignal via the abortSignal option.

### createagentuistreamresponse
Streams Agent output as UI messages in HTTP Response for real-time API endpoints; validates/converts messages, calls agent.stream(), returns Promise<Response> with Readable Stream; server-side only, requires agent with tools and .stream() implementation.

## Purpose
Executes an Agent and streams its output as a UI message stream in an HTTP Response body, designed for building API endpoints that deliver real-time streaming results from agents in chat or tool-use applications.

## Import
```ts
import { createAgentUIStreamResponse } from "ai"
```

## Parameters
- `agent` (required): Agent instance that implements `.stream({ prompt })` and defines tools
- `messages` (required): Array of input UI messages (typically user and assistant message objects)
- `abortSignal` (optional): AbortSignal for cancellation support when client disconnects
- `...options` (optional): Additional UIMessageStreamOptions like `sendSources`, `includeUsage`, `experimental_transform`

## Returns
`Promise<Response>` with a stream of UI messages from the agent, suitable as HTTP response in server-side API routes.

## Usage Example
```ts
import { ToolLoopAgent, createAgentUIStreamResponse } from 'ai';

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
1. **Message Validation**: Incoming messages are validated and normalized according to agent's tools and requirements
2. **Conversion**: Validated messages are transformed to internal model message format
3. **Streaming**: Agent's `.stream({ prompt })` method is called, producing stream of UI message chunks
4. **HTTP Response**: Stream is returned as streaming Response object for consumption by clients

## Important Notes
- Agent must define its `tools` and implement `.stream({ prompt })`
- Server-side only; do not use in browser
- Returned Response uses Readable Streams; ensure client/framework can consume streamed HTTP responses
- Supports cancellation via abortSignal for long-running requests

### pipeagentuistreamtoresponse
Streams Agent UI messages directly to Node.js ServerResponse for low-latency real-time endpoints; supports abort signals for cancellation; Node.js-only (not Edge/serverless).

## pipeAgentUIStreamToResponse

Executes an Agent and streams its output as a UI message stream directly to a Node.js `ServerResponse` object. Designed for building API endpoints in Node.js servers (Express, Hono, custom servers) that need low-latency, real-time UI message streaming from agents for chat or tool-use applications.

### Import
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
```

### Usage
```ts
import { pipeAgentUIStreamToResponse } from 'ai';
import { MyCustomAgent } from './agent';

export async function handler(req, res) {
  const { messages } = JSON.parse(req.body);
  const abortController = new AbortController();

  await pipeAgentUIStreamToResponse({
    response: res,
    agent: MyCustomAgent,
    messages,
    abortSignal: abortController.signal,
  });
}
```

### Parameters
- **response** (ServerResponse, required): The Node.js ServerResponse object to which the UI message stream will be piped.
- **agent** (Agent, required): The agent instance to use for streaming responses. Must implement `.stream({ prompt })` and define tools.
- **messages** (unknown[], required): Array of input UI messages sent to the agent (typically user and assistant message objects).
- **abortSignal** (AbortSignal, optional): Abort signal to cancel streaming when client disconnects or timeout occurs. Provide an instance from `AbortController`.
- **...options** (UIMessageStreamResponseInit & UIMessageStreamOptions, optional): Options for response headers, status, and additional streaming configuration.

### Returns
`Promise<void>` - resolves when piping the UI message stream to the ServerResponse is complete.

### Example: Hono/Express Route Handler
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
  });
});
```

### How It Works
1. Creates a UI message stream from the agent and pipes it to the provided Node.js `ServerResponse`, setting appropriate HTTP headers (content type, streaming-friendly headers) and status.
2. If `abortSignal` is provided, you can cancel the streaming response early (e.g., on client disconnect or timeout), improving resource usage and responsiveness.
3. Unlike serverless `Response`-returning APIs, this function does not return a Response object. It writes streaming bytes directly to the Node.js response, which is more memory- and latency-efficient for Node.js server frameworks.

### Notes
- **abortSignal for Cancellation**: Use `abortSignal` to stop agent and stream processing early. In Express or Hono, tie this to server disconnect or timeout events when possible.
- **Only for Node.js**: Intended for Node.js environments with access to `ServerResponse` objects, not for Edge/serverless/server-side frameworks using web `Response` objects.
- **Streaming Support**: Ensure client and reverse proxy/server infrastructure support streaming HTTP responses.
- Supports Hono (`@hono/node-server`), Express, and similar Node.js frameworks.

### Related
- `createAgentUIStreamResponse` - alternative for creating agent UI stream responses
- `Agent` - agent interface
- `UIMessageStreamOptions` - streaming configuration options
- `UIMessage` - message type

### tool
Helper function enabling TypeScript type inference for tool definitions by connecting inputSchema to execute method; supports regular and provider-defined tools with optional streaming callbacks and output transformation.

The `tool()` function is a TypeScript helper for defining tools with proper type inference. It enables the language model to understand and execute tool calls with correctly typed inputs and outputs.

**Purpose**: Connects the `inputSchema` property to the `execute` method so TypeScript can infer argument types. Without it, TypeScript cannot connect these properties and type inference fails.

**Basic Usage**:
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

**Parameters**:
- `description` (optional, string): Information about the tool's purpose, how and when it can be used by the model
- `inputSchema` (required, Zod Schema | JSON Schema): Schema of expected input; used by the language model to generate input and validate output. Use descriptions to make input understandable to the model
- `execute` (optional, async function): Called with tool call arguments and produces a result or async iterable of results. If iterable provided, all results except last are preliminary. If not provided, tool won't execute automatically. Receives `ToolCallOptions` with `toolCallId`, `messages`, optional `abortSignal`, and optional `experimental_context`
- `outputSchema` (optional, Zod Schema | JSON Schema): Schema of tool output; used for validation and type inference
- `toModelOutput` (optional, function): Converts tool result to output usable by language model; if not provided, result sent as JSON
- `onInputStart` (optional, function): Called when argument streaming starts (streaming context only)
- `onInputDelta` (optional, function): Called when argument streaming delta available (streaming context only)
- `onInputAvailable` (optional, function): Called when tool call can start, even without execute function
- `providerOptions` (optional, ProviderOptions): Provider-specific metadata passed through to enable provider-specific functionality
- `type` (optional, 'function' | 'provider-defined'): Tool type; defaults to "function" for regular tools, use "provider-defined" for provider-specific tools
- `id` (optional, string): Tool ID for provider-defined tools; format `<provider-name>.<unique-tool-name>`; required when type is "provider-defined"
- `name` (optional, string): Tool name for provider-defined tools; required when type is "provider-defined"
- `args` (optional, Record<string, unknown>): Arguments for configuring provider-defined tools; must match provider expectations; required when type is "provider-defined"

**Returns**: The tool object that was passed in.

### dynamictool
dynamicTool() creates tools with runtime-determined unknown input/output types for MCP, user-defined, or external tools; requires inputSchema for validation, execute function with runtime type casting, optional toModelOutput converter; returns Tool<unknown, unknown> with type: 'dynamic'; use dynamic flag for type narrowing with mixed static/dynamic tools.

## dynamicTool()

Creates tools where input and output types are unknown at compile time. Useful for MCP tools without schemas, user-defined functions loaded at runtime, tools from external sources/databases, and dynamic tool generation based on user input.

Unlike the regular `tool` function, `dynamicTool` accepts and returns `unknown` types, enabling work with runtime-determined schemas.

### Import
```ts
import { dynamicTool } from 'ai';
```

### Parameters

The tool definition object accepts:

- **description** (optional, string): Information about the tool's purpose, how and when it can be used by the model
- **inputSchema** (FlexibleSchema<unknown>): Schema of expected input. While typed as unknown, a schema is still required for validation. Use Zod schemas with `z.unknown()` or `z.any()` for fully dynamic inputs
- **execute** (ToolExecuteFunction<unknown, unknown>): Async function called with tool call arguments. Input is typed as unknown and must be validated/cast at runtime. Receives ToolCallOptions with `toolCallId` (string), `messages` (ModelMessage[]), and optional `abortSignal` (AbortSignal)
- **toModelOutput** (optional, function): Converts tool result to output usable by the language model
- **providerOptions** (optional, ProviderOptions): Additional provider-specific metadata

### Returns

A `Tool<unknown, unknown>` with `type: 'dynamic'` that works with `generateText`, `streamText`, and other AI SDK functions.

### Example

```ts
import { dynamicTool } from 'ai';
import { z } from 'zod';

export const customTool = dynamicTool({
  description: 'Execute a custom user-defined function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return {
      result: `Executed ${action} with ${JSON.stringify(parameters)}`,
    };
  },
});
```

### Type-Safe Usage with Mixed Tools

When combining dynamic and static tools, check the `dynamic` flag for type narrowing:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: weatherTool,
    custom: dynamicTool({ /* ... */ }),
  },
  onStepFinish: ({ toolCalls, toolResults }) => {
    for (const toolCall of toolCalls) {
      if (toolCall.dynamic) {
        console.log('Dynamic tool:', toolCall.toolName);
        console.log('Input:', toolCall.input); // unknown type
        continue;
      }
      switch (toolCall.toolName) {
        case 'weather':
          console.log(toolCall.input.location); // TypeScript knows exact types
          break;
      }
    }
  },
});
```

### Usage with useChat

Dynamic tools appear as `dynamic-tool` parts in UIMessage format:

```tsx
{
  message.parts.map(part => {
    switch (part.type) {
      case 'dynamic-tool':
        return (
          <div>
            <h4>Tool: {part.toolName}</h4>
            <pre>{JSON.stringify(part.input, null, 2)}</pre>
          </div>
        );
    }
  });
}
```

### experimental_createmcpclient
Creates MCP client with tool/resource/prompt access; configure transport (stdio/SSE/HTTP), call tools()/listResources()/readResource()/listPrompts()/getPrompt()/onElicitationRequest(), close() when done; throws MCPClientError on init/protocol/capability/connection failures.

## experimental_createMCPClient()

Creates a lightweight Model Context Protocol (MCP) client for connecting to MCP servers. The client automatically converts between MCP and AI SDK tools, and provides access to server resources, prompts, and elicitation handling.

### Features
- **Tools**: Automatic conversion between MCP tools and AI SDK tools
- **Resources**: List, read, and discover resource templates from MCP servers
- **Prompts**: List available prompts and retrieve prompt messages
- **Elicitation**: Handle server requests for additional input during tool execution

Does not currently support notifications from MCP servers or custom client configuration. This is an experimental API that may change or be removed.

### Configuration

Import from `@ai-sdk/mcp`:
```typescript
import { experimental_createMCPClient } from "@ai-sdk/mcp";
```

The `MCPClientConfig` requires:
- **transport**: Message transport layer configuration
  - `MCPTransport`: Custom transport with `start()`, `send(message)`, `close()`, `onclose()`, `onerror()`, `onmessage()` methods
  - `MCPTransportConfig`: Built-in transports with `type` ('sse' or 'http'), `url`, optional `headers`, optional `authProvider` (OAuth)
- **name** (optional): Client name, defaults to "ai-sdk-mcp-client"
- **onUncaughtError** (optional): Handler for uncaught errors
- **capabilities** (optional): Client capabilities like `{ elicitation: {} }` to enable elicitation request handling

### Methods

**tools(options?)**: Returns available tools from the MCP server
- `options.schemas` (optional): Schema definitions for compile-time type checking; inferred from server if not provided

**listResources(options?)**: Lists all available resources
- `options.params` (optional): Pagination parameters including cursor
- `options.options` (optional): Request options (signal, timeout)

**readResource(args)**: Reads a specific resource by URI
- `args.uri`: Resource URI
- `args.options` (optional): Request options

**listResourceTemplates(options?)**: Lists available resource templates
- `options.options` (optional): Request options

**listPrompts(options?)**: Lists available prompts
- `options.params` (optional): Pagination parameters
- `options.options` (optional): Request options

**getPrompt(args)**: Retrieves a prompt by name
- `args.name`: Prompt name
- `args.arguments` (optional): Arguments to fill into the prompt
- `args.options` (optional): Request options

**onElicitationRequest(schema, handler)**: Registers handler for elicitation requests
- `schema`: Must be `ElicitationRequestSchema`
- `handler`: Function receiving `ElicitationRequest`, returns object with `action` ("accept", "decline", or "cancel") and optional `content`

**close()**: Closes connection and cleans up resources

### Example

```typescript
import {
  experimental_createMCPClient as createMCPClient,
  generateText,
} from '@ai-sdk/mcp';
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
  if (client) {
    await client.close();
  }
}
```

### Error Handling

Throws `MCPClientError` for:
- Client initialization failures
- Protocol version mismatches
- Missing server capabilities
- Connection failures

Tool execution errors are propagated as `CallToolError`. Unknown errors can be handled via the `onUncaughtError` callback.

### experimental_stdiomcptransport
Experimental stdio-based MCP transport for Node.js; configure with command, optional args, env vars, stderr stream, and working directory.

## Experimental_StdioMCPTransport

Creates a transport for Model Context Protocol (MCP) clients to communicate with MCP servers using standard input and output streams. This transport is only supported in Node.js environments.

### Import
```
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio"
```

### Configuration

The transport accepts a `StdioConfig` object with the following properties:

- `command` (string, required): The command to run the MCP server
- `args` (string[], optional): Arguments to pass to the MCP server
- `env` (Record<string, string>, optional): Environment variables to set for the MCP server
- `stderr` (IOType | Stream | number, optional): The stream to write the MCP server's stderr to
- `cwd` (string, optional): The current working directory for the MCP server

### Notes

This feature is experimental and may change or be removed in the future.

### jsonschema
Helper function creating typed JSON schema objects for structured data generation and tools; accepts JSONSchema7 definition and optional custom validation function.

## Purpose
`jsonSchema()` is a helper function that creates JSON schema objects compatible with the AI SDK. It serves as an alternative to Zod schemas, providing flexibility for dynamic situations like OpenAPI definitions or when using other validation libraries.

## Usage
Use `jsonSchema()` to generate structured data and in tool definitions.

## API

### Parameters
- `schema` (JSONSchema7): The JSON schema definition
- `options` (SchemaOptions, optional):
  - `validate` (optional function): Custom validation function that takes an unknown value and returns either `{ success: true; value: OBJECT }` or `{ success: false; error: Error }`

### Returns
A JSON schema object compatible with the AI SDK

## Example
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

The function is generic and accepts a TypeScript type parameter to provide type safety for the schema.

### zodschema
Helper function converting Zod schemas to AI SDK-compatible JSON schemas; supports recursive schemas with `useReferences` option; metadata must be final in schema chain.

## Purpose
`zodSchema()` is a helper function that converts Zod schemas into JSON schema objects compatible with the AI SDK. Use it for generating structured data and in tools.

## Key Points
- You can pass Zod objects directly to AI SDK functions; they're automatically converted using `zodSchema()` internally
- Use `zodSchema()` explicitly when you need to specify options like `useReferences`

## Metadata Handling
When using `.meta()` or `.describe()` on Zod schemas, these methods must be called **at the end** of the schema chain. Most Zod schema methods (`.min()`, `.optional()`, `.extend()`, etc.) return new schema instances that don't inherit metadata from previous ones.

```ts
// ❌ Metadata lost - .min() returns new instance without metadata
z.string().meta({ describe: 'first name' }).min(1);

// ✅ Metadata preserved - .meta() is final method
z.string().min(1).meta({ describe: 'first name' });
```

## Recursive Schemas Example
```ts
import { zodSchema } from 'ai';
import { z } from 'zod';

const baseCategorySchema = z.object({
  name: z.string(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

const mySchema = zodSchema(
  z.object({
    category: categorySchema,
  }),
  { useReferences: true },
);
```

## API
**Parameters:**
- `zodSchema` (z.Schema): The Zod schema definition
- `options` (object, optional):
  - `useReferences` (boolean, optional): Enables support for references in schemas. Required for recursive schemas with `z.lazy()`. Not all language models/providers support references. Defaults to `false`.

**Returns:** A Schema object compatible with the AI SDK containing JSON schema representation and validation functionality.

### valibotschema
valibotSchema converts Valibot schemas to AI SDK-compatible JSON schemas for structured data generation and tool definitions; currently experimental.

## valibotSchema

Helper function that converts Valibot schemas into JSON schema objects compatible with the AI SDK. Currently experimental.

**Purpose**: Enables use of Valibot schemas for structured data generation and tool definitions within the AI SDK.

**Input**: A Valibot schema definition (type: `GenericSchema<unknown, T>`)

**Output**: A Schema object compatible with the AI SDK containing both JSON schema representation and validation functionality.

**Usage contexts**:
- Generating structured data
- Defining tools and tool calling

**Example**:
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

**Import**: `import { valibotSchema } from "ai"`

### modelmessage
Four message types (system, user, assistant, tool) with parts (text, image, file, tool-call, tool-result) supporting multimodal content and tool interactions; access Zod schemas via exports.

## Message Types

`ModelMessage` is the fundamental message structure for AI SDK Core functions, used in the `messages` field. Access the Zod schema via `modelMessageSchema` export.

### SystemModelMessage
System message containing system information:
```typescript
type SystemModelMessage = {
  role: 'system';
  content: string;
};
```
Note: Using the "system" property instead of a system message is recommended to enhance resilience against prompt injection attacks.

### UserModelMessage
User message containing text or combination of text, images, and files:
```typescript
type UserModelMessage = {
  role: 'user';
  content: UserContent;
};

type UserContent = string | Array<TextPart | ImagePart | FilePart>;
```

### AssistantModelMessage
Assistant message containing text, tool calls, or both:
```typescript
type AssistantModelMessage = {
  role: 'assistant';
  content: AssistantContent;
};

type AssistantContent = string | Array<TextPart | ToolCallPart>;
```

### ToolModelMessage
Tool message containing results of one or more tool calls:
```typescript
type ToolModelMessage = {
  role: 'tool';
  content: ToolContent;
};

type ToolContent = Array<ToolResultPart>;
```

## Message Parts

### TextPart
Text content part:
```typescript
export interface TextPart {
  type: 'text';
  text: string;
}
```

### ImagePart
Image part in user message:
```typescript
export interface ImagePart {
  type: 'image';
  image: DataContent | URL;
  mediaType?: string; // Optional IANA media type, auto-detected if omitted
}
```

### FilePart
File part in user message:
```typescript
export interface FilePart {
  type: 'file';
  data: DataContent | URL;
  filename?: string;
  mediaType: string; // Required IANA media type
}
```

### ToolCallPart
Tool call content part, typically generated by AI model:
```typescript
export interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string; // ID to match with tool result
  toolName: string;
  args: unknown; // JSON-serializable object matching tool's input schema
}
```

### ToolResultPart
Result of a tool call in tool message:
```typescript
export interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string; // ID of associated tool call
  toolName: string;
  output: LanguageModelV3ToolResultOutput;
  providerOptions?: ProviderOptions;
}
```

### ToolResultOutput
Output of a tool result with multiple variants:
- `type: 'text'` - Text output sent directly to API
- `type: 'json'` - JSON value output
- `type: 'execution-denied'` - User denied tool execution with optional reason
- `type: 'error-text'` - Text error output
- `type: 'error-json'` - JSON error output
- `type: 'content'` - Array of content items including text, file-data, file-url, file-id, image-data, image-url, image-file-id, or custom content parts. Each can have provider-specific options.

All variants support optional `providerOptions` for provider-specific functionality.

### uimessage
Type-safe message interface with generic METADATA, DATA_PARTS, TOOLS parameters; contains id, role, metadata, and parts array supporting text, reasoning, tool invocations, source URLs/documents, files, custom data, and step boundaries.

## UIMessage

`UIMessage` is the source of truth for application state, representing complete message history with metadata, data parts, and contextual information. Unlike `ModelMessage` (state passed to models), `UIMessage` contains full application state for UI rendering and client-side functionality.

### Type Safety

`UIMessage` accepts three generic parameters:
1. **METADATA** - Custom metadata type for additional message information
2. **DATA_PARTS** - Custom data part types for structured data components
3. **TOOLS** - Tool definitions for type-safe tool interactions

### Creating Custom UIMessage Type

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

### UIMessage Interface

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

### UIMessagePart Types

**TextUIPart** - Text content with streaming state:
```typescript
type TextUIPart = {
  type: 'text';
  text: string;
  state?: 'streaming' | 'done';
};
```

**ReasoningUIPart** - Reasoning content with provider metadata:
```typescript
type ReasoningUIPart = {
  type: 'reasoning';
  text: string;
  state?: 'streaming' | 'done';
  providerMetadata?: Record<string, any>;
};
```

**ToolUIPart** - Tool invocations with states (input-streaming, input-available, output-available, output-error). Type name based on tool name (e.g., `tool-someTool`):
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
        output?: never;
        errorText?: never;
      }
    | {
        state: 'input-available';
        input: TOOLS[NAME]['input'];
        providerExecuted?: boolean;
        output?: never;
        errorText?: never;
      }
    | {
        state: 'output-available';
        input: TOOLS[NAME]['input'];
        output: TOOLS[NAME]['output'];
        errorText?: never;
        providerExecuted?: boolean;
      }
    | {
        state: 'output-error';
        input: TOOLS[NAME]['input'];
        output?: never;
        errorText: string;
        providerExecuted?: boolean;
      }
  );
}>;
```

**SourceUrlUIPart** - Source URL reference:
```typescript
type SourceUrlUIPart = {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: Record<string, any>;
};
```

**SourceDocumentUIPart** - Document source reference:
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

**FileUIPart** - File with IANA media type and URL (hosted or Data URL):
```typescript
type FileUIPart = {
  type: 'file';
  mediaType: string;
  filename?: string;
  url: string;
};
```

**DataUIPart** - Custom data types. Type name based on data part name (e.g., `data-someDataPart`):
```typescript
type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
  };
}>;
```

**StepStartUIPart** - Step boundary marker:
```typescript
type StepStartUIPart = {
  type: 'step-start';
};
```

### validateuimessages
Async validator for UI messages with optional custom schemas for metadata, data parts, and tools; ensures type safety and data integrity.

## validateUIMessages

Async function that validates UI messages against schemas for metadata, data parts, and tools. Ensures type safety and data integrity for message arrays before processing or rendering.

### Basic Usage

Validate messages without custom schemas:

```typescript
import { validateUIMessages } from 'ai';

const messages = [
  {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'Hello!' }],
  },
];

const validatedMessages = await validateUIMessages({
  messages,
});
```

### Advanced Usage

Validate with custom metadata, data parts, and tools schemas:

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
    parameters: z.object({
      location: z.string(),
    }),
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
      {
        type: 'data-chart',
        data: { data: [1, 2, 3], labels: ['A', 'B', 'C'] },
      },
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

### Parameters

- `messages`: Array of UI messages to validate
- `metadataSchema` (optional): Zod schema for message metadata validation
- `dataSchemas` (optional): Object mapping data part types to their Zod schemas
- `tools` (optional): Object of tool definitions to validate tool calls against

Returns validated messages with type safety guarantees.

### safevalidateuimessages
Non-throwing message validator returning `{success, data|error}` with optional custom Zod schemas for metadata, data parts, and tools.

## safeValidateUIMessages

Async function that validates UI messages and returns a result object instead of throwing errors.

### Purpose
Validates message structures with optional custom schemas for metadata, data parts, and tools. Returns `{ success: true, data: validatedMessages }` on success or `{ success: false, error }` on failure.

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

if (!result.success) {
  console.error(result.error.message);
} else {
  const validatedMessages = result.data;
}
```

### Key Features
- Non-throwing alternative to `validateUIMessages`
- Supports custom Zod schemas for message metadata
- Supports custom data part schemas (e.g., chart, image)
- Supports tool validation
- Returns discriminated union: `{ success: boolean, data?: T, error?: Error }`

### createproviderregistry
Registry for managing multiple providers and models with centralized access via `providerId:modelId` identifiers; supports language models, embeddings, and image generation with customizable separator.

## Purpose
`createProviderRegistry` creates a centralized registry for managing multiple AI providers and models, allowing access via simple string identifiers in the format `providerId:modelId`.

## Setup
Create a registry by passing an object with provider instances:
```ts
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createProviderRegistry } from 'ai';

export const registry = createProviderRegistry({
  anthropic,
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
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

**Language models** via `languageModel(id)`:
```ts
const { text } = await generateText({
  model: registry.languageModel('openai:gpt-4.1'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

**Text embedding models** via `embeddingModel(id)`:
```ts
const { embedding } = await embed({
  model: registry.embeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

**Image models** via `imageModel(id)`:
```ts
const { image } = await generateImage({
  model: registry.imageModel('openai:dall-e-3'),
  prompt: 'A beautiful sunset over a calm ocean',
});
```

## API Signature
**Parameters:**
- `providers` (Record<string, Provider>): Object mapping provider IDs to Provider instances. Each Provider has `languageModel(id)`, `embeddingModel(id)`, and `imageModel(id)` methods.
- `options` (object, optional): Configuration object with `separator` (string, defaults to ":") to customize the provider:model delimiter.

**Returns:** Provider instance with three methods:
- `languageModel(id: string) => LanguageModel`
- `embeddingModel(id: string) => EmbeddingModel<string>`
- `imageModel(id: string) => ImageModel`

### customprovider
customProvider() maps model IDs to LanguageModel/EmbeddingModel/ImageModel instances with optional fallback provider; returns Provider with languageModel(id), embeddingModel(id), imageModel(id) methods.

## customProvider()

Creates a custom provider that maps model IDs to any model instance, enabling custom model configurations, aliases, and wrapping of existing providers with additional functionality.

### Parameters

- `languageModels` (optional): Record mapping model IDs to LanguageModel instances
- `embeddingModels` (optional): Record mapping model IDs to EmbeddingModel<string> instances
- `imageModels` (optional): Record mapping model IDs to ImageModel instances
- `fallbackProvider` (optional): A Provider to use when a requested model is not found in the custom provider

### Returns

A Provider instance with three methods:
- `languageModel(id: string): LanguageModel` - Returns a language model by ID (format: providerId:modelId)
- `embeddingModel(id: string): EmbeddingModel<string>` - Returns an embedding model by ID (format: providerId:modelId)
- `imageModel(id: string): ImageModel` - Returns an image model by ID (format: providerId:modelId)

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

This example creates a custom provider that wraps OpenAI models with custom settings (like reasoningEffort) and provides model aliases.

### cosinesimilarity
cosineSimilarity(vector1, vector2) returns number between -1 and 1 measuring vector similarity; import from 'ai'

## cosineSimilarity()

Calculates the cosine similarity between two vectors, a standard metric for comparing embedding similarity.

**Purpose**: Determine how similar two vectors are by computing their cosine similarity. Returns a value between -1 and 1, where values close to 1 indicate very similar vectors and values close to -1 indicate dissimilar vectors.

**Parameters**:
- `vector1` (number[]): The first vector to compare
- `vector2` (number[]): The second vector to compare

**Returns**: A number between -1 and 1 representing the cosine similarity.

**Example**:
```ts
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity, embedMany } from 'ai';

const { embeddings } = await embedMany({
  model: 'openai/text-embedding-3-small',
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});

console.log(
  `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
);
```

**Import**: `import { cosineSimilarity } from "ai"`

### wraplanguagemodel
wrapLanguageModel() wraps LanguageModelV3 with middleware (single or array); supports optional modelId/providerId overrides.

## wrapLanguageModel()

Function that wraps a language model with middleware to enhance its behavior.

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
- **middleware** (LanguageModelV3Middleware | LanguageModelV3Middleware[]): Middleware to apply. When multiple middlewares are provided, the first transforms input first, and the last wraps directly around the model.
- **modelId** (string, optional): Custom model ID to override the original model's ID.
- **providerId** (string, optional): Custom provider ID to override the original model's provider.

### Returns

A new LanguageModelV3 instance with middleware applied.

### languagemodelv3middleware
LanguageModelV3Middleware: experimental interface with transformParams, wrapGenerate, wrapStream methods for intercepting/modifying language model calls to add guardrails, RAG, caching, logging.

## LanguageModelV3Middleware

Middleware interface for intercepting and modifying language model calls in a model-agnostic way. Enables adding features like guardrails, RAG, caching, and logging.

**Note:** This is an experimental feature.

### API Signature

The middleware provides three optional methods:

- **transformParams**: Intercepts and transforms call parameters before they reach the language model. Receives the operation type ("generate" or "stream") and LanguageModelV3CallOptions, returns modified LanguageModelV3CallOptions.

- **wrapGenerate**: Wraps the generate operation. Receives the doGenerate function, call parameters, and model instance. Returns DoGenerateResult.

- **wrapStream**: Wraps the stream operation. Receives the doStream function, call parameters, and model instance. Returns DoStreamResult.

### Import

```
import { LanguageModelV3Middleware } from "ai"
```

### extractreasoningmiddleware
Middleware extracting XML-tagged reasoning from AI responses; parameters: tagName (required), separator (optional, default `\n`), startWithReasoning (optional, default false); returns middleware processing streaming/non-streaming, extracting reasoning between tags, removing tags from text, adding reasoning property.

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

- **tagName** (string, required): The name of the XML tag to extract reasoning from (without angle brackets)
- **separator** (string, optional): The separator to use between reasoning and text sections. Defaults to `\n`
- **startWithReasoning** (boolean, optional): Set to true when the response always starts with reasoning and the initial tag is omitted. Defaults to false

### Returns

A middleware object that:
- Processes both streaming and non-streaming responses
- Extracts content between specified XML tags as reasoning
- Removes the XML tags and reasoning from the main text
- Adds a `reasoning` property to the result containing the extracted content
- Maintains proper separation between text sections using the specified separator

### Type Information

Works with the `LanguageModelV3StreamPart` type for streaming responses.

### simulatestreamingmiddleware
Middleware converting non-streaming model responses into simulated streams; wraps model with `wrapLanguageModel()` and enables uniform streaming interface via `result.fullStream` iteration.

## simulateStreamingMiddleware

A middleware function that converts non-streaming language model responses into simulated streaming behavior, maintaining a consistent streaming interface regardless of the underlying model's capabilities.

### Purpose
Allows you to use a uniform streaming interface with models that only provide complete responses, eliminating the need to handle streaming and non-streaming models differently.

### API
- **Import**: `import { simulateStreamingMiddleware } from 'ai'`
- **Parameters**: None
- **Returns**: A middleware object that transforms complete responses into simulated streams

### How It Works
1. Awaits the complete response from the language model
2. Creates a `ReadableStream` that emits chunks in the correct sequence
3. Breaks down the response into appropriate chunk types
4. Preserves all response properties including text content, reasoning (string or array of objects), tool calls, metadata, usage information, and warnings

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

After wrapping a non-streaming model with this middleware, you can iterate over `result.fullStream` using the standard streaming interface.

### defaultsettingsmiddleware
Middleware applying default LanguageModelV3CallOptions to model calls; explicit parameters override defaults; merges provider metadata.

## defaultSettingsMiddleware

A middleware function that applies default settings to language model calls, enabling consistent default parameters across multiple model invocations.

### Import
```ts
import { defaultSettingsMiddleware } from 'ai';
```

### API Signature

**Parameters:**
- `settings`: An object containing default parameter values to apply to language model calls. Accepts any valid `LanguageModelV3CallOptions` properties and optional provider metadata.

**Returns:** A middleware object that merges default settings with call-specific parameters, ensuring explicitly provided parameters take precedence over defaults and merges provider metadata objects.

### Usage

Create a model with default settings:
```ts
import { streamText, wrapLanguageModel, defaultSettingsMiddleware } from 'ai';

const modelWithDefaults = wrapLanguageModel({
  model: gateway('anthropic/claude-sonnet-4.5'),
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      providerOptions: {
        openai: {
          reasoningEffort: 'high',
        },
      },
    },
  }),
});

// Use the model - default settings will be applied
const result = await streamText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
  temperature: 0.8, // Overrides the default 0.7
});
```

### How It Works

1. Takes a set of default settings as configuration
2. Merges these defaults with the parameters provided in each model call
3. Ensures explicitly provided parameters take precedence over defaults
4. Merges provider metadata objects from both sources

### stepcountis
stepCountIs(count) creates a stop condition for tool-calling loops in generateText/streamText; returns true when step count reaches specified number; can be combined with other conditions in array.

## stepCountIs()

Creates a stop condition that halts a tool-calling loop when the number of steps reaches a specified count.

### Purpose
Used with the `stopWhen` parameter in `generateText()` and `streamText()` to control tool-calling loop termination based on step count.

### Import
```ts
import { stepCountIs } from "ai";
```

### API Signature

**Parameters:**
- `count` (number): The maximum number of steps to execute before stopping the tool-calling loop.

**Returns:** A `StopCondition` function that returns `true` when the step count reaches the specified number.

### Usage Examples

**Basic usage - stop after 3 steps:**
```ts
import { generateText, stepCountIs } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: stepCountIs(3),
});
```

**Combining multiple stop conditions:**
```ts
import { generateText, stepCountIs, hasToolCall } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: [stepCountIs(10), hasToolCall('finalAnswer')],
});
```

When multiple conditions are provided in an array, the loop stops when any condition is met (OR logic).

### Related Functions
- `hasToolCall()` - Stop condition based on specific tool calls
- `generateText()` - Core function that accepts stopWhen parameter
- `streamText()` - Streaming variant that accepts stopWhen parameter

### hastoolcall
Stop condition function that halts tool-calling loops when a specified tool is invoked; accepts tool name string, returns StopCondition for use with generateText/streamText stopWhen parameter.

## hasToolCall()

Creates a stop condition that halts tool-calling loops when a specific tool is invoked.

### Purpose
Used with the `stopWhen` parameter in `generateText()` and `streamText()` to control when agentic loops should terminate based on tool invocation.

### API Signature

**Parameters:**
- `toolName` (string): Name of the tool that triggers the stop condition when called

**Returns:** A `StopCondition` function that returns `true` when the specified tool is called in the current step.

### Import
```ts
import { hasToolCall } from 'ai';
```

### Usage Examples

**Basic usage - stop when a tool is called:**
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    submitAnswer: submitAnswerTool,
    search: searchTool,
  },
  stopWhen: hasToolCall('submitAnswer'),
});
```

**Combining multiple stop conditions:**
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

**Agent pattern - run until final answer:**
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    search: searchTool,
    calculate: calculateTool,
    finalAnswer: {
      description: 'Provide the final answer to the user',
      parameters: z.object({
        answer: z.string(),
      }),
      execute: async ({ answer }) => answer,
    },
  },
  stopWhen: hasToolCall('finalAnswer'),
});
```

### Related Functions
- `stepCountIs()` - stop condition based on step count
- `generateText()` - function that accepts stopWhen parameter
- `streamText()` - function that accepts stopWhen parameter

### simulatereadablestream
ReadableStream utility that emits array values sequentially with optional initialDelayInMs and chunkDelayInMs delays; useful for testing streaming or simulating time-delayed data.

## simulateReadableStream()

Utility function that creates a ReadableStream emitting provided values sequentially with configurable delays. Useful for testing streaming functionality or simulating time-delayed data streams.

### Import
```ts
import { simulateReadableStream } from 'ai';
```

### Parameters
- `chunks` (T[], required): Array of values to be emitted by the stream
- `initialDelayInMs` (number | null, optional): Initial delay in milliseconds before emitting the first value. Defaults to 0. Set to null to skip the initial delay entirely.
- `chunkDelayInMs` (number | null, optional): Delay in milliseconds between emitting each value. Defaults to 0. Set to null to skip delays between chunks.

### Returns
ReadableStream<T> that:
- Emits each value from the chunks array sequentially
- Waits for initialDelayInMs before emitting the first value (if not null)
- Waits for chunkDelayInMs between emitting subsequent values (if not null)
- Closes automatically after all chunks have been emitted

### Type Parameters
- T: The type of values contained in the chunks array and emitted by the stream

### Examples

Basic usage:
```ts
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
});
```

With delays (1 second initial, 0.5 seconds between chunks):
```ts
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: 1000,
  chunkDelayInMs: 500,
});
```

Without delays:
```ts
const stream = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: null,
  chunkDelayInMs: null,
});
```

### smoothstream
TransformStream utility for smoothing text streaming with configurable delays and chunking strategies (word/line/regex/custom callback), with special support for non-latin languages.

## smoothStream()

A utility function that creates a TransformStream for the `streamText` `transform` option to smooth text streaming by buffering and releasing complete words/lines with configurable delays, creating a more natural reading experience.

### Import
```ts
import { smoothStream } from "ai";
```

### Basic Usage
```ts
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream({
    delayInMs: 20,
    chunking: 'line',
  }),
});
```

### Parameters

**delayInMs** (number | null, optional)
- The delay in milliseconds between outputting each chunk
- Defaults to 10ms
- Set to `null` to disable delays

**chunking** (string | RegExp | function, optional)
- Controls how text is chunked for streaming
- `"word"` - stream word by word (default)
- `"line"` - stream line by line
- RegExp pattern - custom regex-based chunking
- Function - custom callback for chunking

### Chunking Options

**Word chunking limitations with non-latin languages:**
Word-based chunking does not work well with languages that don't delimit words with spaces (Chinese, Japanese, Vietnamese, Thai, Javanese). For these languages, use custom regex or callback functions.

**Chinese example:**
```ts
smoothStream({
  chunking: /[\u4E00-\u9FFF]|\S+\s+/,
})
```

**Japanese example:**
```ts
smoothStream({
  chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/,
})
```

**Regex-based chunking:**
```ts
// Split on underscores
smoothStream({
  chunking: /_+/,
});

// Alternative syntax
smoothStream({
  chunking: /[^_]*_/,
});
```

**Custom callback chunking:**
```ts
smoothStream({
  chunking: text => {
    const findString = 'some string';
    const index = text.indexOf(findString);
    if (index === -1) {
      return null;
    }
    return text.slice(0, index) + findString;
  },
})
```

### Returns

Returns a TransformStream that:
- Buffers incoming text chunks
- Releases text when the chunking pattern is encountered
- Adds configurable delays between chunks for smooth output
- Passes through non-text chunks (like step-finish events) immediately

### generateid
generateId() produces unique ID strings; optional size parameter (default 16) is deprecated.

Generates a unique identifier string. This is the same ID generator used internally by the AI SDK.

**Usage:**
```ts
import { generateId } from 'ai';

const id = generateId();
```

**Parameters:**
- `size` (number, optional): The length of the generated ID. Defaults to 16. This parameter is deprecated and will be removed in the next major version.

**Returns:** A string representing the generated ID.

**Related:** See `createIdGenerator()` for creating custom ID generators.

### createidgenerator
Customizable ID generator with prefix, separator, alphabet, and size options; uses non-secure randomization.

## createIdGenerator()

Creates a customizable ID generator function with configurable alphabet, prefix, separator, and size.

### Import
```ts
import { createIdGenerator } from 'ai';
```

### Parameters (options object)
- `alphabet` (string): Characters for the random part. Defaults to alphanumeric (0-9, A-Z, a-z).
- `prefix` (string): String prepended to all IDs. Defaults to none.
- `separator` (string): Character(s) between prefix and random part. Defaults to "-".
- `size` (number): Length of the random part. Defaults to 16.

### Returns
A function that generates IDs based on the configured options.

### Usage Example
```ts
const generateUserId = createIdGenerator({
  prefix: 'user',
  separator: '_',
  size: 8,
});

const id = generateUserId(); // e.g., "user_1a2b3c4d"
```

### Important Notes
- Uses non-secure random generation; not suitable for security-critical purposes.
- The separator character must not be part of the alphabet to ensure reliable prefix checking.

