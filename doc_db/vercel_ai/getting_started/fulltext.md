

## Pages

### navigating-the-library
Three SDK components: Core (unified LLM API for any JS env), UI (streaming chat/generative UI hooks for React/Vue/Svelte), RSC (server-to-client streaming for Next.js App Router, experimental). Compatibility varies by framework and environment.

## Overview

The AI SDK consists of three main parts:

1. **AI SDK Core**: Unified, provider-agnostic API for generating text, structured objects, and tool calls with LLMs. Works in any JS environment (Node.js, Deno, Browser).

2. **AI SDK UI**: Framework-agnostic hooks for building chat and generative UIs. Supports React & Next.js, Vue & Nuxt, Svelte & SvelteKit. Provides production-ready utilities like `useChat`, `useCompletion`, `useObject` for handling common AI interaction patterns.

3. **AI SDK RSC**: Stream generative UIs from server to client using React Server Components. Currently experimental; recommended to use AI SDK UI for production instead.

## Environment Compatibility

| Environment | Core | UI | RSC |
|---|---|---|---|
| Node.js/Deno | ✓ | ✗ | ✗ |
| Vue/Nuxt | ✓ | ✓ | ✗ |
| Svelte/SvelteKit | ✓ | ✓ | ✗ |
| Next.js Pages Router | ✓ | ✓ | ✗ |
| Next.js App Router | ✓ | ✓ | ✓ |

## AI SDK UI Framework Support

| Function | React | Svelte | Vue.js |
|---|---|---|---|
| `useChat` | ✓ | ✓ | ✓ |
| `useChat` tool calling | ✓ | ✓ | ✗ |
| `useCompletion` | ✓ | ✓ | ✓ |
| `useObject` | ✓ | ✗ | ✗ |

## When to Use Each

**AI SDK Core**: Any JavaScript environment where you need to call LLMs with a unified API.

**AI SDK UI**: Building production-ready AI-native applications with streaming chat and generative UI. Offers full streaming support, common interaction patterns, and cross-framework compatibility.

**AI SDK RSC**: Streaming generative UIs from server to client in Next.js App Router. Has limitations: no stream cancellation via Server Actions, potential quadratic data transfer with `createStreamableUI`, component re-mounting/flickering during streaming. Use AI SDK UI for production instead.


### next.js_app_router_quickstart
Build streaming chat app with Next.js App Router: setup with Vercel AI Gateway, create POST route with streamText(), wire useChat() hook to UI, add tools with Zod schemas and multi-step execution via stopWhen.

## Setup

Prerequisites: Node.js 18+, pnpm, Vercel AI Gateway API key.

Create Next.js app with App Router and Tailwind CSS:
```bash
pnpm create next-app@latest my-ai-app
cd my-ai-app
```

Install dependencies:
```bash
pnpm add ai@beta @ai-sdk/react@beta zod
```

Configure API key in `.env.local`:
```env
AI_GATEWAY_API_KEY=xxxxxxxxx
```

## Basic Chat Route Handler

Create `app/api/chat/route.ts`:
```tsx
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

Key concepts:
- `streamText()` accepts model provider and messages array
- `UIMessage[]` contains conversation history with metadata (timestamps, sender info)
- `convertToModelMessages()` strips UI metadata to convert `UIMessage[]` to `ModelMessage[]` format
- `toUIMessageStreamResponse()` converts result to streamed response

## Provider Configuration

Default uses Vercel AI Gateway (included in `ai` package). Access models with string:
```ts
model: 'anthropic/claude-sonnet-4.5'
```

Or explicitly:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers, install and import:
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## Chat UI

Create `app/page.tsx`:
```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

`useChat()` hook provides:
- `messages` - array of chat messages with `id`, `role`, `parts` properties
- `sendMessage()` - function to send message to `/api/chat` endpoint
- Message `parts` array contains ordered components of model output (text, reasoning tokens, etc.)

Run with `pnpm run dev` and visit http://localhost:3000.

## Tools

