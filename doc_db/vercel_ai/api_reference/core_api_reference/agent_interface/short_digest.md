## Agent Interface

Contract for AI agents that generate or stream responses to prompts, supporting tool usage and multi-step workflows.

### Core Properties & Methods

- `version: 'agent-v1'` - Interface version
- `id: string | undefined` - Optional identifier
- `tools: ToolSet` - Available tools
- `generate(options)` - Non-streaming output
- `stream(options)` - Streaming output

### Generic Parameters

- `CALL_OPTIONS` - Additional call options type
- `TOOLS` - Tool set type
- `OUTPUT` - Additional output data type

### Method Parameters

Both methods accept `AgentCallParameters<CALL_OPTIONS>`:
- `prompt` or `messages` (mutually exclusive)
- `options` - Additional call options
- `abortSignal` - Cancellation signal

### Custom Agent Example

```ts
class MyEchoAgent implements Agent {
  version = 'agent-v1' as const;
  id = 'echo';
  tools = {};

  async generate({ prompt, messages }) {
    const text = prompt ?? JSON.stringify(messages);
    return { text, steps: [] };
  }

  async stream({ prompt, messages }) {
    return {
      textStream: (async function* () {
        yield prompt ?? JSON.stringify(messages);
      })(),
    };
  }
}
```

### Usage

```ts
const agent = new ToolLoopAgent({ ... });
const stream = await createAgentUIStream({
  agent,
  messages: [{ role: "user", content: "What is the weather in NYC?" }]
});
```