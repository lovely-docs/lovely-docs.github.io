After upgrading to AI SDK v3.0.20+, client-side function calls via OpenAIStream stop working. Add an `experimental_onFunctionCall` stub to OpenAIStream options to re-enable function call forwarding:

```tsx
const stream = OpenAIStream(response, {
  async experimental_onFunctionCall() {
    return;
  },
});
```