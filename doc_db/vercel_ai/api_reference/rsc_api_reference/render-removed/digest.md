The `render` function has been removed in AI SDK 4.0. It was a helper function to create streamable UI from LLM providers, similar to AI SDK Core APIs with support for the same model interfaces.

**Note**: `render` was deprecated in favor of `streamUI`. During migration, ensure the `messages` parameter follows the updated specification for `streamUI`.

**Import**:
```javascript
import { render } from "@ai-sdk/rsc"
```

**Parameters**:
- `model` (string): Model identifier, must be OpenAI SDK compatible
- `provider` (provider client): Currently only OpenAI available, must match model name
- `initial` (ReactNode, optional): Initial UI to render
- `messages` (Array): Conversation messages with types:
  - `SystemMessage`: `{ role: 'system', content: string }`
  - `UserMessage`: `{ role: 'user', content: string }`
  - `AssistantMessage`: `{ role: 'assistant', content: string, tool_calls?: ToolCall[] }`
    - `ToolCall`: `{ id: string, type: 'function', function: { name: string, arguments: string } }`
  - `ToolMessage`: `{ role: 'tool', content: string, toolCallId: string }`
- `functions` or `tools` (ToolSet, optional): Tools accessible to the model
  - `Tool`: `{ description?: string, parameters: zod schema, render?: async (parameters) => any }`
- `text` (optional): Callback `(Text) => ReactNode` to handle generated tokens
  - `Text`: `{ content: string, delta: string, done: boolean }`
- `temperature` (number, optional): Model temperature

**Returns**: Any valid ReactNode

**Status**: Experimental. AI SDK RSC is experimental; use AI SDK UI for production. See migration guide for RSC to UI migration.