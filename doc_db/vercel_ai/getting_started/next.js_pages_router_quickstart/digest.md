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