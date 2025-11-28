When streaming works locally but fails in deployed environments, the full response returns after a delay instead of streaming incrementally. This is caused by deployment environment configurations that don't properly support streaming responses.

To fix this, add HTTP headers to the response:
```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Transfer-Encoding': 'chunked',
    Connection: 'keep-alive',
  },
});
```

The `Transfer-Encoding: chunked` header enables chunked transfer encoding for streaming, and `Connection: keep-alive` maintains the connection for multiple chunks.