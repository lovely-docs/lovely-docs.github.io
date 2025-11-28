## AI_UnsupportedFunctionalityError

Error thrown when a requested functionality is not supported by the AI SDK.

### Properties
- `functionality`: string - The name of the unsupported functionality
- `message`: string - The error message describing the issue

### Detection
Check if an error is an instance of this error type:

```typescript
import { UnsupportedFunctionalityError } from 'ai';

if (UnsupportedFunctionalityError.isInstance(error)) {
  // Handle the error
}
```

This allows you to catch and handle cases where the SDK or provider doesn't support a specific feature you're trying to use.