

## Pages

### overview
Experimental RSC package for streaming LLM-generated UI from server to client via streamUI, useUIState/useAIState, createStreamableValue/UI, and createAI context provider.

## AI SDK RSC

AI SDK RSC enables building AI applications using React Server Components (RSC), which render UI on the server and stream to the client. Combined with Server Actions, this allows LLMs to generate and stream UI directly from server to client with end-to-end type-safety.

### Core Functions

**Generative UI Abstractions:**
- `streamUI`: calls a model and receives React Server Components as response
- `useUIState`: manages UI state (visual representation), similar to React's `useState`
- `useAIState`: manages AI state (context, system messages, function responses shared with model), similar to React's `useState`
- `useActions`: provides client access to Server Actions for user interactions
- `createAI`: creates a client-server context provider to wrap application tree and manage both UI and AI states

**Streamable Values:**
- `createStreamableValue`: creates a stream sending serializable data from server to client
- `readStreamableValue`: reads a streamable value on client created via `createStreamableValue`
- `createStreamableUI`: creates a stream sending UI from server to client
- `useStreamableValue`: accepts a streamable value and returns current value, error, and pending state

### Compatibility

The `@ai-sdk/rsc` package requires frameworks that support React Server Components.

### Status

AI SDK RSC is experimental. AI SDK UI is recommended for production, with a migration guide available.

### streaming_react_components
Stream React components from server to client using `streamUI` with tools; generator functions enable yielding loading states before final components; requires Server Action + client page in Next.js.

## Overview
The `streamUI` function allows streaming React Server Components from server to client. It works similarly to AI SDK Core functions like `streamText` and `streamObject`, but returns React components instead of text.

## Core Concept
`streamUI` uses tools that return React components. The model acts as a dynamic router that understands user intent and displays relevant UI. If the model decides to call a tool based on context, it executes that tool and streams the returned React component. If no relevant tool exists, the model returns text which is passed to a `text` handler for rendering.

## Basic Usage
```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {},
});
```

## Tool Structure
A tool is an object with:
- `description`: string explaining what the tool does and when to use it
- `inputSchema`: Zod schema describing required inputs
- `generate`: async generator function that returns a React component

## Tool Example with Streaming
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

The `generate` function uses a generator function (`function*`) to yield intermediate values. It can yield a loading component immediately, then return the final component after async operations complete. This enables streaming UI updates without blocking.

## Next.js Integration
Two components needed:

**Server Action** (`app/actions.tsx`):
```tsx
'use server';
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '82°F️ ☀️';
};

const WeatherComponent = (props: { location: string; weather: string }) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);

export async function streamComponent() {
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
  return result.value;
}
```

**Client Page** (`app/page.tsx`):
```tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { streamComponent } from './actions';

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();
  return (
    <div>
      <form onSubmit={async e => {
        e.preventDefault();
        setComponent(await streamComponent());
      }}>
        <Button>Stream Component</Button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```

The page is marked as a client component, calls the Server Action on form submission, and renders the returned ReactNode.

## Important Notes
- AI SDK RSC is experimental; AI SDK UI is recommended for production
- `streamUI` must always return a React component
- Generator functions allow yielding intermediate values (like loading states) before returning final components
- Tools work the same way as in other AI SDK Core functions

### managing_generative_ui_state
Split state into AI State (serializable JSON for LLM, server/client accessible) and UI State (client-only React components); use createAI context provider with useUIState/useAIState/getAIState/getMutableAIState hooks and useActions to call Server Actions.

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

### saving_and_restoring_states
Save AI state via onSetAIState callback and restore with initialAIState prop; reconstruct UI state from AI state using onGetUIState by comparing database vs app history.

## AI State

