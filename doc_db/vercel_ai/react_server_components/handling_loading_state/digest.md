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