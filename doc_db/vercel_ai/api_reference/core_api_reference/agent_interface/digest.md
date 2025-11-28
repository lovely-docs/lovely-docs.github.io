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