## InvalidToolInputError

Thrown when a tool receives invalid input that doesn't match its schema or requirements.

### Properties
- `toolName`: Name of the tool that received invalid input
- `toolInput`: The invalid input data that was provided
- `message`: Error message describing what went wrong
- `cause`: The underlying cause of the validation failure

### Detection
Check if an error is an instance of this error type:

```typescript
import { InvalidToolInputError } from 'ai';

if (InvalidToolInputError.isInstance(error)) {
  // Handle invalid tool input
}
```

This error is typically thrown during tool execution when the provided arguments don't conform to the tool's input schema.