## Expo Quickstart

Build streaming chat with Expo and AI SDK.

**Setup**: `pnpm create expo-app@latest my-ai-app`, install `ai@beta @ai-sdk/react@beta zod`, set `AI_GATEWAY_API_KEY` in `.env.local`.

**API Route** (`app/api/chat+api.ts`):
```tsx
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse({
    headers: { 'Content-Type': 'application/octet-stream', 'Content-Encoding': 'none' },
  });
}
```

**UI** (`app/(tabs)/index.tsx`):
```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';

export default function App() {
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch,
      api: generateAPIUrl('/api/chat'),
    }),
  });

  return (
    <SafeAreaView>
      <ScrollView>
        {messages.map(m => (
          <View key={m.id}>
            <Text>{m.role}</Text>
            {m.parts.map((part, i) => 
              part.type === 'text' ? <Text key={i}>{part.text}</Text> : null
            )}
          </View>
        ))}
      </ScrollView>
      <TextInput onSubmitEditing={() => sendMessage({ text: input })} />
    </SafeAreaView>
  );
}
```

**Tools**:
```tsx
tools: {
  weather: tool({
    description: 'Get weather in location (fahrenheit)',
    inputSchema: z.object({ location: z.string() }),
    execute: async ({ location }) => ({ location, temperature: 72 }),
  }),
}
```

**Multi-step**: Add `stopWhen: stepCountIs(5)` to allow model to chain tool calls. Tool results appear as `tool-{toolName}` parts.

**Polyfills**: Install `@ungap/structured-clone @stardazed/streams-text-encoding`, create `polyfills.js` with setup, import in `_layout.tsx`.