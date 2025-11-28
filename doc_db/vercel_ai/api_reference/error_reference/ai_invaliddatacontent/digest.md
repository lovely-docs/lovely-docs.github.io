## AI_InvalidDataContent Error

This error is thrown when invalid data content is provided to the AI SDK.

### Properties
- `content`: The invalid content value that was provided
- `message`: The error message describing what went wrong
- `cause`: The underlying cause of the error

### Checking for the Error

Use the `isInstance()` method to check if an error is an instance of `AI_InvalidDataContent`:

```typescript
import { InvalidDataContent } from 'ai';

if (InvalidDataContent.isInstance(error)) {
  // Handle the error
}
```

This allows you to differentiate this specific error from other error types and apply appropriate error handling logic.