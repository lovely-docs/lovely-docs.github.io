## Tool Calling

Tools are objects models call to perform tasks. Define with `description`, `inputSchema` (Zod/JSON), and `execute` function:

```ts
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ location, temperature: 72 + Math.random() * 21 - 10 }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Multi-Step Calls

Use `stopWhen` to enable multiple tool calls and text responses in sequence:

```ts
const { text, steps } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: { /* ... */ },
  stopWhen: stepCountIs(5),
  prompt: 'What is the weather in San Francisco?',
});

// Callbacks: onStepFinish, prepareStep
onStepFinish({ text, toolCalls, toolResults, finishReason, usage }) { }
prepareStep: async ({ stepNumber, steps, messages }) => ({ /* modified settings */ })
```

## Tool Execution Options

Tools receive second parameter with: `toolCallId`, `messages` (history), `abortSignal`, `experimental_context`.

## Dynamic Tools

For runtime-unknown schemas, use `dynamicTool`. Check `toolCall.dynamic` flag for type narrowing.

## Tool Input Lifecycle Hooks

In `streamText`: `onInputStart`, `onInputDelta`, `onInputAvailable`.

## Tool Choice

Control with `toolChoice`: `'auto'` (default), `'required'`, `'none'`, or `{ type: 'tool', toolName: string }`.

## Error Handling

Catch `NoSuchToolError`, `InvalidToolInputError`, `ToolCallRepairError`. Tool execution errors appear as `tool-error` parts in steps.

## Tool Call Repair (experimental)

Use `experimental_repairToolCall` to fix invalid calls without additional steps. Strategies: structured outputs or re-ask.

## Active Tools

Limit available tools with `activeTools: ['toolName']` while maintaining static typing.

## Multi-modal Tool Results (experimental)

Use `toModelOutput` function to convert results (e.g., screenshots) to content parts for Anthropic/OpenAI.

## Types

Use `TypedToolCall<TOOLS>` and `TypedToolResult<TOOLS>` for type-safe tool definitions outside `generateText`/`streamText`.

## MCP Tools

AI SDK supports Model Context Protocol servers. AI SDK tools better for production (type safety, same process); MCP tools for development/user-provided tools.
