## Svelte Quickstart

Build a streaming chat interface with Svelte using the AI SDK and Vercel AI Gateway.

### Prerequisites
- Node.js 18+ and pnpm
- Vercel AI Gateway API key

### Setup
1. Create SvelteKit app: `npx sv create my-ai-app`
2. Install dependencies: `pnpm add -D ai@beta @ai-sdk/svelte@beta zod`
3. Create `.env.local` with `AI_GATEWAY_API_KEY=your_key`

### API Route (`src/routes/api/chat/+server.ts`)
```tsx
import { streamText, convertToModelMessages, createGateway } from 'ai';
import { AI_GATEWAY_API_KEY } from '$env/static/private';

const gateway = createGateway({ apiKey: AI_GATEWAY_API_KEY });

export async function POST({ request }) {
  const { messages } = await request.json();
  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.5'),
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

Key concepts:
- `createGateway()` creates provider instance
- `streamText()` streams model responses
- `convertToModelMessages()` converts UIMessage[] to ModelMessage[] (strips UI metadata)
- `toUIMessageStreamResponse()` converts result to streamed response

### UI Component (`src/routes/+page.svelte`)
```svelte
<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  let input = '';
  const chat = new Chat({});
  
  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    chat.sendMessage({ text: input });
    input = '';
  }
</script>

<main>
  <ul>
    {#each chat.messages as message, messageIndex (messageIndex)}
      <li>
        <div>{message.role}</div>
        <div>
          {#each message.parts as part, partIndex (partIndex)}
            {#if part.type === 'text'}
              <div>{part.text}</div>
            {/if}
          {/each}
        </div>
      </li>
    {/each}
  </ul>
  <form onsubmit={handleSubmit}>
    <input bind:value={input} />
    <button type="submit">Send</button>
  </form>
</main>
```

Chat class provides:
- `messages` - array of message objects with `id`, `role`, `parts` properties
- `sendMessage()` - send message to API
- Message parts preserve sequence of model outputs (text, reasoning tokens, etc.)

### Provider Configuration
Default uses Vercel AI Gateway with string model references: `model: 'anthropic/claude-sonnet-4.5'`

Alternative providers require installation and import:
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

### Tools
Add tool calling to enable discrete tasks and external API integration:

```tsx
import { tool, stepCountIs } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: gateway('anthropic/claude-sonnet-4.5'),
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),
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
});
```

Tool parts are named `tool-{toolName}` and appear in `message.parts` array. Display them in UI:
```svelte
{:else if part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'}
  <pre>{JSON.stringify(part, null, 2)}</pre>
{/if}
```

`stopWhen: stepCountIs(5)` enables multi-step tool calls - model can use tool results to trigger additional generations up to 5 steps.

### Svelte vs React Differences

1. **State management**: Svelte uses classes (Chat) instead of hooks (useChat)

2. **Reactive arguments**: Pass references, not values:
```svelte
// Won't work - id copied by value
let chat = new Chat({ id });

// Works - id passed by reference
let chat = new Chat({
  get id() {
    return id;
  },
});
```

3. **No destructuring class properties**: Destructuring copies by value and disconnects from instance:
```svelte
const chat = new Chat({});
let { messages } = chat; // messages won't update when chat.messages changes
```

4. **Instance synchronization**: Use `createAIContext()` in root layout to synchronize instances with same `id`:
```svelte
<script>
  import { createAIContext } from '@ai-sdk/svelte';
  let { children } = $props();
  createAIContext();
</script>
{@render children()}
```

### Run Application
`pnpm run dev` then visit http://localhost:5173