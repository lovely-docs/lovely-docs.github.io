## AI_EmptyResponseBodyError

Error thrown when the server returns an empty response body.

### Properties
- `message`: The error message

### Detection
Check if an error is an instance of this error type:

```typescript
import { EmptyResponseBodyError } from 'ai';

if (EmptyResponseBodyError.isInstance(error)) {
  // Handle the error
}
```