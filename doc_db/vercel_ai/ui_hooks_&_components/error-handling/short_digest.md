## Warnings

Control console warnings with `globalThis.AI_SDK_LOG_WARNINGS = false` or provide a custom handler `({ warnings, provider, model }) => {}`.

## Error Handling

Use the `error` object from `useChat`/`useCompletion` hooks to display errors and disable inputs. Handle errors via the `onError` callback or by checking the error state. Show generic error messages to users. Retry with `regenerate()` or replace the last message with `setMessages(messages.slice(0, -1))` before resending.