**Saving AI state**: Use the `onSetAIState` callback in `createAI` to persist state whenever it updates. The callback receives `{ state, done }` and runs on the server. Save to database when `done` is true:

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: { continueConversation },
  onSetAIState: async ({ state, done }) => {
    'use server';
    if (done) {
      saveChatToDB(state);
    }
  },
});
```

**Restoring AI state**: Pass `initialAIState` prop to the AI context provider in your root layout. Load from database and pass the chat history:

```tsx
export default async function RootLayout({ children }) {
  const chat = await loadChatFromDB();
  return (
    <html>
      <body>
        <AI initialAIState={chat}>{children}</AI>
      </body>
    </html>
  );
}
```

## UI State

**Saving UI state**: UI state cannot be saved directly because it's not serializable. Use AI state as a proxy to store metadata about UI state instead.

**Restoring UI state**: Use the `onGetUIState` callback to listen for SSR events and reconstruct UI state from AI state. Load chat history from database and compare with current app state. If they differ (different lengths), return reconstructed UI state with rendered components:

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: { continueConversation },
  onGetUIState: async () => {
    'use server';
    const historyFromDB = await loadChatFromDB();
    const historyFromApp = getAIState();
    
    if (historyFromDB.length !== historyFromApp.length) {
      return historyFromDB.map(({ role, content }) => ({
        id: generateId(),
        role,
        display: role === 'function' ? <Component {...JSON.parse(content)} /> : content,
      }));
    }
  },
});
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.

### multistep_interfaces
Build multi-step conversational UIs by composing tools with `streamUI`, managing UI/AI state with hooks, and rendering interactive React components for each step.

## Multistep Interfaces with AI SDK RSC

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Example: a flight booking chatbot with steps to search flights, pick a flight, and check availability.

### Core Concepts

**Tool Composition**: Combining multiple tools to create a new tool, breaking complex tasks into manageable steps. In the flight example, "search flights", "pick flight", and "check availability" compose a "book flight" tool.

**Application Context**: The state of the application including user input, model output, and relevant information. The flight selected in "pick flight" becomes context for "check availability".

### Required Components

- Server Action calling `streamUI` function
- Tool(s) defining sub-tasks
- React component(s) rendered when tools are called
- Page rendering the chatbot

### General Flow

1. User sends message via Server Action using `useActions`
2. Message appended to AI State and passed to model with tools
3. Model calls a tool, rendering corresponding component
4. Within component, use `useActions` to call model and `useUIState` to append response
5. Process repeats for subsequent steps

### Turn-by-Turn Implementation

The simplest multistep approach where user and model alternate. Define tools with `streamUI`:

```tsx
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
          source: z.string().describe('The origin of the flight'),
          destination: z.string().describe('The destination of the flight'),
          date: z.string().describe('The date of the flight'),
        }),
        generate: async function* ({ source, destination, date }) {
          yield `Searching for flights from ${source} to ${destination} on ${date}...`;
          const results = await searchFlights(source, destination, date);
          return (
            <div>
              {results.map(result => (
                <div key={result.id}>{result.flightNumber}</div>
              ))}
            </div>
          );
        },
      },
      lookupFlight: {
        description: 'lookup details for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('The flight number'),
        }),
        generate: async function* ({ flightNumber }) {
          yield `Looking up details for flight ${flightNumber}...`;
          const details = await lookupFlight(flightNumber);
          return (
            <div>
              <div>Flight Number: {details.flightNumber}</div>
              <div>Departure Time: {details.departureTime}</div>
              <div>Arrival Time: {details.arrivalTime}</div>
            </div>
          );
        },
      },
    },
  });
  return ui.value;
}
```

Create AI context with `createAI`:

```ts
export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    submitUserMessage,
  },
});
```

Wrap application in context provider in layout.

Call Server Action from page using `useActions` and `useUIState`:

```tsx
'use client';
export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [
      ...currentConversation,
      <div>{input}</div>,
    ]);
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [...currentConversation, message]);
  };

  return (
    <div>
      <div>
        {conversation.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### Adding User Interaction

Convert tool components to client components and use `useActions` to trigger next steps without requiring user text input. Example: clickable flight results:

```tsx
'use client';
export const Flights = ({ flights }: FlightsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div>
      {flights.map(result => (
        <div
          key={result.id}
          onClick={async () => {
            const display = await submitUserMessage(
              `lookupFlight ${result.flightNumber}`,
            );
            setMessages((messages: ReactNode[]) => [...messages, display]);
          }}
        >
          {result.flightNumber}
        </div>
      ))}
    </div>
  );
};
```

Update tool to render interactive component instead of static output.

### streaming_values
Stream serializable values and React components from server to client using `createStreamableValue` and `createStreamableUI` with async iterator consumption on client.

## Overview

The RSC API provides utility functions to stream values from server to client with granular control. Two main functions are provided:

1. **`createStreamableValue`** - Creates a streamable serializable value (strings, numbers, objects, arrays) with full control over creation, updates, and closing the stream.

2. **`createStreamableUI`** - Creates a streamable React component with full control over updates and stream closure.

## `createStreamableValue` Usage

Import from `@ai-sdk/rsc` and use to stream:
- Text generations from language models in real-time
- Buffer values from multi-modal models (image/audio)
- Progress updates from multi-step agent runs

**Creating a streamable value:**
```tsx
'use server';
import { createStreamableValue } from '@ai-sdk/rsc';

export const runThread = async () => {
  const streamableStatus = createStreamableValue('thread.init');
  
  setTimeout(() => {
    streamableStatus.update('thread.run.create');
    streamableStatus.update('thread.run.update');
    streamableStatus.update('thread.run.end');
    streamableStatus.done('thread.end');
  }, 1000);
  
  return { status: streamableStatus.value };
};
```

**Reading on client:**
```tsx
'use client';
import { readStreamableValue } from '@ai-sdk/rsc';
import { runThread } from '@/actions';

export default function Page() {
  return (
    <button onClick={async () => {
      const { status } = await runThread();
      for await (const value of readStreamableValue(status)) {
        console.log(value);
      }
    }}>
      Ask
    </button>
  );
}
```

`readStreamableValue` returns an async iterator yielding values as they update.

## `createStreamableUI` Usage

Creates a stream holding a React component without calling an LLM. Provides primitive for granular control over streaming React components.

**Server Action example:**
```tsx
'use server';
import { createStreamableUI } from '@ai-sdk/rsc';

export async function getWeather() {
  const weatherUI = createStreamableUI();
  
  weatherUI.update(<div style={{ color: 'gray' }}>Loading...</div>);
  
  setTimeout(() => {
    weatherUI.done(<div>It's a sunny day!</div>);
  }, 1000);
  
  return weatherUI.value;
}
```

**Client-side rendering:**
```tsx
'use client';
import { useState } from 'react';
import { getWeather } from '@/actions';

export default function Page() {
  const [weather, setWeather] = useState<React.ReactNode | null>(null);
  
  return (
    <div>
      <button onClick={async () => {
        const weatherUI = await getWeather();
        setWeather(weatherUI);
      }}>
        What's the weather?
      </button>
      {weather}
    </div>
  );
}
```

Users see loading message first, then final UI after stream completes.

## Integration

These utilities can be paired with AI SDK Core functions like `streamText` and `streamObject` to stream LLM generations from server to client.

**Note:** AI SDK RSC is experimental; AI SDK UI is recommended for production.

### handling_loading_state
Three patterns for loading state in AI SDK RSC: client-side state management, server-streamed loading state, or streaming React components via `streamUI` with generator functions.

## Three Approaches to Handle Loading State

### 1. Client-Side Loading State Management
Manage loading state like traditional Next.js applications. Set a `loading` state variable on the client, set it to `true` when form is submitted, and `false` when response is received. Disable input field while loading.

Example:
```tsx
'use client';
import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          const response = await generateResponse(input);
          let textContent = '';
          for await (const delta of readStreamableValue(response)) {
            textContent = `${textContent}${delta}`;
            setGeneration(textContent);
          }
          setInput('');
          setLoading(false);
        }}
      >
        <input
          type="text"
          value={input}
          disabled={loading}
          className="disabled:opacity-50"
          onChange={event => setInput(event.target.value)}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

Server-side:
```typescript
'use server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';

export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();
  (async () => {
    const { textStream } = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt,
    });
    for await (const text of textStream) {
      stream.update(text);
    }
    stream.done();
  })();
  return stream.value;
}
```

### 2. Streaming Loading State from Server
Create a separate streamable value to track loading state on the server and stream it to the client for more granular feedback.

Server-side:
```typescript
'use server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from '@ai-sdk/rsc';

