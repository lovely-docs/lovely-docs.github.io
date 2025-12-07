## Agent Interface

Contract for AI agents that generate or stream responses. Agents encapsulate tool usage, multi-step workflows, and prompt handling.

### Core Structure

```ts
interface Agent<CALL_OPTIONS = never, TOOLS extends ToolSet = {}, OUTPUT extends Output = never> {
  readonly version: 'agent-v1';
  readonly id: string | undefined;
  readonly tools: TOOLS;
  generate(options: AgentCallParameters<CALL_OPTIONS>): PromiseLike<GenerateTextResult<TOOLS, OUTPUT>>;
  stream(options: AgentCallParameters<CALL_OPTIONS>): PromiseLike<StreamTextResult<TOOLS, OUTPUT>>;
}
```

### Call Parameters

Accept either `prompt` (string or `ModelMessage[]`) or `messages` (mutually exclusive), plus optional `options` and `abortSignal`.

### Custom Implementation Example

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

Use with SDK utilities like `createAgentUIStream` or the official `ToolLoopAgent` for multi-step workflows.