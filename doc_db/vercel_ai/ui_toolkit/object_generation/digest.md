## Overview
`useObject` is an experimental React/Svelte/Vue hook for streaming structured JSON objects from the server. It displays partial results as they arrive, enabling real-time UI updates for generated data.

## Basic Usage
Define a Zod schema in a shared file:
```ts
import { z } from 'zod';
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

Client-side with `useObject`:
```tsx
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { notificationSchema } from './api/notifications/schema';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });

  return (
    <>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>
      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </>
  );
}
```

Server-side with `streamObject`:
```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';

export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();
  const result = streamObject({
    model: 'anthropic/claude-sonnet-4.5',
    schema: notificationSchema,
    prompt: `Generate 3 notifications for a messages app in this context:` + context,
  });
  return result.toTextStreamResponse();
}
```

Handle undefined values in JSX since results are partial during streaming.

## Enum Output Mode
For classification into predefined options, use `output: 'enum'` with a schema containing `enum` as a key:

Client:
```tsx
const { object, submit, isLoading } = useObject({
  api: '/api/classify',
  schema: z.object({ enum: z.enum(['true', 'false']) }),
});

return (
  <>
    <button onClick={() => submit('The earth is flat')} disabled={isLoading}>
      Classify statement
    </button>
    {object && <div>Classification: {object.enum}</div>}
  </>
);
```

Server:
```ts
const result = streamObject({
  model: 'anthropic/claude-sonnet-4.5',
  output: 'enum',
  enum: ['true', 'false'],
  prompt: `Classify this statement as true or false: ${context}`,
});
return result.toTextStreamResponse();
```

## State Management
`useObject` returns:
- `object`: The streamed object (partial during generation)
- `isLoading`: Boolean indicating generation in progress
- `error`: Error object from fetch request
- `submit(input)`: Function to trigger generation
- `stop()`: Function to cancel generation

## UI Patterns

Loading state with spinner and disabled button:
```tsx
const { isLoading, object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {isLoading && <Spinner />}
    <button onClick={() => submit('...')} disabled={isLoading}>
      Generate notifications
    </button>
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

Stop button during generation:
```tsx
const { isLoading, stop, object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {isLoading && <button onClick={() => stop()}>Stop</button>}
    <button onClick={() => submit('...')}>Generate notifications</button>
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

Error handling (show generic message to avoid leaking server info):
```tsx
const { error, object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
});

return (
  <>
    {error && <div>An error occurred.</div>}
    <button onClick={() => submit('...')}>Generate notifications</button>
    {object?.notifications?.map((notification, index) => (
      <div key={index}>
        <p>{notification?.name}</p>
        <p>{notification?.message}</p>
      </div>
    ))}
  </>
);
```

## Event Callbacks
`useObject` accepts optional callbacks:
- `onFinish({ object, error })`: Called when generation completes. `object` is typed and undefined if schema validation fails; `error` is undefined if validation succeeds.
- `onError(error)`: Called on fetch errors.

```tsx
const { object, submit } = useObject({
  api: '/api/notifications',
  schema: notificationSchema,
  onFinish({ object, error }) {
    console.log('Object generation completed:', object);
    console.log('Schema validation error:', error);
  },
  onError(error) {
    console.error('An error occurred:', error);
  },
});
```

## Configuration
Configure API endpoint, headers, and credentials:
```tsx
const { submit, object } = useObject({
  api: '/api/use-object',
  headers: {
    'X-Custom-Header': 'CustomValue',
  },
  credentials: 'include',
  schema: yourSchema,
});
```