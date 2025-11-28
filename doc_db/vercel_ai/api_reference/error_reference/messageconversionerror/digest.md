## MessageConversionError

Error thrown when message conversion fails during SDK operations.

### Properties
- `originalMessage`: The original message that failed conversion
- `message`: The error message describing the failure

### Usage
Check if an error is an instance of `MessageConversionError`:

```typescript
import { MessageConversionError } from 'ai';

if (MessageConversionError.isInstance(error)) {
  // Handle the error
}
```

This error indicates a problem during message transformation or serialization within the SDK.