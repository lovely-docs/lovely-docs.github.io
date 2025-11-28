Streaming fails in proxied environments when middleware compresses responses. Fix by adding `'Content-Encoding': 'none'` header to `toUIMessageStreamResponse()`:

```tsx
return result.toUIMessageStreamResponse({
  headers: {
    'Content-Encoding': 'none',
  },
});
```