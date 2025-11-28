Azure OpenAI streaming is slow and chunky due to default content filtering settings. Fix by changing "Streaming mode (Preview)" to "Asynchronous Filter" in Azure AI Studio's content filters, or use `smoothStream()` transformation to stream word-by-word:

```tsx
const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```