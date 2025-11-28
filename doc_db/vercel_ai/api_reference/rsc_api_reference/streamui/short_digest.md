## streamUI

Creates streamable UI from LLM providers in AI SDK RSC (experimental; use AI SDK UI for production).

**Import:** `import { streamUI } from "@ai-sdk/rsc"`

**Key Parameters:**
- `model`: Language model (e.g., `openai("gpt-4.1")`)
- `system`: System prompt
- `prompt`: Input prompt
- `messages`: Conversation history (CoreSystemMessage, CoreUserMessage, CoreAssistantMessage, CoreToolMessage)
- `initial`: Initial UI (optional)
- Generation: `maxOutputTokens`, `temperature`/`topP`, `topK`, `presencePenalty`, `frequencyPenalty`, `stopSequences`, `seed`
- `tools`: Accessible tools with `generate` function for UI
- `toolChoice`: How tools are selected ("auto", "none", "required", or specific tool)
- `text`: Callback for generated tokens
- `onFinish`: Callback when complete with usage and final UI

**Returns:**
- `value`: Generated UI (ReactNode)
- `stream`: AsyncIterable/ReadableStream of events (text-delta, tool-call, error, finish)
- `response`: Optional response headers
- `warnings`: Provider warnings

**Examples:** Render components as function calls, persist/restore states, route components, stream updates in Next.js