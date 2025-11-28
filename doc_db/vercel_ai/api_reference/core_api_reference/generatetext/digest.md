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