## Setup
`pnpm create nuxt my-ai-app`, then `pnpm add ai@beta @ai-sdk/vue@beta zod`. Set `NUXT_AI_GATEWAY_API_KEY` in `.env` and configure in `nuxt.config.ts` runtime config.

## API Route (`server/api/chat.ts`)
```typescript
import { streamText, UIMessage, convertToModelMessages, createGateway } from 'ai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey;
  const gateway = createGateway({ apiKey });
  return defineEventHandler(async (event: any) => {
    const { messages }: { messages: UIMessage[] } = await readBody(event);
    const result = streamText({
      model: gateway('anthropic/claude-sonnet-4.5'),
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  });
});
```

## UI (`pages/index.vue`)
```typescript
<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";
import { ref } from "vue";
const input = ref("");
const chat = new Chat({});
const handleSubmit = (e: Event) => {
    e.preventDefault();
    chat.sendMessage({ text: input.value });
    input.value = "";
};
</script>
<template>
    <div>
        <div v-for="(m, index) in chat.messages" :key="m.id ? m.id : index">
            {{ m.role === "user" ? "User: " : "AI: " }}
            <div v-for="(part, index) in m.parts" :key="`${m.id}-${part.type}-${index}`">
                <div v-if="part.type === 'text'">{{ part.text }}</div>
            </div>
        </div>
        <form @submit="handleSubmit">
            <input v-model="input" placeholder="Say something..." />
        </form>
    </div>
</template>
```

## Tools
```typescript
tools: {
  weather: tool({
    description: 'Get the weather in a location (fahrenheit)',
    inputSchema: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ location, temperature: Math.round(Math.random() * (90 - 32) + 32) }),
  }),
}
```
Tool results appear as `tool-{toolName}` parts in messages. Enable multi-step calls with `stopWhen: stepCountIs(5)` to let the model use tool results for follow-up responses.