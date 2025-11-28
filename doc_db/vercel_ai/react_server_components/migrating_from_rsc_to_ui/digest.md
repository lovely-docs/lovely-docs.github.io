## Overview

AI SDK has two frontend packages: AI SDK UI and AI SDK RSC. AI SDK RSC is experimental and unsuitable for production due to significant limitations:
- Cannot abort streams using server actions
- Components remount on `.done()` causing flicker
- Many suspense boundaries can crash
- `createStreamableUI` causes quadratic data transfer
- Closed RSC streams cause update issues

This guide covers migrating from AI SDK RSC to AI SDK UI.

## Streaming Chat Completions

**Before (RSC):** `streamUI` executes in a server action, combining generation and rendering:
```tsx
// @/app/actions.tsx
export async function sendMessage(message: string) {
  'use server';
  const messages = getMutableAIState('messages');
  messages.update([...messages.get(), { role: 'user', content: message }]);
  const { value: stream } = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a friendly assistant!',
    messages: messages.get(),
    text: async function* ({ content, done }) { /* process text */ },
    tools: { /* tool definitions */ },
  });
  return stream;
}

// @/app/page.tsx - client calls server action
'use client';
const { sendMessage } = useActions();
const [messages, setMessages] = useUIState();
const response = await sendMessage(input);
setMessages(msgs => [...msgs, response]);
```

**After (UI):** Separate generation (route handler with `streamText`) from rendering (client with `useChat`):
```ts
// @/app/api/chat/route.ts
export async function POST(request) {
  const { messages } = await request.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly assistant!',
    messages,
    tools: { /* tool definitions */ },
  });
  return result.toUIMessageStreamResponse();
}

// @/app/page.tsx - client uses useChat hook
'use client';
const { messages, input, setInput, handleSubmit } = useChat();
```

## Parallel and Multi-Step Tool Calls

AI SDK RSC `streamUI` does not support parallel or multi-step tool calls. AI SDK UI `useChat` has built-in support: define multiple tools in `streamText` and set `maxSteps` parameter for multi-step calls. The hook handles them automatically.

## Generative User Interfaces

**Before (RSC):** Render components within server action using `tools` with `generate` function:
```tsx
// @/app/actions.tsx
const { value: stream } = await streamUI({
  model: openai('gpt-4o'),
  tools: {
    displayWeather: {
      description: 'Display the weather for a location',
      inputSchema: z.object({ latitude: z.number(), longitude: z.number() }),
      generate: async function* ({ latitude, longitude }) {
        yield <div>Loading weather...</div>;
        const { value, unit } = await getWeather({ latitude, longitude });
        return <Weather value={value} unit={unit} />;
      },
    },
  },
});
```

**After (UI):** Stream props data from route handler, render on client based on tool invocations:
```ts
// @/app/api/chat/route.ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  tools: {
    displayWeather: {
      description: 'Display the weather for a location',
      parameters: z.object({ latitude: z.number(), longitude: z.number() }),
      execute: async function ({ latitude, longitude }) {
        const props = await getWeather({ latitude, longitude });
        return props;
      },
    },
  },
});
return result.toUIMessageStreamResponse();

// @/app/page.tsx - client renders based on toolInvocations
message.toolInvocations.map(toolInvocation => {
  if (toolInvocation.state === 'result') {
    return toolInvocation.toolName === 'displayWeather' ? 
      <Weather weatherAtLocation={toolInvocation.result} /> : null;
  } else {
    return <div>Loading weather...</div>;
  }
});
```

## Handling Client Interactions

**Before (RSC):** Components use `useActions` hook to call server actions:
```tsx
// @/app/components/list-flights.tsx
const { sendMessage } = useActions();
const [_, setMessages] = useUIState();
onClick={async () => {
  const response = await sendMessage(`I would like to choose flight ${flight.id}!`);
  setMessages(msgs => [...msgs, response]);
}}
```

