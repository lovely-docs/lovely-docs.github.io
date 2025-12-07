## Experimental RSC Integration for Generative UI

Experimental package (`@ai-sdk/rsc`) for building AI applications with React Server Components. RSCs render UI on the server and stream to client; combined with Server Actions, they enable LLMs to generate and stream UI directly.

### Core Functions

**Generative UI:**
- `streamUI`: calls a model and allows it to respond with React Server Components. Tools return components via async generator functions that yield loading states before final UI.
- `useUIState`: client hook returning current UI state and update function (like `useState`). UI State is the visual representation of AI state, can contain React elements.
- `useAIState`: client hook returning current AI state and update function. AI state is serializable JSON containing context shared with model (system messages, function responses, conversation history).
- `useActions`: provides access to Server Actions from client for user interactions.
- `createAI`: creates a client-server context provider managing UI and AI states with callbacks for persistence.

**Streaming Values:**
- `createStreamableValue`: creates a stream sending serializable values (strings, numbers, objects, arrays) from server to client. Read with `readStreamableValue` async iterator.
- `createStreamableUI`: creates a stream sending React components from server to client. Call `.update()` for intermediate states, `.done()` to finalize.

### State Management

Split state into two parts:
- **AI State**: Serializable JSON (conversation history, metadata) accessible/modifiable from server and client. Source of truth passed to LLM.
- **UI State**: Client-only state containing rendered UI elements and React components.

Setup with `createAI`:
```tsx
export type ServerMessage = { role: 'user' | 'assistant'; content: string };
export type ClientMessage = { id: string; role: 'user' | 'assistant'; display: ReactNode };

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  initialAIState: [],
  initialUIState: [],
  actions: { sendMessage },
  onSetAIState: async ({ state, done }) => {
    if (done) saveChatToDB(state);
  },
  onGetUIState: async () => {
    const historyFromDB = await loadChatFromDB();
    return historyFromDB.map(({ role, content }) => ({
      id: generateId(),
      role,
      display: role === 'function' ? <Component {...JSON.parse(content)} /> : content,
    }));
  },
});
```

Access states:
- Client: `useUIState()`, `useAIState()`, `useActions()`
- Server: `getAIState()`, `getMutableAIState()` (with `.update()` and `.done()` methods)

### Streaming React Components

`streamUI` function streams components from server to client. Tools return components instead of text/objects:

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      inputSchema: z.object({ location: z.string() }),
      generate: async function* ({ location }) {
        yield <LoadingComponent />;
        const weather = await getWeather(location);
        return <WeatherComponent weather={weather} location={location} />;
      },
    },
  },
});
```

### Multi-Step Interfaces

Build multi-step UIs with tool composition. Tools use async generators to yield intermediate UI then final components. Client components use `useActions`/`useUIState` for interactivity:

```tsx
// Server Action
export async function submitUserMessage(input: string) {
  'use server';
  const ui = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a flight booking assistant',
    prompt: input,
    text: async ({ content }) => <div>{content}</div>,
    tools: {
      searchFlights: {
        description: 'search for flights',
        inputSchema: z.object({
          source: z.string(),
          destination: z.string(),
          date: z.string(),
        }),
        generate: async function* ({ source, destination, date }) {
          yield `Searching for flights from ${source} to ${destination} on ${date}...`;
          const results = await searchFlights(source, destination, date);
          return <Flights flights={results} />;
        },
      },
    },
  });
  return ui.value;
}

// Client component with interactivity
'use client';
export const Flights = ({ flights }) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();
  return (
    <div>
      {flights.map(result => (
        <div key={result.id} onClick={async () => {
          const display = await submitUserMessage(`lookupFlight ${result.flightNumber}`);
          setMessages((messages) => [...messages, display]);
        }}>
          {result.flightNumber}
        </div>
      ))}
    </div>
  );
};
```

### Loading State Patterns

Three approaches:
1. **Client-side**: Manage loading state variable, disable input while streaming.
2. **Server-streamed**: Create separate streamable value for loading state, read both response and loading state on client.
3. **Streaming components**: Use `streamUI` with generator functions to yield loading component while awaiting model response.

### Error Handling

For UI errors, use `streamableUI.error()`:
```tsx
export async function getStreamedUI() {
  const ui = createStreamableUI();
  (async () => {
    ui.update(<div>loading</div>);
    const data = await fetchData();
    ui.done(<div>{data}</div>);
  })().catch(e => {
    ui.error(<div>Error: {e.message}</div>);
  });
  return ui.value;
}
```

For other errors, return error objects from server actions. Wrap streamed components with React Error Boundary on client.

### Authentication

Server Actions are public endpoints. Validate authentication tokens from cookies before executing protected logic:
```tsx
'use server';
import { cookies } from 'next/headers';
import { validateToken } from '../utils/auth';

export const getWeather = async () => {
  const token = cookies().get('token');
  if (!token || !validateToken(token)) {
    return { error: 'This action requires authentication' };
  }
  // protected logic
};
```

### Migration to AI SDK UI

AI SDK RSC is experimental with limitations: cannot abort streams, components remount on `.done()` causing flicker, many suspense boundaries crash, `createStreamableUI` causes quadratic data transfer. AI SDK UI is the recommended stable alternative.

Key differences:
- **RSC**: `streamUI` in server action combines generation and rendering
- **UI**: Separate concerns - `streamText` in route handler, `useChat` on client
- **RSC**: Tools return components directly
- **UI**: Tools return data, components render on client via tool invocations
- **RSC**: `useActions` to trigger server actions
- **UI**: `useChat` with same `id` in child components
- **RSC**: `onSetAIState` callback for persistence
- **UI**: `onFinish` callback in `streamText`
- **RSC**: `onGetUIState` callback for restoration
- **UI**: Load messages during page generation, pass as `initialMessages` to `useChat`
