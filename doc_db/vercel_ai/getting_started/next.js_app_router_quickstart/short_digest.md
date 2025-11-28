## Setup
```
pnpm create next-app@latest my-ai-app
pnpm add ai@beta @ai-sdk/react@beta zod
```
Create `.env.local` with `AI_GATEWAY_API_KEY`.

## Route Handler
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

## Chat UI
```tsx
'use client';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage } = useChat();
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.map((part, i) => 
            part.type === 'text' && <div key={i}>{part.text}</div>
          )}
        </div>
      ))}
      <form onSubmit={e => {
        e.preventDefault();
        sendMessage({ text: input });
      }}>
        <input placeholder="Say something..." />
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
      return { location, temperature: 72 };
    },
  }),
}
```

## Multi-Step Tool Calls
```tsx
stopWhen: stepCountIs(5),
```
Allows model to use up to 5 steps for tool calling and response generation. Tool parts appear as `tool-{toolName}` in `message.parts`.