export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();
  const loadingState = createStreamableValue({ loading: true });

  (async () => {
    const { textStream } = streamText({
      model: 'anthropic/claude-sonnet-4.5',
      prompt,
    });
    for await (const text of textStream) {
      stream.update(text);
    }
    stream.done();
    loadingState.done({ loading: false });
  })();

  return { response: stream.value, loadingState: loadingState.value };
}
```

Client-side:
```tsx
'use client';
import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          const { response, loadingState } = await generateResponse(input);
          let textContent = '';
          for await (const responseDelta of readStreamableValue(response)) {
            textContent = `${textContent}${responseDelta}`;
            setGeneration(textContent);
          }
          for await (const loadingDelta of readStreamableValue(loadingState)) {
            if (loadingDelta) {
              setLoading(loadingDelta.loading);
            }
          }
          setInput('');
          setLoading(false);
        }}
      >
        <input
          type="text"
          value={input}
          disabled={loading}
          className="disabled:opacity-50"
          onChange={event => setInput(event.target.value)}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### 3. Streaming Loading Components with `streamUI`
Use the `streamUI` function with JavaScript generator functions to yield a loading React component while awaiting the model's response. The generator function can yield intermediate values (like a loading component) before returning the final result.

Server-side (`.tsx` file):
```tsx
'use server';
import { openai } from '@ai-sdk/openai';
import { streamUI } from '@ai-sdk/rsc';

export async function generateResponse(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt,
    text: async function* ({ content }) {
      yield <div>loading...</div>;
      return <div>{content}</div>;
    },
  });

  return result.value;
}
```

