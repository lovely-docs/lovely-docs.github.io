## AI_InvalidPromptError

Thrown when an invalid prompt is provided. Most commonly occurs when passing `UIMessage[]` instead of `ModelMessage[]` to functions like `streamText` or `generateText`.

**Fix:** Convert messages using `convertToModelMessages()`:
```typescript
import { convertToModelMessages } from 'ai';
const result = await generateText({
  messages: convertToModelMessages(messages),
});
```

**Check for error:** `InvalidPromptError.isInstance(error)`