## hasToolCall()

Creates a stop condition for tool-calling loops that triggers when a specific tool is invoked.

### API
```ts
import { hasToolCall } from 'ai';
hasToolCall(toolName: string): StopCondition
```

### Examples

Stop when a tool is called:
```ts
await generateText({
  model: yourModel,
  tools: { submitAnswer: submitAnswerTool, search: searchTool },
  stopWhen: hasToolCall('submitAnswer'),
});
```

Combine multiple conditions:
```ts
stopWhen: [
  hasToolCall('weather'),
  hasToolCall('finalAnswer'),
  stepCountIs(5),
]
```

Agent pattern with final answer:
```ts
stopWhen: hasToolCall('finalAnswer')
```