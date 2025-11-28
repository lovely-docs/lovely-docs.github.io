

## Pages

### navigating_the_library
Three SDK components with different purposes: Core (unified LLM API, any JS env), UI (streaming chat/generative UI hooks for React/Vue/Svelte), RSC (experimental server-to-client streaming for Next.js App Router); environment compatibility and feature support varies by framework.

The AI SDK consists of three main components:

**AI SDK Core**: Unified, provider-agnostic API for generating text, structured objects, and tool calls with LLMs. Works in any JavaScript environment (Node.js, Deno, Browser). Provides functions like `generateText` and `generateObject`.

**AI SDK UI**: Framework-agnostic hooks for building streaming chat and generative UIs. Supports React, Svelte, and Vue.js. Provides production-ready utilities for common AI interaction patterns (chat, completion, assistant). Supported functions:
- `useChat` (all frameworks, tool calling in React/Svelte only)
- `useCompletion` (all frameworks)
- `useObject` (React only)

**AI SDK RSC**: Streams generative UIs from server to client using React Server Components. Currently experimental; recommended for Next.js App Router only. Provides `streamUI`, `createStreamableUI`, and `createStreamableValue`. Has limitations: no stream cancellation via Server Actions, potential quadratic data transfer with `createStreamableUI`, component re-mounting causes flickering during streaming.

**Environment Compatibility**:
- Node.js/Deno: Core only
- Vue/Nuxt: Core + UI
- Svelte/SvelteKit: Core + UI
- Next.js Pages Router: Core + UI
- Next.js App Router: Core + UI + RSC

**When to use each**:
- Core: Any backend or universal JavaScript environment
- UI: Building production-ready streaming chat/generative interfaces across React, Vue, Svelte frameworks
- RSC: Experimental server-to-client streaming in Next.js App Router (not recommended for production; use UI instead)

### next.js_app_router_quickstart
Build a streaming chat app with Next.js App Router using `streamText` for the backend, `useChat` hook for the frontend, and define tools with Zod schemas for multi-step LLM interactions.

## Setup

Create a Next.js app with App Router and Tailwind CSS:
```
pnpm create next-app@latest my-ai-app
cd my-ai-app
```

Install dependencies:
```
pnpm add ai@beta @ai-sdk/react@beta zod
```

Create `.env.local` with your Vercel AI Gateway API key:
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

`streamText` accepts a model and messages array. `UIMessage` includes metadata like timestamps; convert to `ModelMessage[]` using `convertToModelMessages()` which strips UI-specific data. The function returns a `StreamTextResult` with `toUIMessageStreamResponse()` method to stream the response to the client.

## Provider Configuration

By default, the Vercel AI Gateway provider is used. Reference models as strings:
```ts
model: 'anthropic/claude-sonnet-4.5'
```

Or explicitly import:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers, install their package and create an instance:
```ts
import { openai } from '@ai-sdk/openai';
model: openai('gpt-5.1');
```

## Chat UI

Create `app/page.tsx` with the `useChat` hook:
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

`useChat` hook provides `messages` (array with `id`, `role`, `parts` properties) and `sendMessage` function. Messages are accessed via `message.parts` array where each part can be text or other types. Run with `pnpm run dev` and visit `http://localhost:3000`.

## Tools

Add tools to the `streamText` configuration:
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

Tools have a description, `inputSchema` (Zod schema for inputs), and `execute` async function. Tool parts are named `tool-{toolName}` and appear in `message.parts` array.

## Multi-Step Tool Calls

Enable multi-step tool calling with `stopWhen`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';

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

By default `stopWhen` is `stepCountIs(1)`. Setting it to `stepCountIs(5)` allows the model to use up to 5 steps, enabling it to call tools, receive results, and generate follow-up responses. Update the UI to handle new tool parts:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

### next.js_pages_router_quickstart
Build a streaming chat app with Next.js Pages Router: set up route handler with `streamText()`, use `useChat()` hook for UI, add tools with `tool()` and Zod schemas, enable multi-step tool calls with `stopWhen: stepCountIs(n)`.

## Setup

Create a Next.js app with Pages Router (not App Router):
```
pnpm create next-app@latest my-ai-app
cd my-ai-app
```

Install dependencies:
```
pnpm add ai@beta @ai-sdk/react@beta zod@beta
```

Create `.env.local` with your Vercel AI Gateway API key:
```
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

The `streamText` function accepts a model and messages array. `UIMessage` contains full message history with metadata; convert to `ModelMessage[]` using `convertToModelMessages()` which strips UI-specific data. The result's `toUIMessageStreamResponse()` method converts to a streamed response.

## Provider Configuration

By default, uses Vercel AI Gateway as global provider. Access models with string syntax:
```ts
model: 'anthropic/claude-sonnet-4.5'
```

Or explicitly:
```ts
import { gateway } from 'ai';
model: gateway('anthropic/claude-sonnet-4.5');
```

To use other providers, install their package and create instance:
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

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
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

The `useChat` hook provides `messages` (array with `id`, `role`, `parts` properties) and `sendMessage()` function. Messages are accessed via `parts` array which preserves sequence of model outputs (text, reasoning tokens, etc.). Run with `pnpm run dev` and visit `http://localhost:3000`.

## Tools

Add tools to the `streamText` config:
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

