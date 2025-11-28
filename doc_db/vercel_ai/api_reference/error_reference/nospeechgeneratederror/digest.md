## NoSpeechGeneratedError

Thrown when audio generation fails to produce any output from the provided input.

### Properties
- `responses`: Array of responses from the generation attempt
- `message`: Error message describing the failure

### Detection
Check if an error is an instance of this error type:

```typescript
import { NoSpeechGeneratedError } from 'ai';

if (NoSpeechGeneratedError.isInstance(error)) {
  // Handle the error
}
```