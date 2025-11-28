## Problem
`generateObject` and `streamObject` don't support tool calling. To combine tool calling with structured outputs, you must use `generateText` or `streamText` with the `output` option instead.

## Key Consideration
When using `output` with tool calling, structured output generation counts as an additional step in the execution flow. This affects the `stopWhen` condition.

## Solution
Adjust your `stopWhen` condition to account for the extra step. Add at least 1 to your intended step count:

```tsx
const result = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  output: Output.object({
    schema: z.object({
      summary: z.string(),
      sentiment: z.enum(['positive', 'neutral', 'negative']),
    }),
  }),
  tools: {
    analyze: tool({
      description: 'Analyze data',
      inputSchema: z.object({
        data: z.string(),
      }),
      execute: async ({ data }) => {
        return { result: 'analyzed' };
      }),
    },
  },
  stopWhen: stepCountIs(3), // tool call + tool result + structured output
  prompt: 'Analyze the data and provide a summary',
});
```

The execution flow includes: tool call → tool result → structured output generation. Plan your `stopWhen` accordingly.