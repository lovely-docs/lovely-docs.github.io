## AI_APICallError

Error thrown when an API call fails during SDK operations.

### Properties
- `url`: The URL of the failed API request
- `requestBodyValues`: Request body values sent to the API
- `statusCode`: HTTP status code returned by the API
- `responseHeaders`: Response headers from the API
- `responseBody`: Response body from the API
- `isRetryable`: Boolean indicating if the request can be retried based on status code
- `data`: Additional data associated with the error

### Error Detection
Check if an error is an instance of `AI_APICallError`:

```typescript
import { APICallError } from 'ai';

if (APICallError.isInstance(error)) {
  // Handle the error
}
```