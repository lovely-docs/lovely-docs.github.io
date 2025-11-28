## Problem
`useChat` displays generic "An error occurred" message due to default error masking in `toDataStreamResponse` for security.

## Solution
Pass `getErrorMessage` function to `toUIMessageStreamResponse()` or `onError` to `createDataStreamResponse()`:

```tsx
export function errorHandler(error: unknown) {
  if (error == null) return 'unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

// With streamText
result.toUIMessageStreamResponse({ getErrorMessage: errorHandler });

// With createDataStreamResponse
createDataStreamResponse({
  async execute(dataStream) { /* ... */ },
  onError: errorHandler,
});
```