## stepCountIs()

Creates a stop condition that halts a tool-calling loop when the number of steps reaches a specified count.

### Purpose
Used with the `stopWhen` parameter in `generateText()` and `streamText()` to control tool-calling loop termination based on step count.

### Import
```ts
import { stepCountIs } from "ai";
```

### API Signature

**Parameters:**
- `count` (number): The maximum number of steps to execute before stopping the tool-calling loop.

**Returns:** A `StopCondition` function that returns `true` when the step count reaches the specified number.

### Usage Examples

**Basic usage - stop after 3 steps:**
```ts
import { generateText, stepCountIs } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: stepCountIs(3),
});
```

**Combining multiple stop conditions:**
```ts
import { generateText, stepCountIs, hasToolCall } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: yourTools,
  stopWhen: [stepCountIs(10), hasToolCall('finalAnswer')],
});
```

When multiple conditions are provided in an array, the loop stops when any condition is met (OR logic).

### Related Functions
- `hasToolCall()` - Stop condition based on specific tool calls
- `generateText()` - Core function that accepts stopWhen parameter
- `streamText()` - Streaming variant that accepts stopWhen parameter