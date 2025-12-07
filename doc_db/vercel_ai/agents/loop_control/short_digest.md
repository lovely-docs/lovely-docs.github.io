Control agent loop execution with `stopWhen` (built-in conditions like `stepCountIs(20)`, `hasToolCall()`, or custom) and `prepareStep` callback to modify model, tools, messages, and settings between steps.

Custom stop condition example:
```ts
const hasAnswer: StopCondition = ({ steps }) => 
  steps.some(step => step.text?.includes('ANSWER:')) ?? false;
```

`prepareStep` examples: dynamic model selection by step count, context management by trimming old messages, tool selection by phase, forcing specific tools, and message transformation.

For complete control, implement manual loop with `generateText`/`streamText` directly.