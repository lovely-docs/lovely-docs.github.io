## Svelte Quickstart

Setup: `npx sv create my-ai-app && pnpm add -D ai@beta @ai-sdk/svelte@beta zod`

API route with streaming:
```ts
import { streamText, convertToModelMessages, createGateway } from 'ai';
const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY });
export async function POST({ request }) {
  const { messages } = await request.json();
  return streamText({
    model: gateway('anthropic/claude-sonnet-4.5'),
    messages: convertToModelMessages(messages),
  }).toUIMessageStreamResponse();
}
```

UI component:
```svelte
<script>
  import { Chat } from '@ai-sdk/svelte';
  let input = '', chat = new Chat({});
  function handleSubmit(e) {
    e.preventDefault();
    chat.sendMessage({ text: input });
    input = '';
  }
</script>
<ul>
  {#each chat.messages as message}
    <li>{message.role}
      {#each message.parts as part}
        {#if part.type === 'text'}{part.text}{/if}
      {/each}
    </li>
  {/each}
</ul>
<form onsubmit={handleSubmit}>
  <input bind:value={input} />
  <button>Send</button>
</form>
```

Tools with multi-step execution:
```ts
streamText({
  model: gateway('anthropic/claude-sonnet-4.5'),
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),
  tools: {
    weather: tool({
      description: 'Get weather (fahrenheit)',
      inputSchema: z.object({ location: z.string() }),
      execute: async ({ location }) => ({ location, temperature: 72 }),
    }),
  },
})
```

Svelte-specific: Classes aren't reactive by default - pass references for reactive args. Don't destructure class properties. Use `createAIContext()` for cross-component synchronization.