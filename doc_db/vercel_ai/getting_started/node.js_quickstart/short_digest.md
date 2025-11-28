## Node.js Quickstart

Setup: Install `ai@beta`, `zod`, `dotenv`, `@types/node`, `tsx`, `typescript`. Set `AI_GATEWAY_API_KEY` env var.

Basic chat agent with streaming:
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
    process.stdout.write('\n\n');
    messages.push({ role: 'assistant', content: fullResponse });
  }
}

main().catch(console.error);
```

Run: `pnpm tsx index.ts`

**Providers**: Default is Vercel AI Gateway. Use `model: 'anthropic/claude-sonnet-4.5'` or import other providers like `@ai-sdk/openai`.

**Tools**: Define with `tool()` and Zod schemas. Enable multi-step execution with `stopWhen: stepCountIs(5)` and `onStepFinish` callback:
```ts
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
}
```