## streamUI

Creates streamable UI from LLM providers. Takes model, system prompt, input prompt/messages, and optional tools. Returns ReactNode UI, response metadata, and AsyncIterable stream of text-delta, tool-call, error, and finish events.

**Key parameters:** model, system, prompt/messages, tools (with generate callbacks), text/onFinish callbacks, generation options (temperature, topP, maxOutputTokens, etc.)

**Returns:** value (ReactNode), response, warnings, stream (text-delta | tool-call | error | finish events)

**Use cases:** Render components from LLM output, persist/restore UI states, route components dynamically, stream updates to client