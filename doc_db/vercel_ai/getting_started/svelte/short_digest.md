## Svelte Quickstart

Setup: `npx sv create my-ai-app`, `pnpm add -D ai@beta @ai-sdk/svelte@beta zod`, add `AI_GATEWAY_API_KEY` to `.env.local`

**API Route** (`src/routes/api/chat/+server.ts`):
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

**UI Component** (`src/routes/+page.svelte`):
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
        {#each message.parts as part, partIndex (partIndex)}
          {#if part.type === 'text'}
            <div>{part.text}</div>
          {/if}
        {/each}
      </li>
    {/each}
  </ul>
  <form onsubmit={handleSubmit}>
    <input bind:value={input} />
    <button type="submit">Send</button>
  </form>
</main>
```

**Tools** with multi-step execution:
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
  },
});
```

Tool parts appear as `tool-{toolName}` in `message.parts`. Display with:
```svelte
{:else if part.type === 'tool-weather'}
  <pre>{JSON.stringify(part, null, 2)}</pre>
{/if}
```

**Svelte vs React**: Uses classes instead of hooks. Pass reactive arguments by reference, don't destructure class properties, use `createAIContext()` for instance synchronization.