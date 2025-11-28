## NoSuchModelError

Thrown when a model ID cannot be found or resolved by the SDK.

### Properties
- `modelId`: The ID of the model that was not found
- `modelType`: The type of model (e.g., language model, embedding model)
- `message`: The error message describing the failure

### Detection
Check if an error is an instance of `NoSuchModelError`:

```typescript
import { NoSuchModelError } from 'ai';

if (NoSuchModelError.isInstance(error)) {
  // Handle the error
}
```

This error typically occurs when attempting to use a model identifier that doesn't exist in the provider's catalog or hasn't been properly configured.