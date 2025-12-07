## Setup
Install `ai@beta @ai-sdk/vue@beta zod`, set `NUXT_AI_GATEWAY_API_KEY` in `.env` and configure in `nuxt.config.ts`.

## API Route (`server/api/chat.ts`)
```typescript
import { streamText, UIMessage, convertToModelMessages, createGateway } from 'ai';

export default defineLazyEventHandler(async () => {
  const gateway = createGateway({ apiKey: useRuntimeConfig().aiGatewayApiKey });
  return defineEventHandler(async (event) => {
    const { messages } = await readBody(event);
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
<script setup>
import { Chat } from "@ai-sdk/vue";
import { ref } from "vue";
const input = ref("");
const chat = new Chat({});
const handleSubmit = (e) => {
  e.preventDefault();
  chat.sendMessage({ text: input.value });
  input.value = "";
};
</script>
<template>
  <div>
    <div v-for="m in chat.messages" :key="m.id">
      {{ m.role === "user" ? "User: " : "AI: " }}
      <div v-for="part in m.parts" :key="part.type">
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
Add to `streamText()`:
```typescript
tools: {
  weather: tool({
    description: 'Get weather in location (fahrenheit)',
    inputSchema: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ location, temperature: Math.round(Math.random() * 58 + 32) }),
  }),
  convertFahrenheitToCelsius: tool({
    description: 'Convert fahrenheit to celsius',
    inputSchema: z.object({ temperature: z.number() }),
    execute: async ({ temperature }) => ({ celsius: Math.round((temperature - 32) * 5/9) }),
  }),
}
```

Display tool results in UI with `<pre v-if="part.type === 'tool-weather'">{{ JSON.stringify(part, null, 2) }}</pre>`

## Multi-Step Tools
Add `stopWhen: stepCountIs(5)` to allow model to use tool results across multiple steps for complex interactions.