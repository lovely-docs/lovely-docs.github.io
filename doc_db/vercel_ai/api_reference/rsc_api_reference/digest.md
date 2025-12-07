## Server-Side Functions

**streamUI(model, system?, prompt?, messages?, tools?, ...)** - Creates streamable React UI from LLM output. Returns `{ value: ReactNode, stream: AsyncIterable<StreamPart>, response?, warnings? }`. Stream emits `{ type: 'text-delta', textDelta }`, `{ type: 'tool-call', toolCallId, toolName, args }`, `{ type: 'error', error }`, or `{ type: 'finish', finishReason, usage }`. Supports messages array (CoreSystemMessage, CoreUserMessage with TextPart/ImagePart/FilePart, CoreAssistantMessage, CoreToolMessage, UIMessage), tools with optional `generate` callback yielding React nodes, generation options (maxOutputTokens, temperature, topP, topK, presencePenalty, frequencyPenalty, stopSequences, seed), toolChoice ("auto"/"none"/"required"/`{ type, toolName }`), callbacks (text, onFinish), and standard options (maxRetries, abortSignal, headers, providerOptions).

**createAI(actions, initialAIState, initialUIState, onGetUIState?, onSetAIState?)** - Context provider factory for client-server state management. `actions` is Record<string, Action> of server-side callables. `onSetAIState` callback receives `{ state, done }` when mutable AI state updates occur, enabling database persistence. Returns `<AI/>` provider component.

**createStreamableUI(initialValue?)** - Creates server-to-client stream for React components. Returns object with `value: ReactNode` (returnable from Server Action), `update(ReactNode)`, `append(ReactNode)`, `done(ReactNode | null)` (required to close stream), `error(Error)`.

**createStreamableValue(value)** - Creates server-to-client stream for serializable data. Returns streamable object with initial data and update method, returnable from Server Actions.

**getAIState(key?)** - Reads current AI state (read-only). Optional `key` parameter accesses object property.

**getMutableAIState(key?)** - Returns mutable AI state with `update(newState)` and `done(newState)` methods for server-side updates.

## Client-Side Hooks

**useAIState()** - Returns `[state]` array of globally-shared AI state under `<AI/>` provider. Shared across all hooks in the tree.

**useUIState()** - Returns `[state, setState]` array for client-side UI state (can contain functions, React nodes, data). Visual representation of AI state.

**useActions()** - Returns `Record<string, Action>` of patched Server Actions. Required because direct access causes "Cannot find Client Component" errors.

**useStreamableValue(streamableValue)** - Returns `[data, error, pending]` tuple. Consumes streamable values created with `createStreamableValue`.

**readStreamableValue(stream)** - Async iterator for consuming server-streamed values. Use with `for await...of` loop.

## Example: Full Flow

```typescript
// Server (app/actions.ts)
'use server';
import { streamUI, createStreamableUI, getMutableAIState } from '@ai-sdk/rsc';

export async function generate(input: string) {
  const mutableState = getMutableAIState();
  const { value, stream } = await streamUI({
    model: openai('gpt-4'),
    prompt: input,
    tools: {
      renderComponent: {
        description: 'Render a React component',
        parameters: z.object({ content: z.string() }),
        generate: async ({ content }) => {
          const ui = createStreamableUI(<div>{content}</div>);
          mutableState.update([...mutableState.get(), { role: 'assistant', content }]);
          ui.done();
          return ui.value;
        }
      }
    }
  });
  mutableState.done(value);
  return { value, stream };
}

// Client (app/page.tsx)
import { useActions, useAIState, useUIState } from '@ai-sdk/rsc';

export default function Page() {
  const [aiState] = useAIState();
  const [uiState, setUIState] = useUIState();
  const { generate } = useActions();
  
  return (
    <button onClick={async () => {
      const result = await generate('prompt');
      setUIState([...uiState, result.value]);
    }}>
      Generate
    </button>
  );
}

// Root (app/layout.tsx)
import { createAI } from '@ai-sdk/rsc';
import { generate } from './actions';

const AI = createAI({
  actions: { generate },
  initialAIState: [],
  initialUIState: [],
  onSetAIState: ({ state, done }) => {
    if (done) saveToDatabase(state);
  }
});

export default function RootLayout({ children }) {
  return <AI>{children}</AI>;
}
```

**Status**: Experimental. Production use should migrate to AI SDK UI.