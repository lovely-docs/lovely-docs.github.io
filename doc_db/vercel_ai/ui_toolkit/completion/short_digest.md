## useCompletion Hook

React hook for streaming text completions with real-time UI updates.

### Basic Setup
```tsx
const { completion, input, handleInputChange, handleSubmit } = useCompletion({
  api: '/api/completion',
});
```

### Key Features
- **State**: `completion`, `input`, `isLoading`, `error`
- **Input control**: `handleInputChange`, `handleSubmit`, or `setInput` for custom components
- **Cancellation**: `stop()` function to abort streaming
- **Throttling**: `experimental_throttle` option (React only) to reduce render frequency
- **Callbacks**: `onResponse`, `onFinish`, `onError` for lifecycle events
- **Request options**: Customize `api`, `headers`, `body`, `credentials`

### Example with Error Handling
```tsx
const { completion, isLoading, error, stop } = useCompletion();
return (
  <>
    {isLoading && <Spinner />}
    {error && <div>{error.message}</div>}
    <button onClick={stop} disabled={!isLoading}>Stop</button>
    <div>{completion}</div>
  </>
);
```