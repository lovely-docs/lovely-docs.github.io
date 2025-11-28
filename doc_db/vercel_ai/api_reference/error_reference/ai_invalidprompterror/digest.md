## AI_InvalidPromptError

Thrown when an invalid prompt is provided to functions like `streamText` or `generateText`.

### Common Cause: UIMessage[] Instead of ModelMessage[]

The most common cause is passing `UIMessage[]` directly as messages when the function expects `ModelMessage[]`. Convert using `convertToModelMessages()`:

```typescript
import { type UIMessage, generateText, convertToModelMessages } from 'ai';

const messages: UIMessage[] = [/* ... */];

const result = await generateText({
  // ...
  messages: convertToModelMessages(messages),
});
```

### Error Properties

- `prompt`: The invalid prompt value that was rejected
- `message`: Description of what went wrong
- `cause`: The underlying reason for the error

### Checking for the Error

```typescript
import { InvalidPromptError } from 'ai';

if (InvalidPromptError.isInstance(error)) {
  // Handle the error
}
```