## Setup
```
pnpm create next-app@latest my-ai-app
pnpm add ai@beta @ai-sdk/react@beta zod@beta
```
Create `.env.local` with `AI_GATEWAY_API_KEY`.

## Route Handler (`app/api/chat/route.ts`)
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

## UI (`pages/index.tsx`)
```tsx
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
          {message.parts.map((part, i) => {
            if (part.type === 'text') return <div key={i}>{part.text}</div>;
          })}
        </div>
      ))}
      <form onSubmit={e => { e.preventDefault(); sendMessage({ text: input }); setInput(''); }}>
        <input value={input} placeholder="Say something..." onChange={e => setInput(e.currentTarget.value)} />
      </form>
    </div>
  );
}
```

## Tools
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

Tool parts appear as `tool-{toolName}` in `message.parts`. Enable multi-step tool use with `stopWhen: stepCountIs(5)` to allow model to use tool results for follow-up responses.