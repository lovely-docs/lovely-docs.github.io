## Issue
`useChat` or `useCompletion` throws "Failed to parse stream string. Invalid code" error in AI SDK 3.0.20+.

## Cause
SDK switched to stream data protocol; error occurs with older backend versions, custom text providers, or raw LangChain streams.

## Solution
Set `streamProtocol: 'text'` to process raw text streams:
```tsx
const { messages, append } = useChat({ streamProtocol: 'text' });
```