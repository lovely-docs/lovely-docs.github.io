## Tool Calling

Tools are objects models call to perform tasks with `description`, `inputSchema` (Zod/JSON), and optional `execute` async function. Pass as object to `generateText`/`streamText`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Multi-Step Calls (stopWhen)

Enable multi-step calls with `stopWhen` to trigger new generations passing tool results until no further tool calls or stopping condition met:

```ts
const { text, steps } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: tool({ /* ... */ }) },
  stopWhen: stepCountIs(5),
  prompt: 'What is the weather in San Francisco?',
});

const allToolCalls = steps.flatMap(step => step.toolCalls);
```

**Callbacks:**
- `onStepFinish`: Triggered when step finishes with text, tool calls, results
- `prepareStep`: Called before step starts, can modify settings/messages

```ts
onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) { /* ... */ }

prepareStep: async ({ model, stepNumber, steps, messages }) => {
  if (stepNumber === 0) {
    return { model: differentModel, toolChoice: { type: 'tool', toolName: 'tool1' } };
  }
}
```

## Response Messages

Add generated messages to conversation history via `response.messages`:

```ts
const { response } = await generateText({ /* ... */ messages });
messages.push(...response.messages);
```

## Dynamic Tools

`dynamicTool` for tools with unknown input/output types (MCP, user-defined, external):

```ts
const customTool = dynamicTool({
  description: 'Execute a custom function',
  inputSchema: z.object({}),
  execute: async input => {
    const { action, parameters } = input as any;
    return { result: `Executed ${action}` };
  },
});
```

## Preliminary Tool Results

Return `AsyncIterable` for multiple results, last value is final result. Stream status during execution:

```ts
async *execute({ location }) {
  yield { status: 'loading', text: `Getting weather for ${location}` };
  await new Promise(resolve => setTimeout(resolve, 3000));
  yield { status: 'success', text: `Weather is 72°F` };
}
```

## Tool Choice

Control tool selection with `toolChoice`: `auto` (default), `required`, `none`, or `{ type: 'tool', toolName: string }`:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { weather: tool({ /* ... */ }) },
  toolChoice: 'required',
  prompt: 'What is the weather in San Francisco?',
});
```

## Tool Execution Options

Tools receive second parameter with options:
- `toolCallId`: Forward tool-call related information
- `messages`: Access message history sent to model
- `abortSignal`: Forward abort signals to fetch/long-running computations
- `experimental_context`: Pass arbitrary context

```ts
execute: async (args, { toolCallId, messages, abortSignal, experimental_context }) => {
  writer.write({ type: 'data-tool-status', id: toolCallId, data: { status: 'in-progress' } });
  return fetch(url, { signal: abortSignal });
}
```

## Tool Input Lifecycle Hooks

Streaming-only hooks: `onInputStart`, `onInputDelta`, `onInputAvailable`:

```ts
getWeather: tool({
  /* ... */
  onInputStart: () => console.log('Tool call starting'),
  onInputDelta: ({ inputTextDelta }) => console.log('Chunk:', inputTextDelta),
  onInputAvailable: ({ input }) => console.log('Complete:', input),
})
```

## Types

Helper types for type safety: `ToolCall<NAME, ARGS>`, `ToolResult<NAME, ARGS, RESULT>`, `TypedToolCall<TOOLS>`, `TypedToolResult<TOOLS>`:

```ts
type MyToolCall = TypedToolCall<typeof myToolSet>;
type MyToolResult = TypedToolResult<typeof myToolSet>;

async function generateSomething(prompt: string): Promise<{
  text: string;
  toolCalls: Array<MyToolCall>;
  toolResults: Array<MyToolResult>;
}> {
  return generateText({ model, tools: myToolSet, prompt });
}
```

## Error Handling

Three tool-call errors: `NoSuchToolError`, `InvalidToolInputError`, `ToolCallRepairError`. `generateText` throws on schema validation, tool execution errors appear as `tool-error` parts in steps:

```ts
try {
  const result = await generateText({ /* ... */ });
} catch (error) {
  if (NoSuchToolError.isInstance(error)) { /* ... */ }
}

const { steps } = await generateText({ /* ... */ });
const toolErrors = steps.flatMap(step =>
  step.content.filter(part => part.type === 'tool-error'),
);
```

`streamText` sends errors in stream. Use `toUIMessageStreamResponse` with `onError`:

```ts
result.toUIMessageStreamResponse({
  onError: error => {
    if (NoSuchToolError.isInstance(error)) return 'Unknown tool.';
    if (InvalidToolInputError.isInstance(error)) return 'Invalid inputs.';
    return 'Unknown error.';
  },
});
```

## Tool Call Repair (experimental)

Control invalid tool call repair with `experimental_repairToolCall`. Strategies: use model with structured outputs or re-ask strategy:

```ts
experimental_repairToolCall: async ({ toolCall, tools, inputSchema, error }) => {
  if (NoSuchToolError.isInstance(error)) return null;
  const tool = tools[toolCall.toolName];
  const { object: repairedArgs } = await generateObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: tool.inputSchema,
    prompt: `Fix these inputs: ${JSON.stringify(toolCall.input)}`,
  });
  return { ...toolCall, input: JSON.stringify(repairedArgs) };
}
```

## Active Tools

Limit available tools with `activeTools` (array of tool names) while maintaining static typing:

```ts
const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: myToolSet,
  activeTools: ['firstTool'],
});
```

## Multi-modal Tool Results (experimental)

Anthropic/OpenAI only. Tools have optional `toModelOutput` converting result to content part:

```ts
toModelOutput(result) {
  return {
    type: 'content',
    value: typeof result === 'string'
      ? [{ type: 'text', text: result }]
      : [{ type: 'media', data: result.data, mediaType: 'image/png' }],
  };
}
```

## Extracting Tools

Extract tools to separate files using `tool` helper for correct type inference:

```ts
// tools/weather-tool.ts
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

## MCP Tools

AI SDK supports Model Context Protocol (MCP) servers for standardized tool access. AI SDK tools best for production (full control, type safety, low latency), MCP tools for development iteration and user-provided tools.