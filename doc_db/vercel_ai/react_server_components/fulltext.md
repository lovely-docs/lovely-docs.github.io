

## Pages

### rsc_overview
Experimental RSC integration enabling LLMs to generate and stream React Server Components from server to client via streamable values and state management hooks.

## AI SDK RSC

Experimental package for building AI applications with React Server Components (RSC). RSCs render UI on the server and stream to client; combined with Server Actions, they enable LLMs to generate and stream UI directly from server to client.

### Core Functions

**Generative UI Abstractions:**
- `streamUI`: calls a model and allows it to respond with React Server Components
- `useUIState`: returns current UI state and update function (like React's `useState`). UI State is the visual representation of AI state
- `useAIState`: returns current AI state and update function (like React's `useState`). AI state contains context shared with the model (system messages, function responses, etc.)
- `useActions`: provides access to Server Actions from the client for user interactions
- `createAI`: creates a client-server context provider to wrap application tree and manage UI and AI states

**Streamable Values:**
- `createStreamableValue`: creates a stream sending serializable values from server to client
- `readStreamableValue`: reads a streamable value from client created with `createStreamableValue`
- `createStreamableUI`: creates a stream sending UI from server to client
- `useStreamableValue`: accepts streamable value and returns current value, error, and pending state

### Compatibility

The `@ai-sdk/rsc` package is compatible with frameworks that support React Server Components.

### streaming_react_components
Stream React components server-to-client with `streamUI`; tools return components via generator functions that yield loading states before final UI.

## Overview

The `streamUI` function streams React Server Components from server to client. Unlike `streamText` or `streamObject`, tools provided to `streamUI` return React components instead of text/objects. The model acts as a dynamic router, understanding user intent and displaying relevant UI.

## Basic Usage

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {},
});
```

The `text` handler renders plain text responses as React components. Even with no tools, responses stream as components rather than plain text.

## Tools with streamUI

Tools are objects with:
- `description`: what the tool does
- `inputSchema`: Zod schema for inputs
- `generate`: async generator function returning a React component

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

The `generate` function uses a generator (`function*`) to yield intermediate components (like loading states) before returning the final component. This allows streaming UI updates as data loads.

## Next.js Integration

### Server Action (app/actions.tsx)

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

const WeatherComponent = ({ location, weather }: { location: string; weather: string }) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {location} is {weather}
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

### Client Page (app/page.tsx)

```tsx
'use client';
import { useState } from 'react';
import { streamComponent } from './actions';

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();
  return (
    <div>
      <form onSubmit={async e => { e.preventDefault(); setComponent(await streamComponent()); }}>
        <button>Stream Component</button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```

The Server Action calls `streamUI` and returns `result.value`. The client component calls this action on form submission and renders the returned ReactNode.

## Key Concepts

- `streamUI` requires returning a React component (via `text` handler or tool `generate` function)
- Tools with `streamUI` work like other AI SDK Core tools but return components
- Generator functions in tool `generate` allow yielding intermediate UI (loading states) before final result
- Model decides whether to call tools based on context; if no relevant tool, uses `text` handler
- Currently experimental; AI SDK UI recommended for production

### managing-generative-ui-state
Split state into AI State (serializable JSON for LLM, server/client accessible) and UI State (client-only React elements); use createAI context with useUIState/useAIState/getAIState/getMutableAIState hooks and useActions to manage them.

## Overview

State management in AI applications requires special handling because LLMs need serializable context. With Generative UI, models return React components which aren't serializable, so state must be split into two parts: AI State (serializable, sent to model) and UI State (client-side, can contain React elements).

## AI State vs UI State

**AI State**: Serializable JSON representation of application state used on server and shared with LLM. For chat apps, it's the conversation history with messages containing role and content. Can also store metadata like `createdAt` and `chatId`. Accessible/modifiable from both server and client. Serves as source of truth.

**UI State**: Client-side only state (like `useState`) containing actual rendered UI elements. Can store JavaScript values and React elements.

## Setup with createAI

Define types and create context:

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
  actions: { sendMessage },
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

## Reading State

**UI State (client)** with `useUIState`:
```tsx
'use client';
import { useUIState } from '@ai-sdk/rsc';

export default function Page() {
  const [messages, setMessages] = useUIState();
  return <ul>{messages.map(m => <li key={m.id}>{m.display}</li>)}</ul>;
}
```

**AI State (client)** with `useAIState`:
```tsx
'use client';
import { useAIState } from '@ai-sdk/rsc';

export default function Page() {
  const [messages, setMessages] = useAIState();
  return <ul>{messages.map(m => <li key={m.id}>{m.content}</li>)}</ul>;
}
```

**AI State (server)** with `getAIState` in Server Actions:
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

## Updating AI State on Server

Use `getMutableAIState` to read and update:
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

Use `.update()` for intermediate updates and `.done()` for final state.

## Calling Server Actions from Client

Use `useActions` hook to access actions:
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

## Key Points

- AI State is the source of truth, passed to LLM
- UI State is client-only, can contain React components
- Use `createAI` to set up context with initial states and actions
- Access AI State server-side with `getAIState` or `getMutableAIState` within registered actions
- Access both states client-side with `useAIState` and `useUIState`
- Call server actions from client with `useActions`
- Always update UI State after server action calls

### saving-and-restoring-states
Save AI state via onSetAIState callback and initialAIState prop; restore UI state via onGetUIState by using AI state as proxy and syncing with database.

## AI State

**Saving AI state** uses the `onSetAIState` callback, invoked whenever AI state updates:

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: { continueConversation },
  onSetAIState: async ({ state, done }) => {
    'use server';
    if (done) saveChatToDB(state);
  },
});
```

**Restoring AI state** uses the `initialAIState` prop on the context provider:

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

**Saving UI state** is not directly possible since contents aren't serializable. Use AI state as a proxy to store UI state details.

**Restoring UI state** uses the `onGetUIState` callback to listen for SSR events and restore UI from AI state:

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

### multistep-interfaces
Build multi-step UIs with tool composition and application context; tools use async generators to yield intermediate UI then final components; client components use useActions/useUIState for interactivity.

## Multistep Interfaces with AI SDK RSC

Multistep interfaces are UIs requiring multiple independent steps to complete a task. Example: flight booking with steps for searching flights, picking a flight, and checking availability.

### Key Concepts

**Tool composition**: Combining multiple tools to create a new tool, breaking complex tasks into manageable steps.

**Application context**: The state of the application including user input, model output, and relevant information passed between steps.

### Architecture

Required components:
- Server Action calling `streamUI` function
- Tool(s) defining sub-tasks
- React component(s) rendered when tools are called
- Page rendering the chatbot

Flow:
1. User sends message via Server Action with `useActions`
2. Message appended to AI State, passed to model with tools
3. Model calls tool, rendering component
4. Component uses `useActions` to call model and `useUIState` to append response
5. Process repeats

### Turn-by-Turn Implementation

Define tools with `streamUI`:

```tsx
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const searchFlights = async (source: string, destination: string, date: string) => {
  return [{ id: '1', flightNumber: 'AA123' }, { id: '2', flightNumber: 'AA456' }];
};

const lookupFlight = async (flightNumber: string) => {
  return { flightNumber, departureTime: '10:00 AM', arrivalTime: '12:00 PM' };
};

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

Create AI context:

```ts
import { createAI } from '@ai-sdk/rsc';
import { submitUserMessage } from './actions';

export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: { submitUserMessage },
});
```

Wrap application in layout:

```tsx
import { AI } from './ai';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AI>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AI>
  );
}
```

Render chatbot on page:

```tsx
'use client';

