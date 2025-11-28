## AI_DownloadError

Error thrown when a download operation fails.

### Properties
- `url`: The URL that failed to download
- `statusCode`: HTTP status code returned by the server
- `statusText`: HTTP status text returned by the server
- `message`: Error message with details about the download failure

### Detection
Check if an error is an instance of `AI_DownloadError`:

```typescript
import { DownloadError } from 'ai';

if (DownloadError.isInstance(error)) {
  // Handle the error
}
```