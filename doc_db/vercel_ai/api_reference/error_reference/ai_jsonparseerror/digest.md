## AI_JSONParseError

Error thrown when JSON parsing fails.

### Properties
- `text`: The text value that could not be parsed
- `message`: The error message including parse error details

### Error Detection
Check if an error is an instance of `AI_JSONParseError`:

```typescript
import { JSONParseError } from 'ai';

if (JSONParseError.isInstance(error)) {
  // Handle the error
}
```