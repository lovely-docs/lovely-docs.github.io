## SDK Architecture

**AI SDK Core**: Unified LLM API for text generation, structured objects, and tool calls. Works in any JavaScript environment (Node.js, Deno, Browser).

**AI SDK UI**: Framework-agnostic hooks for streaming chat and generative UIs. Supports React, Svelte, Vue.js with functions like `useChat`, `useCompletion`, `useObject`.

**AI SDK RSC**: Experimental server-to-client streaming via React Server Components for Next.js App Router only.

## Quick Start Patterns

All frameworks follow this pattern:

1. **API Route**: Use `streamText()` with model and messages, return `toUIMessageStreamResponse()`
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
});
return result.toUIMessageStreamResponse();
```

2. **UI Component**: Use framework hook (`useChat` for React/Svelte/Vue, `Chat` class for Svelte/Vue/Nuxt)
```ts
const { messages, sendMessage } = useChat();
// or
const chat = new Chat({});
```

3. **Message Structure**: Messages have `id`, `role`, and `parts` array where each part has `type` ('text', 'tool-{name}', etc.)

## Provider Configuration

Default: Vercel AI Gateway with string model references
```ts
model: 'anthropic/claude-sonnet-4.5'
```

Alternative providers require installation:
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## Tools

Define with `tool()` function and Zod schemas:
```ts
tools: {
  weather: tool({
    description: 'Get weather in location',
    inputSchema: z.object({
      location: z.string().describe('Location'),
    }),
    execute: async ({ location }) => ({ temperature: 72 }),
  }),
}
```

Tool results appear in `message.parts` as `tool-{toolName}` type.

## Multi-Step Tool Calls

Enable with `stopWhen: stepCountIs(n)` to allow model to use tool results for follow-up generations:
```ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),
  tools: { /* tools */ },
});
```

Default is `stepCountIs(1)` (single step only).

## Framework-Specific Notes

**Next.js App Router**: Use `app/api/chat/route.ts` with `POST` handler
**Next.js Pages Router**: Use `pages/api/chat.ts` with `POST` handler
**Svelte/SvelteKit**: Use `Chat` class instead of hooks; pass reactive references not values; use `createAIContext()` for instance sync
**Vue/Nuxt**: Use `Chat` class; configure API key in runtime config
**Node.js**: Use `streamText()` with `textStream` iterator for CLI agents
**Expo**: Use `DefaultChatTransport` with `expo/fetch` for streaming support; requires polyfills for `structuredClone`, `TextEncoderStream`, `TextDecoderStream`