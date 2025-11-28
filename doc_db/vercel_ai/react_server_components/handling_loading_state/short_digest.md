Three approaches to handle loading state in AI SDK RSC:

1. **Client-side state**: Manage loading with a state variable, set to true on form submit and false when response completes. Disable input while loading.

2. **Server-streamed loading state**: Create separate streamable value for loading state on server, stream it to client for granular feedback.

3. **Streaming UI components**: Use `streamUI` with generator functions to yield loading React components while awaiting model response.

All approaches use `createStreamableValue()` on server and `readStreamableValue()` on client to handle streaming. Set `maxDuration = 30` for streaming responses.