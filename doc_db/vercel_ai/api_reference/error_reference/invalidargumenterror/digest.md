## AI_InvalidArgumentError

Thrown when an invalid argument is provided to an AI SDK function.

### Properties
- `parameter`: Name of the invalid parameter
- `value`: The invalid value that was provided
- `message`: Error message describing the issue

### Usage
Check if an error is an instance of `AI_InvalidArgumentError`:

```typescript
import { InvalidArgumentError } from 'ai';

if (InvalidArgumentError.isInstance(error)) {
  // Handle the error
}
```