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