## Warnings

The AI SDK displays warnings in the browser console when:
- Unsupported features are used (e.g., certain options or parameters not supported by the model)
- Features are used in compatibility mode, which may work differently or less optimally
- The AI model reports other issues or advisory messages

All warnings are prefixed with "AI SDK Warning:" for easy identification.

Control warning behavior:
- Disable all warnings: `globalThis.AI_SDK_LOG_WARNINGS = false;`
- Custom handler: `globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => { /* handle warnings */ };`

## Error Handling

Each AI SDK UI hook returns an `error` object for rendering errors in the UI. Use it to show error messages, disable submit buttons, or display retry buttons. Recommend showing generic error messages to users to avoid leaking server information.

Example with retry button:
```tsx
const { messages, sendMessage, error, regenerate } = useChat();
{error && (
  <>
    <div>An error occurred.</div>
    <button onClick={() => regenerate()}>Retry</button>
  </>
)}
```

Alternative approach - replace last message on error:
```tsx
const { sendMessage, error, messages, setMessages } = useChat();
function customSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  if (error != null) {
    setMessages(messages.slice(0, -1));
  }
  sendMessage({ text: input });
}
```

Process errors with `onError` callback in hook options:
```tsx
const { /* ... */ } = useChat({
  onError: error => {
    console.error(error);
  },
});
```

For testing, throw errors in route handlers:
```ts
export async function POST(req: Request) {
  throw new Error('This is a test error');
}
```