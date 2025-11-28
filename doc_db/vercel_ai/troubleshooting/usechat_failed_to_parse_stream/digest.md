## Issue
When using `useChat` or `useCompletion` with AI SDK version 3.0.20 or newer, you may encounter a "Failed to parse stream string. Invalid code" error.

## Root Cause
The AI SDK switched to a stream data protocol in version 3.0.20. The `useChat` and `useCompletion` hooks expect stream parts that support data, tool calls, and other features. The error occurs when the stream format doesn't match this protocol. Common causes include:
- Using an older version of the AI SDK in the backend
- Providing a text stream using a custom provider
- Using a raw LangChain stream result

## Solution
Switch `useChat` and `useCompletion` to raw text stream processing by setting the `streamProtocol` parameter to `'text'`:

```tsx
const { messages, append } = useChat({ streamProtocol: 'text' });
```

This allows the hooks to process plain text streams instead of expecting the structured stream data protocol format.