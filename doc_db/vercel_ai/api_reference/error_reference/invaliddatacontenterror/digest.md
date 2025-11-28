## AI_InvalidDataContentError

This error is thrown when invalid data content is provided in a multi-modal message part.

### Properties
- `content`: The invalid content value
- `message`: Error message describing expected vs received content types

### Detection
Check if an error is an instance of this error using:
```typescript
import { InvalidDataContentError } from 'ai';

if (InvalidDataContentError.isInstance(error)) {
  // Handle the error
}
```

For valid multi-modal message formats, refer to the prompt examples documentation.