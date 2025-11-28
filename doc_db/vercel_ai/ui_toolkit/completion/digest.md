## useCompletion Hook

The `useCompletion` hook (from `@ai-sdk/react`) creates a UI for handling text completions with real-time streaming from AI providers. It manages chat input state and automatically updates the UI as new text arrives.

### Basic Usage

```tsx
import { useCompletion } from '@ai-sdk/react';

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: '/api/completion',
  });

  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

Server-side handler:
```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    prompt,
  });
  return result.toUIMessageStreamResponse();
}
```

### State Management

- `completion`: The streamed text response
- `input`: Current input value
- `isLoading`: Boolean indicating if request is in progress
- `error`: Error object from failed requests

### Input Control

Use `handleInputChange` and `handleSubmit` for standard form handling, or use `setInput` for granular control with custom components:

```tsx
const { input, setInput } = useCompletion();
return <MyCustomInput value={input} onChange={value => setInput(value)} />;
```

### Cancellation

Call the `stop()` function to abort streaming:

```tsx
const { stop, isLoading } = useCompletion();
return <button onClick={stop} disabled={!isLoading}>Stop</button>;
```

### UI Update Throttling

Throttle renders when receiving chunks with `experimental_throttle` (React only):

```tsx
const { completion } = useCompletion({
  experimental_throttle: 50 // milliseconds
});
```

### Event Callbacks

```tsx
const { ... } = useCompletion({
  onResponse: (response: Response) => {
    console.log('Received response:', response);
  },
  onFinish: (prompt: string, completion: string) => {
    console.log('Finished:', completion);
  },
  onError: (error: Error) => {
    console.error('Error:', error);
  },
});
```

Throwing an error in `onResponse` aborts processing and triggers `onError`.

### Request Customization

```tsx
const { ... } = useCompletion({
  api: '/api/custom-completion',
  headers: { Authorization: 'token' },
  body: { user_id: '123' },
  credentials: 'same-origin',
});
```

Customize the endpoint, headers, additional body fields, and fetch credentials.