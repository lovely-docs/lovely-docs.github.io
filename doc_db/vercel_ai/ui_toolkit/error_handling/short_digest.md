## Warnings
Warnings appear in console when unsupported features or compatibility issues occur. Prefix: "AI SDK Warning:". Control with `globalThis.AI_SDK_LOG_WARNINGS = false;` or provide custom handler: `globalThis.AI_SDK_LOG_WARNINGS = ({ warnings, provider, model }) => {};`

## Error Handling
Hooks return `error` object for UI rendering. Show generic error messages to users. Use `regenerate()` for retry or `setMessages()` to replace last message. Handle errors with `onError` callback:
```tsx
useChat({ onError: error => console.error(error) })
```
Test by throwing errors in route handlers.