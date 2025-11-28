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