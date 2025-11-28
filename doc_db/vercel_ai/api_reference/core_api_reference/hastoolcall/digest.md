## hasToolCall()

Creates a stop condition that halts tool-calling loops when a specific tool is invoked.

### Purpose
Used with the `stopWhen` parameter in `generateText()` and `streamText()` to control when agentic loops should terminate based on tool invocation.

### API Signature

**Parameters:**
- `toolName` (string): Name of the tool that triggers the stop condition when called

**Returns:** A `StopCondition` function that returns `true` when the specified tool is called in the current step.

### Import
```ts
import { hasToolCall } from 'ai';
```

### Usage Examples

**Basic usage - stop when a tool is called:**
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    submitAnswer: submitAnswerTool,
    search: searchTool,
  },
  stopWhen: hasToolCall('submitAnswer'),
});
```

**Combining multiple stop conditions:**
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    weather: weatherTool,
    search: searchTool,
    finalAnswer: finalAnswerTool,
  },
  stopWhen: [
    hasToolCall('weather'),
    hasToolCall('finalAnswer'),
    stepCountIs(5),
  ],
});
```

**Agent pattern - run until final answer:**
```ts
const result = await generateText({
  model: yourModel,
  tools: {
    search: searchTool,
    calculate: calculateTool,
    finalAnswer: {
      description: 'Provide the final answer to the user',
      parameters: z.object({
        answer: z.string(),
      }),
      execute: async ({ answer }) => answer,
    },
  },
  stopWhen: hasToolCall('finalAnswer'),
});
```

### Related Functions
- `stepCountIs()` - stop condition based on step count
- `generateText()` - function that accepts stopWhen parameter
- `streamText()` - function that accepts stopWhen parameter