## NoContentGeneratedError

Error thrown when an AI provider fails to generate content.

### Properties
- `message`: The error message

### Usage
Check if an error is an instance of `NoContentGeneratedError`:

```typescript
import { NoContentGeneratedError } from 'ai';

if (NoContentGeneratedError.isInstance(error)) {
  // Handle the error
}
```