**After (UI):** Initialize `useChat` hook in component with same `id` as parent:
```tsx
// @/app/components/list-flights.tsx
const { append } = useChat({
  id: chatId,
  body: { id: chatId },
  maxSteps: 5,
});
onClick={async () => {
  await append({
    role: 'user',
    content: `I would like to choose flight ${flight.id}!`,
  });
}}
```

## Loading Indicators

**Before (RSC):** Use `initial` parameter of `streamUI`:
```tsx
const { value: stream } = await streamUI({
  model: openai('gpt-4o'),
  initial: <div>Loading...</div>,
  // ...
});
```

**After (UI):** Use tool invocation state:
```tsx
toolInvocations.map(toolInvocation => {
  if (toolInvocation.state === 'result') {
    return <Weather weatherAtLocation={toolInvocation.result} />;
  } else {
    return <Weather isLoading={true} />;
  }
});
```

## Saving Chats

**Before (RSC):** Use `onSetAIState` callback in `createAI`:
```ts
// @/app/actions.ts
export const AI = createAI({
  onSetAIState: async ({ state, done }) => {
    'use server';
    if (done) {
      await saveChat(state);
    }
  },
});
```

**After (UI):** Use `onFinish` callback in `streamText`:
```ts
// @/app/api/chat/route.ts
const result = streamText({
  model: 'anthropic/claude-sonnet-4.5',
  onFinish: async ({ response }) => {
    try {
      await saveChat({
        id,
        messages: [...coreMessages, ...response.messages],
      });
    } catch (error) {
      console.error('Failed to save chat');
    }
  },
});
```

## Restoring Chats

**Before (RSC):** Use `onGetUIState` callback in `createAI`:
```ts
// @/app/actions.ts
export const AI = createAI({
  onGetUIState: async () => {
    'use server';
    const chat = await loadChatFromDB();
    const uiState = convertToUIState(chat);
    return uiState;
  },
});
```

**After (UI):** Load messages during page static generation and pass as `initialMessages` to `useChat`:
```tsx
// @/app/chat/[id]/page.tsx
export default async function Page({ params }: { params: any }) {
  const { id } = params;
  const chatFromDb = await getChatById({ id });
  const chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages),
  };
  return <Chat key={id} id={chat.id} initialMessages={chat.messages} />;
}

// @/app/components/chat.tsx
export function Chat({ id, initialMessages }: { id; initialMessages: Array<Message> }) {
  const { messages } = useChat({ id, initialMessages });
}
```

## Streaming Object Generation

**Before (RSC):** Use `createStreamableValue` with `streamObject`:
```ts
// @/app/actions.ts
export async function generateSampleNotifications() {
  'use server';
  const stream = createStreamableValue();
  (async () => {
    const { partialObjectStream } = streamObject({
      model: 'anthropic/claude-sonnet-4.5',
      schema: notificationsSchema,
      prompt: 'messages from a family group chat during diwali, max 4',
    });
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
  })();
  stream.done();
  return { partialNotificationsStream: stream.value };
}

// @/app/page.tsx
const { partialNotificationsStream } = await generateSampleNotifications();
for await (const partialNotifications of readStreamableValue(partialNotificationsStream)) {
  if (partialNotifications) {
    setNotifications(partialNotifications.notifications);
  }
}
```

**After (UI):** Use `useObject` hook with route handler:
```ts
// @/app/api/object/route.ts
export async function POST(req: Request) {
  const context = await req.json();
  const result = streamObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: notificationSchema,
    prompt: `Generate 3 notifications for a messages app in this context:` + context,
  });
  return result.toTextStreamResponse();
}

// @/app/page.tsx
const { object, submit } = useObject({
  api: '/api/object',
  schema: notificationSchema,
});
object?.notifications?.map((notification, index) => (
  <div key={index}>
    <p>{notification?.name}</p>
    <p>{notification?.message}</p>
  </div>
))
```