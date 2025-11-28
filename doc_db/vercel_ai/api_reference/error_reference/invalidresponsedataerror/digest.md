## InvalidResponseDataError

Thrown when the server returns a response with invalid data content.

### Properties
- `data`: The invalid response data value
- `message`: The error message

### Detection
Check if an error is an instance of `InvalidResponseDataError`:

```typescript
import { InvalidResponseDataError } from 'ai';

if (InvalidResponseDataError.isInstance(error)) {
  // Handle the error
}
```