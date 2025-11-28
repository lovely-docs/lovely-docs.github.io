## React Server Components

Experimental package for streaming LLM-generated UI from server to client using `streamUI`, `useUIState`/`useAIState`, and `createAI` context provider.

**Core Functions:**
- `streamUI`: Model with tools returning React components
- `useUIState` / `useAIState`: Client hooks for visual and serializable state
- `createStreamableValue` / `createStreamableUI`: Stream data/components with `.update()`, `.done()`, `.error()`
- `createAI`: Context provider managing state and Server Actions

**State Split:**
- AI State: Serializable JSON (conversation history) shared with LLM
- UI State: Client-only React components

**Key Patterns:**
- Generator functions yield loading UI before final components
- Multistep interfaces compose tools into conversational flows
- Client components use `useActions` for interactions without text input
- Validate authentication in Server Actions via cookies
- Persist AI state with `onSetAIState`, restore with `initialAIState`

**Migration:** AI SDK RSC is experimental; migrate to AI SDK UI by separating generation (route handler `streamText`) from rendering (client `useChat`), rendering components based on `toolInvocations` state.