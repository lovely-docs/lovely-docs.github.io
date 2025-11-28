## AI_TooManyEmbeddingValuesForCallError

This error is thrown when an embedding call attempts to process more values than the provider's model allows in a single request.

### Error Properties
- `provider`: The AI provider name
- `modelId`: The ID of the embedding model
- `maxEmbeddingsPerCall`: The maximum number of embeddings allowed per call
- `values`: The array of values that was provided

### Detecting the Error
Use the `isInstance()` static method to check if an error is this type:

```typescript
import { TooManyEmbeddingValuesForCallError } from 'ai';

if (TooManyEmbeddingValuesForCallError.isInstance(error)) {
  // Handle the error
}
```

To fix this error, reduce the number of values in your embedding call to be within the `maxEmbeddingsPerCall` limit for your provider and model.