## SDK Architecture

Three main components:
1. **Core**: Unified provider-agnostic API for text generation, structured objects, tool calls. Works in Node.js, Deno, Browser.
2. **UI**: Framework-agnostic hooks (`useChat`, `useCompletion`, `useObject`) for React, Vue, Svelte. Production-ready streaming utilities.
3. **RSC**: React Server Components streaming (experimental; use UI for production).

Environment compatibility matrix shows Core works everywhere, UI works in most frameworks, RSC only in Next.js App Router.

## Next.js App Router Quickstart

Setup: `pnpm create next-app@latest`, install `ai@beta @ai-sdk/react@beta zod`, set `AI_GATEWAY_API_KEY` in `.env.local`.

API route (`app/api/chat/route.ts`):
```ts
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

Key concepts: `UIMessage[]` contains metadata (timestamps, sender info), `convertToModelMessages()` strips it for model, `toUIMessageStreamResponse()` streams result.

UI component (`app/page.tsx`):
```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            if (part.type === 'text') return <div key={i}>{part.text}</div>;
          })}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </div>
  );
}
```

`useChat()` provides `messages` (array with id, role, parts) and `sendMessage()`. Message `parts` preserve generation order (text, reasoning, tool calls, etc.).

### Tools

Add to route handler:
```ts
import { tool, stepCountIs } from 'ai';
import { z } from 'zod';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),
  tools: {
    weather: tool({
      description: 'Get weather in location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('Location'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
    convertFahrenheitToCelsius: tool({
      description: 'Convert fahrenheit to celsius',
      inputSchema: z.object({
        temperature: z.number().describe('Temperature in fahrenheit'),
      }),
      execute: async ({ temperature }) => {
        const celsius = Math.round((temperature - 32) * (5 / 9));
        return { celsius };
      },
    }),
  },
});
```

Tool parts appear as `tool-{toolName}` in message.parts. `stopWhen: stepCountIs(5)` allows up to 5 steps, enabling multi-step tool calling where model uses tool results to trigger follow-up generations.

Update UI to display tool results:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return <pre key={i}>{JSON.stringify(part, null, 2)}</pre>;
```

## Next.js Pages Router

Identical to App Router except component goes in `pages/index.tsx` instead of `app/page.tsx`. Route handler is `pages/api/chat.ts`.

## Node.js Quickstart

Setup: `mkdir my-ai-app && pnpm init`, install `ai@beta zod dotenv`, create `.env` with `AI_GATEWAY_API_KEY`.

CLI chat agent (`index.ts`):
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

Uses `streamText()` to stream responses, maintains message history, iterates over `result.textStream` to print tokens in real-time.

### Tools in Node.js

```ts
import { tool } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  tools: {
    weather: tool({
      description: 'Get weather in location (fahrenheit)',
      inputSchema: z.object({
        location: z.string().describe('Location'),
      }),
      execute: async ({ location }) => {
        const temperature = Math.round(Math.random() * (90 - 32) + 32);
        return { location, temperature };
      },
    }),
  },
  stopWhen: stepCountIs(5),
  onStepFinish: async ({ toolResults }) => {
    if (toolResults.length) {
      console.log(JSON.stringify(toolResults, null, 2));
    }
  },
});

console.log(await result.toolCalls);
console.log(await result.toolResults);
```

Access tool calls/results via `result.toolCalls` and `result.toolResults`. `onStepFinish` callback fires after each step.

## Svelte Quickstart

Setup: `npx sv create my-ai-app`, install `ai@beta @ai-sdk/svelte@beta zod`, set `AI_GATEWAY_API_KEY` in `.env.local`.

API route (`src/routes/api/chat/+server.ts`):
```ts
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

UI component (`src/routes/+page.svelte`):
```svelte
<script lang="ts">
  import { Chat } from '@ai-sdk/svelte';
  let input = '';
  const chat = new Chat({});
  
  function handleSubmit(event) {
    event.preventDefault();
    chat.sendMessage({ text: input });
    input = '';
  }