Client-side:
```tsx
'use client';
import { useState } from 'react';
import { generateResponse } from './actions';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<React.ReactNode>();

  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const result = await generateResponse(input);
          setGeneration(result);
          setInput('');
        }}
      >
        <input
          type="text"
          value={input}
          onChange={event => setInput(event.target.value)}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.

### error_handling
Handle UI streaming errors with streamableUI.error() and React Error Boundary; handle other streaming errors by returning error objects from try-catch blocks.

## Error Handling in RSC API

The RSC API supports two categories of errors: UI streaming errors and other value streaming errors.

### Handling UI Errors

Use the `streamableUI` object's `error()` method to catch and handle errors during UI generation:

```tsx
'use server';
import { createStreamableUI } from '@ai-sdk/rsc';

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

On the client side, wrap the streamed component with a React Error Boundary to catch additional rendering errors:

```tsx
import { getStreamedUI } from '@/actions';
import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export default function Page() {
  const [streamedUI, setStreamedUI] = useState(null);
  
  return (
    <div>
      <button onClick={async () => setStreamedUI(await getStreamedUI())}>
        What does the new UI look like?
      </button>
      <ErrorBoundary>{streamedUI}</ErrorBoundary>
    </div>
  );
}
```

### Handling Other Streaming Errors

For non-UI streaming, return an error object that the receiver can inspect:

```tsx
'use server';
import { createStreamableValue } from '@ai-sdk/rsc';
import { fetchData, emptyData } from '../utils/data';

export const getStreamedData = async () => {
  const streamableData = createStreamableValue<string>(emptyData);
  
  try {
    (async () => {
      streamableData.update(await fetchData());
      streamableData.update(await fetchData());
      streamableData.done(await fetchData());
    })();
    
    return { data: streamableData.value };
  } catch (e) {
    return { error: e.message };
  }
};
```

**Note:** AI SDK RSC is experimental; use AI SDK UI for production.

### handling_authentication
Validate user authorization in Server Actions by checking cookies before executing protected logic; return error object if token is missing or invalid.

## Authentication in RSC

AI SDK RSC uses Server Actions to power streaming values and UI from the server. Server Actions are exposed as public, unprotected endpoints, so you must treat them as public-facing API endpoints and verify user authorization before returning data.

### Implementation Pattern

Retrieve the authentication token from cookies, validate it, and return an error response if authentication fails:

```tsx
'use server';

import { cookies } from 'next/headers';
import { createStreamableUI } from '@ai-sdk/rsc';
import { validateToken } from '../utils/auth';

export const getWeather = async () => {
  const token = cookies().get('token');

  if (!token || !validateToken(token)) {
    return {
      error: 'This action requires authentication',
    };
  }
  
  const streamableDisplay = createStreamableUI(null);
  streamableDisplay.update(<Skeleton />);
  streamableDisplay.done(<Weather />);

  return {
    display: streamableDisplay.value,
  };
};
```

The pattern is: extract token from cookies, validate it using your auth utility, return error object if invalid, otherwise proceed with the Server Action logic.

**Note:** AI SDK RSC is experimental; use AI SDK UI for production.

### migrating_from_rsc_to_ui
Migrate from experimental AI SDK RSC to production-ready AI SDK UI: separate generation (route handler `streamText`) from rendering (client `useChat`), use tool invocation state for UI, replace server action patterns with route handlers and hooks.

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