Tools have a description, `inputSchema` (Zod schema for model to extract inputs), and async `execute` function. Tool parts appear in `message.parts` array as `tool-{toolName}` (e.g., `tool-weather`).

## Multi-Step Tool Calls

Enable multi-step tool use with `stopWhen`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';

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

By default `stopWhen` is `stepCountIs(1)`, stopping after first step. Set to higher value to allow model to use tool results to generate follow-up responses. Update UI to handle new tool parts:
```tsx
case 'tool-weather':
case 'tool-convertFahrenheitToCelsius':
  return (
    <pre key={`${message.id}-${i}`}>
      {JSON.stringify(part, null, 2)}
    </pre>
  );
```

### svelte
Build streaming chat with Svelte: create gateway provider, POST endpoint with streamText/convertToModelMessages, Chat class UI component with message.parts rendering, add tools with tool() and z.object() schemas, enable multi-step with stopWhen: stepCountIs(N).

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

### nuxt_quickstart
Build streaming chat UI in Nuxt with API route using streamText, Chat class for message management, tools with Zod schemas, and multi-step tool calling via stopWhen.

## Setup
Create a Nuxt app with `pnpm create nuxt my-ai-app`. Install dependencies: `pnpm add ai@beta @ai-sdk/vue@beta zod`. Configure API key in `.env` as `NUXT_AI_GATEWAY_API_KEY=xxxxxxxxx` and add to `nuxt.config.ts` runtime config.

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
The route receives `UIMessage[]` (includes metadata like timestamps), converts to `ModelMessage[]` (stripped of metadata) for the model, and returns a streamed response.

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
The `Chat` class manages messages and provides `sendMessage()`. Messages have `id`, `role`, and `parts` array. Each part has a `type` (e.g., 'text') and corresponding data.

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
Tool parts appear in `message.parts` as `tool-{toolName}` (e.g., `tool-weather`). Display them in the UI:
```typescript
<pre v-if="part.type === 'tool-weather' || part.type === 'tool-convertFahrenheitToCelsius'">
  {{ JSON.stringify(part, null, 2) }}
</pre>
```

## Multi-Step Tool Calls
Enable with `stopWhen: stepCountIs(5)` in `streamText()` config. This allows the model to use tool results to generate follow-up responses across multiple steps (up to 5 in this example), enabling complex interactions where the model gathers information and uses it to answer the original query.

## Provider Options
Default is Vercel AI Gateway: `model: gateway('anthropic/claude-sonnet-4.5')`. To use OpenAI: `pnpm add @ai-sdk/openai@beta` then `import { openai } from '@ai-sdk/openai'` and `model: openai('gpt-5.1')`. The AI SDK supports dozens of providers through first-party, OpenAI-compatible, and community packages.

### node.js_quickstart
Build streaming Node.js chat agents with AI SDK using Vercel AI Gateway; define tools with Zod schemas; enable multi-step tool execution with stopWhen and onStepFinish.

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

### expo_quickstart
Build streaming chat interface with Expo using useChat hook, streamText API route, and optional tools with multi-step execution.

## Expo Quickstart

Build a streaming chat interface with Expo and the AI SDK.

### Prerequisites
- Node.js 18+ and pnpm
- Vercel AI Gateway API key

### Setup
Create a new Expo app:
```bash
pnpm create expo-app@latest my-ai-app
cd my-ai-app
```

Install dependencies (requires Expo 52+):
```bash
pnpm add ai@beta @ai-sdk/react@beta zod
```

Configure API key in `.env.local`:
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

The `streamText` function accepts model and messages, returns a `StreamTextResult` with `toUIMessageStreamResponse()` method to stream the response to the client.

### Provider Configuration
By default, uses Vercel AI Gateway (included in `ai` package). Reference models as strings: `'anthropic/claude-sonnet-4.5'`. Can also explicitly import:
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

### UI Setup
Update `app/(tabs)/index.tsx` with `useChat` hook:
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
              <View>
                <Text style={{ fontWeight: 700 }}>{m.role}</Text>
                {m.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
                  }
                })}
              </View>
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

`useChat` provides `messages` (array with `id`, `role`, `parts` properties) and `sendMessage` function. Use `expo/fetch` instead of native fetch for streaming support. Message `parts` array contains ordered components of model output (text, reasoning tokens, etc.).

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

Handles URL generation for development and production. Must set `EXPO_PUBLIC_API_BASE_URL` before production deployment.

### Running
```bash
pnpm expo
```
Open http://localhost:8081

### Tools
Add tool capabilities to the model. Update `app/api/chat+api.ts`:
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

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
```

Define tools with description, `inputSchema` (Zod schema), and async `execute` function. Tool parts appear in `message.parts` array as `tool-{toolName}` type.

### Multi-Step Tool Calls
Enable model to use tool results to generate follow-up responses. Update `app/api/chat+api.ts`:
```tsx
import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';

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

`stopWhen: stepCountIs(5)` allows model to use up to 5 steps. Update UI to handle new tool parts:
```tsx
{m.parts.map((part, i) => {
  switch (part.type) {
    case 'text':
      return <Text key={`${m.id}-${i}`}>{part.text}</Text>;
    case 'tool-weather':
    case 'tool-convertFahrenheitToCelsius':
      return (
        <Text key={`${m.id}-${i}`}>
          {JSON.stringify(part, null, 2)}
        </Text>
      );
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

