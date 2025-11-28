## NoTranscriptGeneratedError

Error thrown when no transcript could be generated from the input.

### Properties
- `responses`: Array of responses
- `message`: The error message

### Checking for the Error

Use the `isInstance()` static method to check if an error is an instance of `NoTranscriptGeneratedError`:

```typescript
import { NoTranscriptGeneratedError } from 'ai';

if (NoTranscriptGeneratedError.isInstance(error)) {
  // Handle the error
}
```