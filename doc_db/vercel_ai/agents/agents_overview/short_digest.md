## Agents

Agents are LLMs that use tools in a loop to accomplish tasks through three components: LLMs (process input and decide actions), Tools (extend capabilities), and Loop (orchestrates execution via context management and stopping conditions).

### ToolLoopAgent Class

```ts
const weatherAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    weather: tool({
      description: 'Get the weather in a location (in Fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert temperature from Fahrenheit to Celsius',
      inputSchema: z.object({
        temperature: z.number().describe('Temperature in Fahrenheit'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
  stopWhen: stepCountIs(20),
});

const result = await weatherAgent.generate({
  prompt: 'What is the weather in San Francisco in celsius?',
});
```

The Agent class reduces boilerplate, improves reusability, and simplifies maintenance. Use core functions (`generateText`, `streamText`) for explicit control in complex workflows. For deterministic outcomes, use structured workflow patterns with conditional statements and explicit control flow.