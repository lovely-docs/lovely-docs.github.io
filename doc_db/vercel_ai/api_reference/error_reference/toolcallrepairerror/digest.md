## ToolCallRepairError

Error thrown when the AI fails to repair an invalid tool call. This occurs when attempting to fix either a `NoSuchToolError` (tool doesn't exist) or `InvalidToolInputError` (tool input is malformed).

### Properties
- `originalError`: The initial error that triggered the repair attempt (`NoSuchToolError` or `InvalidToolInputError`)
- `message`: Error message describing the failure
- `cause`: The underlying error that prevented the repair from succeeding

### Detection
```typescript
import { ToolCallRepairError } from 'ai';

if (ToolCallRepairError.isInstance(error)) {
  // Handle the error
}
```