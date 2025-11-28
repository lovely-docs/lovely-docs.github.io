Middleware that extracts XML-tagged reasoning sections from generated text, separating reasoning from final output.

```ts
const middleware = extractReasoningMiddleware({
  tagName: 'reasoning',
  separator: '\n',
  startWithReasoning: false, // optional
});
```

Parameters: `tagName` (required), `separator` (optional, defaults to `\n`), `startWithReasoning` (optional, defaults to false). Returns middleware that processes streaming/non-streaming responses, extracts content between XML tags as reasoning, removes tags from main text, and adds `reasoning` property to result.