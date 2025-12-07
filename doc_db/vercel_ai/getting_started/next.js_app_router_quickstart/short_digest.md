## Setup
Prerequisites: Node.js 18+, pnpm, Vercel AI Gateway API key.
```bash
pnpm create next-app@latest my-ai-app
cd my-ai-app
pnpm add ai@beta @ai-sdk/react@beta zod
```
`.env.local`: `AI_GATEWAY_API_KEY=xxxxxxxxx`

## Route Handler
`app/api/chat/route.ts`:
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
- `streamText()` takes model and messages
- `convertToModelMessages()` strips UI metadata from `UIMessage[]` to `ModelMessage[]`
- `toUIMessageStreamResponse()` streams result to client

## UI
`app/page.tsx`:
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
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => 
            part.type === 'text' ? <div key={i}>{part.text}</div> : null
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
        setInput('');
      }}>
        <input value={input} onChange={e => setInput(e.currentTarget.value)} />
      </form>
    </div>
  );
}
```
`useChat()` provides `messages` array and `sendMessage()` function. Message `parts` array contains ordered output components.

## Tools
Add tools to route handler with `tool()` function and Zod schema:
```tsx
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
}
```
Use `stopWhen: stepCountIs(5)` to enable multi-step tool calls where model uses tool results to answer queries. Tool parts in messages are named `tool-{toolName}`.