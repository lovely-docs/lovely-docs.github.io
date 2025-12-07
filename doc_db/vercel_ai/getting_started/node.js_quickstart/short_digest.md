## Setup
```bash
pnpm add ai@beta zod dotenv && pnpm add -D @types/node tsx typescript
```
Create `.env` with `AI_GATEWAY_API_KEY=your_key`

## Basic Chat
```ts
import { ModelMessage, streamText } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
const messages: ModelMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');
    messages.push({ role: 'user', content: userInput });

    const result = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      messages,
    });

    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);
```
Run: `pnpm tsx index.ts`

## Tools with Multi-Step Execution
```ts
import { tool, stepCountIs } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  tools: {
    weather: tool({
      description: 'Get the weather in a location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert a temperature in fahrenheit to celsius',
      inputSchema: z.object({
        temperature: z.number().describe('The temperature in fahrenheit to convert'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
  stopWhen: stepCountIs(5),
  onStepFinish: async ({ toolResults }) => {
    if (toolResults.length) console.log(JSON.stringify(toolResults, null, 2));
  },
});
```
Allows agent to chain tool calls (up to 5 steps) to answer complex queries like "What's the weather in New York in celsius?"