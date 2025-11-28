## AI_LoadSettingError

Error thrown when a setting fails to load successfully.

### Properties
- `message`: The error message describing the failure

### Detection
Check if an error is an instance of `AI_LoadSettingError` using the `isInstance()` static method:

```typescript
import { LoadSettingError } from 'ai';

if (LoadSettingError.isInstance(error)) {
  // Handle the error
}
```