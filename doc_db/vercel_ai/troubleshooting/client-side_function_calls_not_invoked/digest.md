When upgrading to AI SDK v3.0.20 or newer, client-side function calls may stop being invoked when using OpenAIStream. This occurs because the function call forwarding mechanism to the client is not properly enabled.

To fix this issue, add a stub for `experimental_onFunctionCall` to the OpenAIStream options:

```tsx
const stream = OpenAIStream(response, {
  async experimental_onFunctionCall() {
    return;
  },
});
```

This empty async function enables the correct forwarding of function calls from the stream to the client side, restoring the expected behavior after the upgrade.