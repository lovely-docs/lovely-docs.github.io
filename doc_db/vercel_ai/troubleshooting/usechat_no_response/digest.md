When using `useChat`, if tool calls and tool results appear in server logs but the model doesn't respond, the issue is that incoming messages need to be converted to the `ModelMessage` format before being passed to `streamText`.

Use the `convertToModelMessages` function to convert messages before streaming:

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

The `convertToModelMessages` function transforms the UI message format (which includes tool calls and results) into the format expected by language models, allowing the model to properly process the conversation context and generate a response.