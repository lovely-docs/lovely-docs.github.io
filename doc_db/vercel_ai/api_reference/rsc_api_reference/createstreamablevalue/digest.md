## createStreamableValue

Creates a stream that sends serializable values from the server to the client in RSC (React Server Components) applications.

### Import
```
import { createStreamableValue } from "@ai-sdk/rsc"
```

### Parameters
- `value` (any): Any serializable data supported by RSC, such as JSON objects.

### Returns
- `streamable`: A special value object that can be returned from Server Actions to the client. It holds the initial data and can be updated via the update method.

### Purpose
Enables bidirectional streaming of data between server and client in RSC contexts, allowing you to send initial data and update it over time without requiring a full page reload.

**Note**: AI SDK RSC is experimental. For production use, the AI SDK UI is recommended. Migration guidance is available in the migration guide.