import { useState } from 'react';
import { useActions, useUIState } from '@ai-sdk/rsc';
import { AI } from './ai';

export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [...currentConversation, <div>{input}</div>]);
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

### Adding Interactivity

Convert tool components to client components using `useActions` and `useUIState` to trigger next steps:

```tsx
'use client';

import { useActions, useUIState } from '@ai-sdk/rsc';
import { ReactNode } from 'react';

interface FlightsProps {
  flights: { id: string; flightNumber: string }[];
}

export const Flights = ({ flights }: FlightsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();

  return (
    <div>
      {flights.map(result => (
        <div
          key={result.id}
          onClick={async () => {
            const display = await submitUserMessage(`lookupFlight ${result.flightNumber}`);
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

Update tool to render interactive component:

```tsx
searchFlights: {
  description: 'search for flights',
  parameters: z.object({
    source: z.string().describe('The origin of the flight'),
    destination: z.string().describe('The destination of the flight'),
    date: z.string().describe('The date of the flight'),
  }),
  generate: async function* ({ source, destination, date }) {
    yield `Searching for flights from ${source} to ${destination} on ${date}...`;
    const results = await searchFlights(source, destination, date);
    return <Flights flights={results} />;
  },
}
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.

### streaming-values
RSC API provides `createStreamableValue` and `createStreamableUI` for server-to-client streaming with `.update()` and `.done()` methods; read with `readStreamableValue` async iterator or direct component rendering.

