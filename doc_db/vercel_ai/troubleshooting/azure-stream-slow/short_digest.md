Azure OpenAI streaming is slow/chunky. Fix by: (1) changing Azure AI Studio content filter "Streaming mode" from "Default" to "Asynchronous Filter", or (2) using `smoothStream()` transformation to stream word-by-word:

```tsx
streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
})
```