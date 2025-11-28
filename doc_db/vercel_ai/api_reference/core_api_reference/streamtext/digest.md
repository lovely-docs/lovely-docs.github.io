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