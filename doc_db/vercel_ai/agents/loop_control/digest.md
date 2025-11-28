## Stop Conditions

Control agent loop execution with the `stopWhen` parameter. By default, agents stop after 20 steps using `stepCountIs(20)`.

Built-in conditions:
- `stepCountIs(n)` - Stop after n steps
- `hasToolCall('toolName')` - Stop after calling a specific tool

Combine multiple conditions in an array; execution stops when any condition is met:

```ts
stopWhen: [
  stepCountIs(20),
  hasToolCall('someTool'),
]
```

Create custom conditions by implementing `StopCondition<typeof tools>` that receives `{ steps }` and returns a boolean:

```ts
const hasAnswer: StopCondition<typeof tools> = ({ steps }) => {
  return steps.some(step => step.text?.includes('ANSWER:')) ?? false;
};

const budgetExceeded: StopCondition<typeof tools> = ({ steps }) => {
  const totalUsage = steps.reduce(
    (acc, step) => ({
      inputTokens: acc.inputTokens + (step.usage?.inputTokens ?? 0),
      outputTokens: acc.outputTokens + (step.usage?.outputTokens ?? 0),
    }),
    { inputTokens: 0, outputTokens: 0 },
  );
  const costEstimate = (totalUsage.inputTokens * 0.01 + totalUsage.outputTokens * 0.03) / 1000;
  return costEstimate > 0.5;
};
```

## Prepare Step

The `prepareStep` callback runs before each step and receives `{ model, stepNumber, steps, messages }`. Return an object with any settings to override (or empty object for no changes).

Dynamic model selection based on step requirements:

```ts
prepareStep: async ({ stepNumber, messages }) => {
  if (stepNumber > 2 && messages.length > 10) {
    return { model: 'anthropic/claude-sonnet-4.5' };
  }
  return {};
}
```

Context management - keep only recent messages:

```ts
prepareStep: async ({ messages }) => {
  if (messages.length > 20) {
    return {
      messages: [messages[0], ...messages.slice(-10)],
    };
  }
  return {};
}
```

Tool selection - control available tools per phase:

```ts
prepareStep: async ({ stepNumber }) => {
  if (stepNumber <= 2) {
    return { activeTools: ['search'], toolChoice: 'required' };
  }
  if (stepNumber <= 5) {
    return { activeTools: ['analyze'] };
  }
  return { activeTools: ['summarize'], toolChoice: 'required' };
}
```

Force specific tool usage:

```ts
prepareStep: async ({ stepNumber }) => {
  if (stepNumber === 0) {
    return { toolChoice: { type: 'tool', toolName: 'search' } };
  }
  if (stepNumber === 5) {
    return { toolChoice: { type: 'tool', toolName: 'summarize' } };
  }
  return {};
}
```

Message modification - transform messages before sending to model:

```ts
prepareStep: async ({ messages }) => {
  const processedMessages = messages.map(msg => {
    if (msg.role === 'tool' && msg.content.length > 1000) {
      return { ...msg, content: summarizeToolResult(msg.content) };
    }
    return msg;
  });
  return { messages: processedMessages };
}
```

## Manual Loop Control

For complete control, use `generateText` or `streamText` from AI SDK Core to implement custom loop management:

```ts
import { generateText, ModelMessage } from 'ai';

const messages: ModelMessage[] = [{ role: 'user', content: '...' }];
let step = 0;
const maxSteps = 10;

while (step < maxSteps) {
  const result = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    messages,
    tools: { /* your tools */ },
  });

  messages.push(...result.response.messages);
  if (result.text) break;
  step++;
}
```

This provides complete control over message history, step-by-step decisions, stopping conditions, dynamic tool/model selection, and error handling.