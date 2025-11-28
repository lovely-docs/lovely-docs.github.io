When using the AI SDK in a proxied environment (local development or deployed behind a proxy), streaming responses may fail and return only the full response after a delay instead of streaming incrementally.

**Cause**: Proxy middleware configured to compress responses breaks streaming functionality.

**Solution**: Disable content encoding by adding the `'Content-Encoding': 'none'` header to the streaming response:

```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Content-Encoding': 'none',
  },
});
```

This header configuration only affects the streaming API and prevents the proxy from compressing the response, allowing streaming to work correctly.