## React Server Components (RSC) Package

Experimental package for building AI applications with React Server Components, enabling server-side UI rendering and streaming to clients with end-to-end type safety.

### Core Abstractions

**Streaming UI & State:**
- `streamUI`: Calls a model with tools that return React components; model acts as router selecting relevant UI based on intent
- `useUIState` / `useAIState`: Client-side hooks managing visual (UI) and serializable (AI) state respectively
- `useActions`: Provides client access to Server Actions
- `createAI`: Context provider wrapping application, managing both UI and AI state with `initialAIState`, `initialUIState`, and `actions` object

**Streamable Values:**
- `createStreamableValue`: Streams serializable data from server to client with `.update()` and `.done()` methods
- `createStreamableUI`: Streams React components with `.update()`, `.done()`, and `.error()` methods
- `readStreamableValue`: Client-side async iterator consuming streamable values

### State Management

Split state into two parts:
- **AI State**: Serializable JSON (conversation history, metadata) shared with LLM, accessible server/client via `getAIState()` / `getMutableAIState()` / `useAIState()`
- **UI State**: Client-only React components, managed via `useUIState()`

Persist AI state with `onSetAIState` callback (save when `done: true`), restore with `initialAIState` prop. Reconstruct UI state via `onGetUIState` callback by comparing database vs app history.

### Patterns

**Streaming Components with Loading States:**
Generator functions in tool `generate` methods yield intermediate values (loading UI) before returning final components:
```tsx
generate: async function* ({ location }) {
  yield <LoadingComponent />;
  const data = await fetchData(location);
  return <FinalComponent data={data} />;
}
```

**Multistep Interfaces:**
Compose multiple tools into conversational flows. User sends message → appended to AI State → passed to model with tools → model calls tool → component renders → within component use `useActions` to trigger next step.

**Client Interactions:**
Convert tool components to client components using `useActions` to call Server Actions and `useUIState` to update conversation without requiring text input.

**Loading State Approaches:**
1. Client-side: Traditional `useState` with disabled inputs
2. Server-streamed: Separate `createStreamableValue` for loading state
3. Generator functions: Yield loading UI before final result

**Error Handling:**
- UI errors: Use `streamableUI.error()` and wrap with React Error Boundary
- Other errors: Return error objects from try-catch blocks

**Authentication:**
Validate authorization in Server Actions by checking cookies before executing protected logic; return error object if token invalid.

### Migration to AI SDK UI

AI SDK RSC is experimental with limitations (no stream abort, component remounting flicker, quadratic data transfer). Migrate by:
- Separating generation (route handler with `streamText`) from rendering (client with `useChat`)
- Replacing `streamUI` tools with `streamText` tools that return data instead of components
- Rendering components client-side based on `toolInvocations` state
- Using `useChat` hook instead of `useActions` for client interactions
- Replacing `onSetAIState` with `onFinish` callback in `streamText`
- Loading initial messages via page static generation and passing to `useChat`

### Setup Example

```tsx
// app/ai.ts
import { createAI } from '@ai-sdk/rsc';

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendMessage },
  onSetAIState: async ({ state, done }) => {
    if (done) await saveChatToDB(state);
  },
});

// app/layout.tsx
import { AI } from './ai';
export default function RootLayout({ children }) {
  return <AI>{children}</AI>;
}

// app/actions.tsx
export async function sendMessage(input: string) {
  'use server';
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt: input,
    text: ({ content }) => <div>{content}</div>,
    tools: { /* tool definitions */ },
  });
  return result.value;
}

// app/page.tsx
'use client';
const { sendMessage } = useActions();
const [messages, setMessages] = useUIState();
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await sendMessage(input);
  setMessages([...messages, response]);
};
```