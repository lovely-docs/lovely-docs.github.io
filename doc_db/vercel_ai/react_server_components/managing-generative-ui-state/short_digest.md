## State Split Pattern

AI State (serializable JSON for LLM) and UI State (client-side React elements) must be kept separate because React components aren't serializable.

## Setup

```tsx
// Define types
export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

// Create context
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendMessage },
});

// Wrap app
<AI><html>...</html></AI>
```

## Access Patterns

- **Client UI State**: `const [messages, setMessages] = useUIState()`
- **Client AI State**: `const [messages] = useAIState()`
- **Server AI State**: `const history = getAIState()` or `getMutableAIState()`
- **Call actions**: `const { sendMessage } = useActions<typeof AI>()`

## Update AI State

```tsx
const history = getMutableAIState();
history.update([...history.get(), newMessage]); // intermediate
history.done([...history.get(), finalMessage]); // final
```

Always update UI State after server action calls for components to render.