Tools allow LLMs to invoke actions and receive results for next response. Example: weather tool.

Update `app/api/chat/route.ts`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
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

  return result.toUIMessageStreamResponse();
}
```

Tool definition includes:
- `description` - helps model understand when to use it
- `inputSchema` - Zod schema defining required inputs; model extracts from context or asks user
- `execute` - async function running on server; can fetch from external APIs

`stopWhen: stepCountIs(5)` allows model to use up to 5 steps, enabling multi-step tool calls where model uses tool results to answer original query.

Tool parts in message are named `tool-{toolName}`, e.g., `tool-weather`.

Update `app/page.tsx` to display tool results:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

Example flow: "What's the weather in New York in celsius?" → model calls weather tool → displays result → calls temperature conversion tool → provides natural language response.

### next.js_pages_router_quickstart
Build a streaming chat app with Next.js Pages Router using AI SDK: create route handler with streamText, wire useChat hook to UI, add tools with Zod schemas and execute functions, enable multi-step tool calls with stopWhen.

## Setup

Create a Next.js app with Pages Router (not App Router):
```bash
pnpm create next-app@latest my-ai-app
cd my-ai-app
```

Install dependencies:
```bash
pnpm add ai@beta @ai-sdk/react@beta zod@beta
```

Configure API key in `.env.local`:
```env
AI_GATEWAY_API_KEY=your_key_here
```

## Route Handler

Create `app/api/chat/route.ts`:
```tsx
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

The handler extracts messages from request, calls `streamText` with a model and converted messages (UIMessage → ModelMessage strips metadata), and returns the streamed response via `toUIMessageStreamResponse()`.

## Provider Selection

Default uses Vercel AI Gateway (string model references like `'anthropic/claude-sonnet-4.5'`). Can also use:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers, install their package:
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## UI Component

Create `pages/index.tsx`:
```tsx
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();
  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
```

`useChat` hook provides `messages` (array with id, role, parts) and `sendMessage(text)`. Messages contain `parts` array where each part has a type (text, tool calls, etc.). Run with `pnpm run dev` and visit http://localhost:3000.

## Tools

Add tools to route handler to let the model invoke actions:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
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

  return result.toUIMessageStreamResponse();
}
```

Tool parts appear in message.parts as `tool-{toolName}`. Update UI to display them:
```tsx
case 'tool-weather':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

## Multi-Step Tool Calls

By default, generation stops after first step when there are tool results. Enable multi-step with `stopWhen`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
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

Update UI to handle new tool part:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

With `stopWhen: stepCountIs(5)`, the model can use up to 5 steps, allowing it to call multiple tools in sequence and use their results to answer questions.

### svelte-quickstart
Build streaming chat UI in Svelte with AI SDK: setup gateway provider, create POST endpoint with streamText(), use Chat class in component, add tools with multi-step execution via stopWhen, handle tool parts in UI; Svelte classes require reference-based reactivity and context for synchronization.

## Svelte Quickstart for AI SDK

Build a streaming chat interface with Svelte using the AI SDK and Vercel AI Gateway.

### Prerequisites
- Node.js 18+, pnpm
- Vercel AI Gateway API key

### Setup
```bash
npx sv create my-ai-app
cd my-ai-app
pnpm add -D ai@beta @ai-sdk/svelte@beta zod
```

Create `.env.local`:
```env
AI_GATEWAY_API_KEY=your_key
```

### API Route (`src/routes/api/chat/+server.ts`)
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

Key concepts:
- `createGateway()` creates provider instance
- `streamText()` streams model responses
- `convertToModelMessages()` converts UIMessage[] to ModelMessage[] (strips metadata)
- `toUIMessageStreamResponse()` converts result to streamed response

### UI Component (`src/routes/+page.svelte`)
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

Chat class provides:
- `messages` - array of message objects with `id`, `role`, `parts`
- `sendMessage()` - send message to API
- Message parts preserve sequence of model outputs (text, reasoning, etc.)

### Tools

