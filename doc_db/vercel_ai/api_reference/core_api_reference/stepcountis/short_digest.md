## stepCountIs()

Stop condition function that halts tool-calling loops after a specified number of steps.

**Import:** `import { stepCountIs } from "ai"`

**Basic usage:**
```ts
const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: stepCountIs(3),
});
```

**Combine with other conditions:**
```ts
stopWhen: [stepCountIs(10), hasToolCall('finalAnswer')]
```

Used with `generateText()` and `streamText()` via the `stopWhen` parameter.