## AI_LoadAPIKeyError

Error thrown when an API key fails to load successfully.

### Properties
- `message`: The error message describing the failure

### Detection
Check if an error is an instance of `AI_LoadAPIKeyError`:

```typescript
import { LoadAPIKeyError } from 'ai';

if (LoadAPIKeyError.isInstance(error)) {
  // Handle the error
}
```

Use this error handling pattern when working with API key initialization to gracefully manage authentication failures.