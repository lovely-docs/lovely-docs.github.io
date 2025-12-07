## Multistep Interfaces with AI SDK RSC

Build multi-step UIs using **tool composition** (combining tools into larger tasks) and **application context** (state passed between steps).

### Architecture

- Server Action with `streamUI` function
- Tools with `generate` async generators yielding intermediate UI then final component
- AI context via `createAI` with `initialUIState` and `initialAIState`
- Page using `useUIState` to display conversation and `useActions` to call Server Action

### Example: Flight Booking

```tsx
// actions.tsx
import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

export async function submitUserMessage(input: string) {
  'use server';
  return (await streamUI({
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
      lookupFlight: {
        description: 'lookup details for a flight',
        parameters: z.object({ flightNumber: z.string() }),
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
  })).value;
}

// ai.ts
import { createAI } from '@ai-sdk/rsc';
export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: { submitUserMessage },
});

// layout.tsx
import { AI } from './ai';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <AI><html><body>{children}</body></html></AI>;
}

// page.tsx
'use client';
import { useState } from 'react';
import { useActions, useUIState } from '@ai-sdk/rsc';
import { AI } from './ai';

export default function Page() {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(c => [...c, <div>{input}</div>]);
    const message = await submitUserMessage(input);
    setConversation(c => [...c, message]);
  };

  return (
    <div>
      <div>{conversation.map((msg, i) => <div key={i}>{msg}</div>)}</div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}

// components/flights.tsx - Interactive component
'use client';
import { useActions, useUIState } from '@ai-sdk/rsc';
import { ReactNode } from 'react';

export const Flights = ({ flights }: { flights: { id: string; flightNumber: string }[] }) => {
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

Tools use `generate` async generators to yield loading state then final UI. Client components use `useActions` to trigger next steps and `useUIState` to update conversation.