## AI_NoSuchToolError

Thrown when a model attempts to invoke a tool that is not available in the current context.

### Properties
- `toolName`: string - Name of the tool the model tried to call
- `availableTools`: string[] - List of tool names that are actually available
- `message`: string - Error message describing the issue

### Detection
Use the static `isInstance()` method to check if an error is this type:

```typescript
import { NoSuchToolError } from 'ai';

if (NoSuchToolError.isInstance(error)) {
  // Handle the error
}
```

This error indicates a mismatch between the tools provided to the model and the tools it was instructed or configured to call.