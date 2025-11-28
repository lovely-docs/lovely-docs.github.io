## streamUI

A helper function from AI SDK RSC that creates a streamable UI from LLM providers, supporting the same model interfaces as AI SDK Core APIs.

**Note:** AI SDK RSC is experimental. Use AI SDK UI for production; see migration guide for transitioning from RSC to UI.

### Import
```
import { streamUI } from "@ai-sdk/rsc"
```

### Parameters

**Core Configuration:**
- `model` (LanguageModel): The language model to use, e.g., `openai("gpt-4.1")`
- `system` (string | SystemModelMessage): System prompt specifying model behavior
- `prompt` (string): Input prompt to generate text from
- `initial` (ReactNode, optional): Initial UI to render

**Messages:**
- `messages` (Array): Conversation history supporting CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage, or UIMessage from useChat hook
  - CoreSystemMessage: `{ role: 'system', content: string }`
  - CoreUserMessage: `{ role: 'user', content: string | Array<TextPart | ImagePart | FilePart> }`
    - TextPart: `{ type: 'text', text: string }`
    - ImagePart: `{ type: 'image', image: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType?: string }`
    - FilePart: `{ type: 'file', data: string | Uint8Array | Buffer | ArrayBuffer | URL, mediaType: string }`
  - CoreAssistantMessage: `{ role: 'assistant', content: string | Array<TextPart | ToolCallPart> }`
    - ToolCallPart: `{ type: 'tool-call', toolCallId: string, toolName: string, args: object }`
  - CoreToolMessage: `{ role: 'tool', content: Array<ToolResultPart> }`
    - ToolResultPart: `{ type: 'tool-result', toolCallId: string, toolName: string, result: unknown, isError?: boolean }`

**Generation Parameters:**
- `maxOutputTokens` (number, optional): Maximum tokens to generate
- `temperature` (number, optional): Temperature setting (set either temperature or topP, not both)
- `topP` (number, optional): Nucleus sampling (set either temperature or topP, not both)
- `topK` (number, optional): Sample from top K options per token (advanced use only)
- `presencePenalty` (number, optional): Affects likelihood of repeating information in prompt
- `frequencyPenalty` (number, optional): Affects likelihood of repeating same words/phrases
- `stopSequences` (string[], optional): Sequences that stop generation
- `seed` (number, optional): Integer seed for deterministic results if supported

**Request Control:**
- `maxRetries` (number, optional): Maximum retries, default 2; set to 0 to disable
- `abortSignal` (AbortSignal, optional): Cancel the call
- `headers` (Record<string, string>, optional): Additional HTTP headers for HTTP-based providers

**Tools:**
- `tools` (ToolSet): Tools accessible to the model
  - Tool: `{ description?: string, parameters: zod schema, generate?: (async (parameters) => ReactNode) | AsyncGenerator<ReactNode, ReactNode, void> }`
- `toolChoice` (optional): `"auto" | "none" | "required" | { "type": "tool", "toolName": string }` - specifies how tools are selected (default: "auto")

**Callbacks:**
- `text` ((Text) => ReactNode, optional): Callback for generated tokens with `{ content: string, delta: string, done: boolean }`
- `onFinish` ((OnFinishResult) => void, optional): Called when LLM response and tool executions finish
  - OnFinishResult: `{ usage: TokenUsage, value: ReactNode, warnings?: Warning[], response?: Response }`
  - TokenUsage: `{ promptTokens: number, completionTokens: number, totalTokens: number }`
  - Response: `{ headers?: Record<string, string> }`

**Provider:**
- `providerOptions` (Record<string, JSONObject>, optional): Provider-specific options

### Returns

- `value` (ReactNode): The user interface based on stream output
- `response` (Response, optional): Response data with optional headers
- `warnings` (Warning[], optional): Warnings from model provider
- `stream` (AsyncIterable<StreamPart> & ReadableStream<StreamPart>): Stream of all events
  - StreamPart types:
    - Text delta: `{ type: 'text-delta', textDelta: string }`
    - Tool call: `{ type: 'tool-call', toolCallId: string, toolName: string, args: object }`
    - Error: `{ type: 'error', error: Error }`
    - Finish: `{ type: 'finish', finishReason: 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown', usage: TokenUsage }`

### Examples

- Render React components as function calls using language model in Next.js
- Persist and restore UI/AI states in Next.js
- Route React components using language model in Next.js
- Stream component updates to client in Next.js