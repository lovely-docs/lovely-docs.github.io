Error messages are masked by default in `toDataStreamResponse` for security. Use `getErrorMessage` with `toUIMessageStreamResponse` or `onError` with `createDataStreamResponse` to expose error details:

```tsx
function errorHandler(error: unknown) {
  if (error == null) return 'unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

// With streamText
result.toUIMessageStreamResponse({ getErrorMessage: errorHandler });

// With createDataStreamResponse
createDataStreamResponse({
  onError: errorHandler,
  async execute(dataStream) { /* ... */ }
});
```