## AI_NoSuchProviderError

Thrown when a provider ID cannot be found in the system.

### Properties
- `providerId`: The ID of the provider that was not found
- `availableProviders`: Array of available provider IDs
- `modelId`: The ID of the model
- `modelType`: The type of model
- `message`: The error message

### Detection
Check if an error is an instance of this error using the static method:

```typescript
import { NoSuchProviderError } from 'ai';

if (NoSuchProviderError.isInstance(error)) {
  // Handle the error
}
```