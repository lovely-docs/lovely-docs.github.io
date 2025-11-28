## Stop Conditions

Use `stopWhen` parameter with built-in conditions (`stepCountIs(n)`, `hasToolCall('toolName')`) or custom `StopCondition` functions that receive `{ steps }`:

```ts
stopWhen: [stepCountIs(20), hasToolCall('someTool')]

const hasAnswer: StopCondition<typeof tools> = ({ steps }) => 
  steps.some(step => step.text?.includes('ANSWER:')) ?? false;
```

## Prepare Step

`prepareStep` callback runs before each step with `{ model, stepNumber, steps, messages }`, returning overrides:

```ts
// Dynamic model selection
prepareStep: async ({ stepNumber, messages }) => {
  if (stepNumber > 2 && messages.length > 10) {
    return { model: 'anthropic/claude-sonnet-4.5' };
  }
  return {};
}

// Tool selection by phase
prepareStep: async ({ stepNumber }) => {
  if (stepNumber <= 2) return { activeTools: ['search'], toolChoice: 'required' };
  if (stepNumber <= 5) return { activeTools: ['analyze'] };
  return { activeTools: ['summarize'] };
}

// Force specific tool
prepareStep: async ({ stepNumber }) => {
  if (stepNumber === 0) return { toolChoice: { type: 'tool', toolName: 'search' } };
  return {};
}

// Message transformation
prepareStep: async ({ messages }) => {
  const processed = messages.map(msg => 
    msg.role === 'tool' && msg.content.length > 1000 
      ? { ...msg, content: summarizeToolResult(msg.content) }
      : msg
  );
  return { messages: processed };
}
```

## Manual Loop Control

Use `generateText`/`streamText` for complete control:

```ts
const messages: ModelMessage[] = [{ role: 'user', content: '...' }];
let step = 0;
while (step < 10) {
  const result = await generateText({ model, messages, tools });
  messages.push(...result.response.messages);
  if (result.text) break;
  step++;
}
```