</script>

<main>
  <ul>
    {#each chat.messages as message}
      <li>
        <div>{message.role}</div>
        {#each message.parts as part}
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

Uses `Chat` class (not hooks like React). Svelte-specific: class arguments aren't reactive by default - pass references with getters. Destructuring class properties copies by value, disconnecting from instance. Use `createAIContext()` in root layout for cross-component synchronization.

Tools work same as other frameworks. Tool parts named `tool-{toolName}`.

## Nuxt/Vue Quickstart

Setup: `pnpm create nuxt my-ai-app`, install `ai@beta @ai-sdk/vue@beta zod`, configure in `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    aiGatewayApiKey: '',
  },
});
```

Set `NUXT_AI_GATEWAY_API_KEY` in `.env`.

API route (`server/api/chat.ts`):
```ts
import { streamText, UIMessage, convertToModelMessages, createGateway } from 'ai';

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().aiGatewayApiKey;
  if (!apiKey) throw new Error('Missing AI Gateway API key');
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

UI component (`pages/index.vue`):
```vue
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

Uses `Chat` class. Tools and multi-step calling work identically to other frameworks.

## Expo Quickstart

Setup: `pnpm create expo-app@latest my-ai-app`, install `ai@beta @ai-sdk/react@beta zod`, set `AI_GATEWAY_API_KEY` in `.env.local`.

API route (`app/api/chat+api.ts`):
```tsx
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
```

UI component (`app/(tabs)/index.tsx`):
```tsx
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useState } from 'react';
import { View, TextInput, ScrollView, Text, SafeAreaView } from 'react-native';

export default function App() {
  const [input, setInput] = useState('');
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  if (error) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <View style={{ height: '95%', display: 'flex', flexDirection: 'column', paddingHorizontal: 8 }}>
        <ScrollView style={{ flex: 1 }}>
          {messages.map(m => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <Text style={{ fontWeight: 700 }}>{m.role}</Text>
              {m.parts.map((part, i) => {
                if (part.type === 'text') return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
              })}
            </View>
          ))}
        </ScrollView>
        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{ backgroundColor: 'white', padding: 8 }}
            placeholder="Say something..."
            value={input}
            onChange={e => setInput(e.nativeEvent.text)}
            onSubmitEditing={e => {
              e.preventDefault();
              sendMessage({ text: input });
              setInput('');
            }}
            autoFocus={true}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
```

Uses `useChat()` with `DefaultChatTransport` and `expo/fetch` (required for streaming in Expo 52+). API URL helper:
```ts
import Constants from 'expo-constants';

export const generateAPIUrl = (relativePath: string) => {
  const origin = Constants.experienceUrl.replace('exp://', 'http://');
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  
  if (process.env.NODE_ENV === 'development') {
    return origin.concat(path);
  }
  
  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL environment variable is not defined');
  }
  
  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};
```

Requires polyfills for `structuredClone` and text encoding. Install `@ungap/structured-clone @stardazed/streams-text-encoding`, create `polyfills.js`:
```ts
import { Platform } from 'react-native';
import structuredClone from '@ungap/structured-clone';

if (Platform.OS !== 'web') {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import('react-native/Libraries/Utilities/PolyfillFunctions');
    const { TextEncoderStream, TextDecoderStream } = await import('@stardazed/streams-text-encoding');
    
    if (!('structuredClone' in global)) {
      polyfillGlobal('structuredClone', () => structuredClone);
    }
    polyfillGlobal('TextEncoderStream', () => TextEncoderStream);
    polyfillGlobal('TextDecoderStream', () => TextDecoderStream);
  };
  setupPolyfills();
}
```

Import in `_layout.tsx`.

## Provider Configuration

Default provider is Vercel AI Gateway. Access models with string: `model: 'anthropic/claude-sonnet-4.5'`

Explicit import:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

For other providers (e.g., OpenAI):
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```