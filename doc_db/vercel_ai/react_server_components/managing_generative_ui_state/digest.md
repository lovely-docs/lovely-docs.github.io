## Overview

State management is critical in AI applications because state is passed to LLMs on each request for context. Traditional chatbots use text-based messages, but Generative UI allows models to return React components, which aren't serializable. The solution is splitting state into two parts: AI State (serializable proxy) and UI State (rendered components).

## AI State vs UI State

**AI State**: Serializable JSON representation of application state used on the server and shared with the language model. For chat apps, it's the conversation history with messages containing role and content. Can also store metadata like `createdAt` and `chatId`. Accessible and modifiable from both server and client. Serves as the source of truth.

**UI State**: Fully client-side state (like `useState`) rendered on the client. Can store JavaScript values and React elements. Only accessible client-side.

## Setup with createAI

Create a React context using `createAI` from `@ai-sdk/rsc`:

```tsx
// app/actions.tsx
export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
};

export const sendMessage = async (input: string): Promise<ClientMessage> => {
  "use server"
  // ...
}

// app/ai.ts
import { createAI } from '@ai-sdk/rsc';

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    sendMessage,
  },
});

// app/layout.tsx
import { AI } from './ai';

export default function RootLayout({ children }) {
  return (
    <AI>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AI>
  );
}
```

Must pass Server Actions to the `actions` object.

## Reading and Updating State

**Client-side UI State** with `useUIState`:
```tsx
'use client';
import { useUIState } from '@ai-sdk/rsc';

export default function Page() {
  const [messages, setMessages] = useUIState();
  return <ul>{messages.map(m => <li key={m.id}>{m.display}</li>)}</ul>;
}
```

**Client-side AI State** with `useAIState`:
```tsx
'use client';
import { useAIState } from '@ai-sdk/rsc';

export default function Page() {
  const [messages, setMessages] = useAIState();
  return <ul>{messages.map(m => <li key={m.id}>{m.content}</li>)}</ul>;
}
```

**Server-side AI State** (read-only) with `getAIState`:
```tsx
import { getAIState } from '@ai-sdk/rsc';

export async function sendMessage(message: string) {
  'use server';
  const history = getAIState();
  const response = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: [...history, { role: 'user', content: message }],
  });
  return response;
}
```

**Server-side AI State** (mutable) with `getMutableAIState`:
```tsx
import { getMutableAIState } from '@ai-sdk/rsc';

export async function sendMessage(message: string) {
  'use server';
  const history = getMutableAIState();
  history.update([...history.get(), { role: 'user', content: message }]);
  
  const response = await generateText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: history.get(),
  });
  
  history.done([...history.get(), { role: 'assistant', content: response }]);
  return response;
}
```

Use `.update()` and `.done()` to keep conversation history in sync.

## Calling Server Actions from Client

Use `useActions` hook to call Server Actions:
```tsx
'use client';
import { useActions, useUIState } from '@ai-sdk/rsc';
import { AI } from './ai';

export default function Page() {
  const { sendMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState();

  const handleSubmit = async event => {
    event.preventDefault();
    setMessages([
      ...messages,
      { id: Date.now(), role: 'user', display: event.target.message.value },
    ]);

    const response = await sendMessage(event.target.message.value);
    setMessages([
      ...messages,
      { id: Date.now(), role: 'assistant', display: response },
    ]);
  };

  return (
    <>
      <ul>
        {messages.map(m => <li key={m.id}>{m.display}</li>)}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

Must update UI State after calling Server Action for streamed components to display.

## Important Notes

- AI SDK RSC is experimental; use AI SDK UI for production
- State is not passed explicitly to server for each request; hooks handle it via React context
- Only access state within actions passed to `createAI` in the `actions` key
- Don't forget to update UI State after Server Action calls