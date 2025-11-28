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