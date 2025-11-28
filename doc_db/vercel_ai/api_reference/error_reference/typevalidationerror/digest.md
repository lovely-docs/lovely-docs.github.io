## TypeValidationError

Error thrown when type validation fails during SDK operations.

### Properties
- `value`: The value that failed validation
- `message`: Error message containing validation details

### Usage
Check if an error is a TypeValidationError using the static method:

```typescript
import { TypeValidationError } from 'ai';

if (TypeValidationError.isInstance(error)) {
  // Handle the error
}
```