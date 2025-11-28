When using custom client code with `StreamingTextResponse` in AI SDK version 3.0.20 or newer, the streamed output may display raw stream data protocol format like `0: "Je"`, `0: " suis"` instead of plain text.

**Root cause**: AI SDK 3.0.20 switched to a stream data protocol that sends different stream parts to support data, tool calls, and other features. What appears in the UI is the raw protocol response.

**Solutions**:

1. Use the `streamText` function from AI Core to send a raw text stream:
```tsx
export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const result = streamText({
    model: openai.completion('gpt-3.5-turbo-instruct'),
    maxOutputTokens: 2000,
    prompt,
  });
  
  return result.toTextStreamResponse();
}
```

2. Pin the AI SDK version to 3.0.19 to keep the raw text stream behavior.