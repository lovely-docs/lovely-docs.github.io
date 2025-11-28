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