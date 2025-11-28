## AI_InvalidDataContent Error

Thrown when invalid data content is provided. Check for it using `InvalidDataContent.isInstance(error)`.

### Properties
- `content`: The invalid content value
- `message`: Error message
- `cause`: Underlying cause

### Example
```typescript
import { InvalidDataContent } from 'ai';

if (InvalidDataContent.isInstance(error)) {
  // Handle the error
}
```