## Streaming Values Overview

The RSC API provides utilities to stream values from server to client with granular control. Two main functions:

### `createStreamableValue`

Creates a streamable serializable value (strings, numbers, objects, arrays). Useful for streaming text generations, buffer values from multi-modal models, or progress updates.

**Example:**
```tsx
// Server Action
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

// Client
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

Read with `readStreamableValue`, which returns an async iterator yielding updated values.

### `createStreamableUI`

Creates a stream holding a React component. Provides granular control over streaming React components without calling an LLM.

**Example:**
```tsx
// Server Action
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

// Client
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

The `.value` property contains the UI to send to client. Call `.update()` to stream intermediate states, `.done()` to finalize.

These utilities pair with AI SDK Core functions like `streamText` and `streamObject` for streaming LLM generations.

### loading-state
Three patterns for loading state: client-side state management, server-streamed loading state via separate streamable value, or streaming React components via streamUI with generator functions.

## Handling Loading State

Three approaches to manage loading state with AI SDK RSC:

### 1. Client-side Loading State
Traditional approach: manage loading state variable on client, disable input while streaming.

```tsx
'use client';
import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from '@ai-sdk/rsc';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState('');
  const [generation, setGeneration] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div>{generation}</div>
      <form onSubmit={async e => {
        e.preventDefault();
        setLoading(true);
        const response = await generateResponse(input);
        let textContent = '';
        for await (const delta of readStreamableValue(response)) {
          textContent += delta;
          setGeneration(textContent);
        }
        setInput('');
        setLoading(false);
      }}>
        <input type="text" value={input} disabled={loading} onChange={e => setInput(e.target.value)} />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

Server-side:
```ts
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
Create separate streamable value for loading state, read both response and loading state on client.

Server:
```ts
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

Client:
```tsx
const { response, loadingState } = await generateResponse(input);
for await (const responseDelta of readStreamableValue(response)) {
  textContent += responseDelta;
  setGeneration(textContent);
}
for await (const loadingDelta of readStreamableValue(loadingState)) {
  if (loadingDelta) setLoading(loadingDelta.loading);
}
```

### 3. Streaming Loading Components with `streamUI`
Use `streamUI` with JavaScript generator functions to yield loading component while awaiting model response.

Server (.tsx file):
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

Client:
```tsx
'use client';
import { useState } from 'react';
import { generateResponse } from './actions';

