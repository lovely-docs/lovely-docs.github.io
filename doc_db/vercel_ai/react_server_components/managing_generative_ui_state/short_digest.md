## AI State vs UI State

**AI State**: Serializable JSON representation (source of truth) used on server and shared with LLM. For chat: conversation history with role/content. Accessible from server and client.

**UI State**: Client-side only state (like `useState`) that renders React components and JavaScript values.

## Setup

```tsx
// app/ai.ts
import { createAI } from '@ai-sdk/rsc';

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendMessage },
});

// app/layout.tsx - wrap app with AI provider
<AI><html><body>{children}</body></html></AI>
```

## Accessing State

**Client UI State**: `const [messages, setMessages] = useUIState();`

**Client AI State**: `const [messages, setMessages] = useAIState();`

**Server AI State (read)**: `const history = getAIState();`

**Server AI State (mutable)**: 
```tsx
const history = getMutableAIState();
history.update([...history.get(), newMessage]);
history.done([...history.get(), response]);
```

## Calling Server Actions

```tsx
const { sendMessage } = useActions<typeof AI>();
const response = await sendMessage(input);
setMessages([...messages, response]); // Update UI State after
```

Must update UI State after Server Action calls for streamed components to display.