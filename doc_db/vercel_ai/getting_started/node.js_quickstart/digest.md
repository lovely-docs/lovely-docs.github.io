## Node.js Quickstart for AI SDK

Build a simple AI agent with streaming chat interface using Node.js and the AI SDK.

### Prerequisites
- Node.js 18+ and pnpm
- Vercel AI Gateway API key (sign up at vercel.com/ai-gateway)

### Setup
Create project directory and initialize:
```bash
mkdir my-ai-app
cd my-ai-app
pnpm init
```

Install dependencies:
```bash
pnpm add ai@beta zod dotenv
pnpm add -D @types/node tsx typescript
```

Create `.env` file with API key:
```env
AI_GATEWAY_API_KEY=your_key_here
```

### Basic Chat Agent
Create `index.ts`:
```ts
import { ModelMessage, streamText } from 'ai';
import 'dotenv/config';
import * as readline from 'node:readline/promises';

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

Run with: `pnpm tsx index.ts`

### Provider Configuration
The AI SDK uses Vercel AI Gateway as default global provider. Access models with string notation:
```ts
model: 'anthropic/claude-sonnet-4.5'
```

Or explicitly import:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers like OpenAI:
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

### Tools
Tools enable agents to perform discrete tasks and interact with external systems. Define tools with `tool()` function using Zod schemas:

```ts
import { streamText, tool } from 'ai';
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
  },
});
```

### Multi-Step Tool Calls
Enable agents to use tool results to answer questions by configuring `stopWhen` and `onStepFinish`:

```ts
import { stepCountIs } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  tools: { /* tools defined */ },
  stopWhen: stepCountIs(5),
  onStepFinish: async ({ toolResults }) => {
    if (toolResults.length) {
      console.log(JSON.stringify(toolResults, null, 2));
    }
  },
});
```

`stopWhen: stepCountIs(5)` allows up to 5 steps for generation, enabling complex multi-tool interactions. The agent will automatically send tool results back for additional generation until the stopping condition is met.

### Multiple Tools Example
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
}
```

When asking "What's the weather in New York in celsius?", the agent will call weather tool, then conversion tool, then provide natural language response.