export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState('');
  const [generation, setGeneration] = useState<React.ReactNode>();

  return (
    <div>
      <div>{generation}</div>
      <form onSubmit={async e => {
        e.preventDefault();
        const result = await generateResponse(input);
        setGeneration(result);
        setInput('');
      }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

Note: AI SDK RSC is experimental; use AI SDK UI for production.

### error-handling
Handle RSC streaming errors via streamableUI.error() for UI or try-catch returning error objects for other values; optionally use React Error Boundary on client.

## Handling UI Errors

Use the `streamableUI` object's `error()` method to catch errors during UI generation:

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

On the client, wrap the streamed component with a React Error Boundary to catch additional rendering errors:

```tsx
import { getStreamedUI } from '@/actions';
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

## Handling Other Errors

For non-UI streaming errors, return an error object from the server action:

```tsx
'use server';
import { createStreamableValue } from '@ai-sdk/rsc';

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

Note: AI SDK RSC is experimental; use AI SDK UI for production.

### authentication
Protect Server Actions by validating authentication tokens from cookies before executing protected logic.

## Authentication in RSC

Server Actions are exposed as public, unprotected endpoints. Treat them like public-facing API endpoints and validate user authorization before returning data.

**Example: Protected Server Action**

```tsx
'use server';

import { cookies } from 'next/headers';
import { createStreamableUI } from '@ai-sdk/rsc';
import { validateToken } from '../utils/auth';

export const getWeather = async () => {
  const token = cookies().get('token');

  if (!token || !validateToken(token)) {
    return { error: 'This action requires authentication' };
  }

  const streamableDisplay = createStreamableUI(null);
  streamableDisplay.update(<Skeleton />);
  streamableDisplay.done(<Weather />);

  return { display: streamableDisplay.value };
};
```

Extract authentication tokens from cookies, validate them before processing, and return error responses for unauthorized requests.

### migrating-to-ui
Migration guide from experimental AI SDK RSC to production-ready UI: separate generation (streamText in route handler) from rendering (useChat hook), use tool invocations for generative UI, sync child components via useChat id, save with onFinish callback, restore via initialMessages.

## Migrating from AI SDK RSC to AI SDK UI

AI SDK RSC is experimental and unsuitable for production due to significant limitations:
- Cannot abort streams using server actions
- Components remount on `.done()` causing flicker
- Many suspense boundaries can crash
- `createStreamableUI` causes quadratic data transfer
- Closed RSC streams cause update issues

AI SDK UI is the recommended stable alternative with production-grade features: language model middleware, multi-step tool calls, attachments, telemetry, provider registry.

### Streaming Chat Completions

**Before (RSC):** `streamUI` in server action combines generation and rendering
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
export default function Page() {
  const { sendMessage } = useActions();
  const [messages, setMessages] = useUIState();
  return (
    <div>
      {messages.map(message => message)}
      <form onSubmit={async () => {
        const response = await sendMessage(input);
        setMessages(msgs => [...msgs, response]);
      }}>
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```

**After (UI):** Separate concerns - `streamText` in route handler, `useChat` on client
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

// @/app/page.tsx
'use client';
export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Parallel and Multi-Step Tool Calls

RSC `streamUI` doesn't support parallel or multi-step tool calls. UI `useChat` has built-in support - define multiple tools in `streamText` and set `maxSteps` for multi-step calls; `useChat` handles them automatically.

### Generative User Interfaces

**Before (RSC):** Render components in server action
```tsx
// @/app/actions.tsx
const { value: stream } = await streamUI({
  model: openai('gpt-4o'),
  system: 'you are a friendly assistant!',
  messages,
  text: async function* ({ content, done }) { /* process text */ },
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

**After (UI):** Stream props data, render on client
```ts
// @/app/api/chat/route.ts
export async function POST(request) {
  const { messages } = await request.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly assistant!',
    messages,
    tools: {
      displayWeather: {
        description: 'Display the weather for a location',
        parameters: z.object({ latitude: z.number(), longitude: z.number() }),
        execute: async ({ latitude, longitude }) => {
          const props = await getWeather({ latitude, longitude });
          return props;
        },
      },
    },
  });
  return result.toUIMessageStreamResponse();
}

// @/app/page.tsx
'use client';
export default function Page() {
  const { messages, input, setInput, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
          <div>
            {message.toolInvocations?.map(toolInvocation => {
              const { toolName, toolCallId, state } = toolInvocation;
              if (state === 'result') {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <Weather weatherAtLocation={toolInvocation.result} />
                    ) : null}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId}>
                    {toolName === 'displayWeather' ? (
                      <div>Loading weather...</div>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Handling Client Interactions

**Before (RSC):** Components use `useActions` hook to trigger server actions
```tsx
// @/app/components/list-flights.tsx
'use client';
export function ListFlights({ flights }) {
  const { sendMessage } = useActions();
  const [_, setMessages] = useUIState();
  return (
    <div>
      {flights.map(flight => (
        <div key={flight.id} onClick={async () => {
          const response = await sendMessage(`I would like to choose flight ${flight.id}!`);
          setMessages(msgs => [...msgs, response]);
        }}>
          {flight.name}
        </div>
      ))}
    </div>
  );
}
```

**After (UI):** Initialize `useChat` with same `id` in component
```tsx
// @/app/components/list-flights.tsx
'use client';
export function ListFlights({ chatId, flights }) {
  const { append } = useChat({ id: chatId, body: { id: chatId }, maxSteps: 5 });
  return (
    <div>
      {flights.map(flight => (
        <div key={flight.id} onClick={async () => {
          await append({
            role: 'user',
            content: `I would like to choose flight ${flight.id}!`,
          });
        }}>
          {flight.name}
        </div>
      ))}
    </div>
  );
}
```

### Loading Indicators

**Before (RSC):** Use `initial` parameter in `streamUI`
```tsx
const { value: stream } = await streamUI({
  model: openai('gpt-4o'),
  system: 'you are a friendly assistant!',
  messages,
  initial: <div>Loading...</div>,
  text: async function* ({ content, done }) { /* process text */ },
  tools: { /* tool definitions */ },
});
```

**After (UI):** Use tool invocation state
```tsx
// @/app/components/message.tsx
'use client';
export function Message({ role, content, toolInvocations }) {
  return (
    <div>
      <div>{role}</div>
      <div>{content}</div>
      {toolInvocations && (
        <div>
          {toolInvocations.map(toolInvocation => {
            const { toolName, toolCallId, state } = toolInvocation;
            if (state === 'result') {
              return (
                <div key={toolCallId}>
                  {toolName === 'getWeather' ? (
                    <Weather weatherAtLocation={toolInvocation.result} />
                  ) : null}
                </div>
              );
            } else {
              return (
                <div key={toolCallId}>
                  {toolName === 'getWeather' ? (
                    <Weather isLoading={true} />
                  ) : (
                    <div>Loading...</div>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
```

### Saving Chats

**Before (RSC):** Use `onSetAIState` callback in `createAI` context provider
```ts
// @/app/actions.ts
export const AI = createAI({
  initialAIState: {},
  initialUIState: {},
  actions: { /* server actions */ },
  onSetAIState: async ({ state, done }) => {
    'use server';
    if (done) {
      await saveChat(state);
    }
  },
});
```

**After (UI):** Use `onFinish` callback in `streamText`
```ts
// @/app/api/chat/route.ts
export async function POST(request) {
  const { id, messages } = await request.json();
  const coreMessages = convertToModelMessages(messages);
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'you are a friendly assistant!',
    messages: coreMessages,
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
  return result.toUIMessageStreamResponse();
}
```

### Restoring Chats

**Before (RSC):** Use `onGetUIState` callback in `createAI`
```ts
// @/app/actions.ts
export const AI = createAI({
  actions: { /* server actions */ },
  onGetUIState: async () => {
    'use server';
    const chat = await loadChatFromDB();
    const uiState = convertToUIState(chat);
    return uiState;
  },
});
```

**After (UI):** Load messages during page static generation and pass as `initialMessages`
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
'use client';
export function Chat({ id, initialMessages }: { id; initialMessages: Array<Message> }) {
  const { messages } = useChat({ id, initialMessages });
  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
        </div>
      ))}
    </div>
  );
}
```

## Streaming Object Generation

**Before (RSC):** Use `createStreamableValue` with `streamObject`
```ts
// @/app/actions.ts
export async function generateSampleNotifications() {
  'use server';
  const stream = createStreamableValue();
  (async () => {
    const { partialObjectStream } = streamObject({
      model: 'anthropic/claude-sonnet-4.5',
      system: 'generate sample ios messages for testing',
      prompt: 'messages from a family group chat during diwali, max 4',
      schema: notificationsSchema,
    });
    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }
  })();
  stream.done();
  return { partialNotificationsStream: stream.value };
}

// @/app/page.tsx
'use client';
export default function Page() {
  const [notifications, setNotifications] = useState(null);
  return (
    <div>
      <button onClick={async () => {
        const { partialNotificationsStream } = await generateSampleNotifications();
        for await (const partialNotifications of readStreamableValue(partialNotificationsStream)) {
          if (partialNotifications) {
            setNotifications(partialNotifications.notifications);
          }
        }
      }}>
        Generate
      </button>
    </div>
  );
}
```

**After (UI):** Use `useObject` hook with `streamObject` in route handler
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
'use client';
export default function Page() {
  const { object, submit } = useObject({
    api: '/api/object',
    schema: notificationSchema,
  });
  return (
    <div>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>
      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```

