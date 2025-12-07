Three approaches to handle loading state:

1. **Client-side**: Set loading state variable, disable input while streaming response
2. **Server-streamed loading state**: Create separate streamable value for loading state, read both response and loading updates on client
3. **Streaming UI components**: Use `streamUI` with generator functions to yield loading component while awaiting model response

All approaches use `createStreamableValue()` on server and `readStreamableValue()` on client to handle streaming.