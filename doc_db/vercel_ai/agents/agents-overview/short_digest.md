## Agents

Agents are LLMs that use tools in a loop to accomplish tasks. The ToolLoopAgent class manages three components: LLMs (decide next action), tools (extend capabilities), and loop (context management and stopping conditions).

```ts
const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location (in Fahrenheit)',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ location, temperature: 72 }),
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert temperature from Fahrenheit to Celsius',
      inputSchema: z.object({ temperature: z.number() }),
      execute: async ({ temperature }) => ({ celsius: Math.round((temperature - 32) * (5 / 9)) }),
    }),
  },
  stopWhen: stepCountIs(20),
});

const result = await weatherAgent.generate({
  prompt: 'What is the weather in San Francisco in celsius?',
});
```

Use Agent class for most cases (reduces boilerplate, improves reusability). Use core functions (`generateText`, `streamText`) for explicit control in complex workflows. Agents are non-deterministic; use structured patterns with conditional statements for reliable outcomes.