Define tools in API route:
```ts
const result = streamText({
  model: gateway('anthropic/claude-sonnet-4.5'),
  messages: convertToModelMessages(messages),
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

Tool parts are named `tool-{toolName}` and appear in `message.parts`.

### Multi-Step Tool Calls

Enable model to use tool results to generate follow-up responses:
```ts
const result = streamText({
  model: gateway('anthropic/claude-sonnet-4.5'),
  messages: convertToModelMessages(messages),
  stopWhen: stepCountIs(5),  // Allow up to 5 steps
  tools: { /* ... */ },
});
```

Update UI to display tool parts:
```svelte
{#if part.type === 'text'}
  <div>{part.text}</div>
{:else if part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'}
  <pre>{JSON.stringify(part, null, 2)}</pre>
{/if}
```

### Svelte vs React Differences

1. **State management**: Svelte uses classes (Chat) vs React hooks (useChat)
2. **Reactivity**: Arguments to classes aren't reactive by default - pass references:
```svelte
let chat = new Chat({
  get id() { return id; }  // reactive
});
```
3. **Destructuring**: Destructuring class properties copies by value, disconnecting from instance
4. **Synchronization**: Use `createAIContext()` in root layout for instance synchronization across components

### Running
```bash
pnpm run dev
# Open http://localhost:5173
```

### nuxt_quickstart
Nuxt quickstart: set up API route with streamText/convertToModelMessages/createGateway, create Chat UI component with useChat hook, add tools with tool()/zod schemas, enable multi-step tool calls with stopWhen.

## Setup

Create a Nuxt app with `pnpm create nuxt my-ai-app`, then install dependencies:
```
pnpm add ai@beta @ai-sdk/vue@beta zod
```

Configure API key in `.env`:
```env
NUXT_AI_GATEWAY_API_KEY=your_key
```

And in `nuxt.config.ts`:
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    aiGatewayApiKey: '',
  },
});
```

## API Route

Create `server/api/chat.ts`:
```typescript
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

Key points:
- `createGateway()` creates a provider instance
- Extract `messages` from request body (UIMessage[] type with metadata)
- `streamText()` accepts model and messages, returns StreamTextResult
- `convertToModelMessages()` strips UI metadata to convert UIMessage[] to ModelMessage[]
- `toUIMessageStreamResponse()` converts result to streamed response

## UI Component

Create `pages/index.vue`:
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

Chat hook provides:
- `messages` - array of objects with `id`, `role`, `parts` properties
- `sendMessage()` - function to send message to API
- Message `parts` array contains ordered components (text, reasoning, etc.) in generation order

Run with `pnpm run dev` and visit http://localhost:3000.

## Tools

Add tools to `streamText()` config:
```typescript
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

Tool parts appear in message.parts as `tool-{toolName}`. Update UI to display them:
```typescript
<pre v-if="part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'">
  {{ JSON.stringify(part, null, 2) }}
</pre>
```

## Multi-Step Tool Calls

Enable with `stopWhen: stepCountIs(5)` in `streamText()` config. This allows the model to use tool results to generate follow-up responses across multiple steps (up to 5 in this example), enabling complex interactions where the model gathers information and uses it to answer the original query.

## Provider Options

Default uses Vercel AI Gateway via string: `model: 'anthropic/claude-sonnet-4.5'`

Or explicitly:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

For other providers like OpenAI:
```
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

### node.js_quickstart
Node.js quickstart: set up with ai@beta/zod/dotenv, create streaming chat agent with streamText(), configure providers (default Vercel AI Gateway), add tools with Zod schemas and execute functions, enable multi-step tool calling with stopWhen/stepCountIs.

## Setup

Prerequisites: Node.js 18+, pnpm, Vercel AI Gateway API key.

Create project:
```bash
mkdir my-ai-app && cd my-ai-app && pnpm init
pnpm add ai@beta zod dotenv
pnpm add -D @types/node tsx typescript
```

Create `.env`:
```env
AI_GATEWAY_API_KEY=your_key
```

## Basic Chat Agent

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

Run with `pnpm tsx index.ts`. The code uses `streamText()` to stream responses, maintains message history for context, and iterates over `result.textStream` to print tokens in real-time.

## Provider Configuration

Default provider is Vercel AI Gateway. Access models with string: `model: 'anthropic/claude-sonnet-4.5'`

Equivalent explicit imports:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');

// or
import { gateway } from '@ai-sdk/gateway';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers (e.g., OpenAI):
```bash
pnpm add @ai-sdk/openai@beta
```
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## Tools

Tools allow LLMs to invoke actions and receive results. Add tools to `streamText()`:

```ts
import { tool } from 'ai';
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

Tool definition requires: description (when to use), inputSchema (Zod schema for parameters), execute (async function that runs on server).

Access tool calls and results:
```ts
console.log(await result.toolCalls);
console.log(await result.toolResults);
```

## Multi-Step Tool Calls

Enable agent to use tool results to answer questions with `stopWhen` and `onStepFinish`:

```ts
import { stepCountIs } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  messages,
  tools: { /* ... */ },
  stopWhen: stepCountIs(5),
  onStepFinish: async ({ toolResults }) => {
    if (toolResults.length) {
      console.log(JSON.stringify(toolResults, null, 2));
    }
  },
});
```

`stopWhen: stepCountIs(5)` allows up to 5 steps. Agent can call multiple tools sequentially. Example with two tools:

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

Query "What's the weather in New York in celsius?" triggers: weather tool call → temperature conversion tool call → natural language response.

### expo_quickstart
Build streaming chat UI with Expo: setup project, create API route with streamText(), use useChat hook with expo/fetch transport, display message parts, add tools with Zod schemas and execute functions, enable multi-step calls with stopWhen, add polyfills for structuredClone and text encoding.

## Expo Quickstart

Build a streaming chat UI with Expo and the AI SDK.

### Prerequisites
- Node.js 18+, pnpm
- Vercel AI Gateway API key

### Setup
```bash
pnpm create expo-app@latest my-ai-app
cd my-ai-app
pnpm add ai@beta @ai-sdk/react@beta zod
```

Create `.env.local`:
```env
AI_GATEWAY_API_KEY=xxxxxxxxx
```

### API Route
Create `app/api/chat+api.ts`:
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

The `streamText` function accepts model and messages, returns `StreamTextResult` with `toUIMessageStreamResponse()` method to stream to client.

### UI with useChat Hook
Update `app/(tabs)/index.tsx`:
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
                switch (part.type) {
                  case 'text':
                    return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                }
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

`useChat` hook provides `messages` (array with id, role, parts), `sendMessage` function, and `error`. Messages have `parts` array containing text, reasoning tokens, and tool results in generation order. Use `expo/fetch` instead of native fetch for streaming (requires Expo 52+).

### API URL Generator
Create `utils.ts`:
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

Handles URL generation for dev and production. Set `EXPO_PUBLIC_API_BASE_URL` before deploying.

### Run
```bash
pnpm expo
```
Open http://localhost:8081

### Tools
Add tools to enable LLM to invoke actions. Update `app/api/chat+api.ts`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
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
  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
```

Tool definition includes description, `inputSchema` (Zod schema for inputs), and async `execute` function. Tool parts are named `tool-{toolName}`. `stopWhen: stepCountIs(5)` allows model to use up to 5 steps, enabling multi-step tool calls where model can use tool results to trigger additional generations.

Update UI to display tool results:
```tsx
{m.parts.map((part, i) => {
  switch (part.type) {
    case 'text':
      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
    case 'tool-weather':
    case 'tool-convertFahrenheitToCelsius':
      return <Text key={`${m.id}-${i}`}>{JSON.stringify(part, null, 2)}</Text>;
  }
})}
```

### Polyfills
For missing runtime functions, install:
```bash
pnpm add @ungap/structured-clone @stardazed/streams-text-encoding
```

Create `polyfills.js`:
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
export {};
```

Import in `_layout.tsx`:
```ts
import '@/polyfills';
```

