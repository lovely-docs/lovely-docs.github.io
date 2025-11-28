## createStreamableValue

Creates a stream for sending serializable values from server to client in RSC.

### Import
```
import { createStreamableValue } from "@ai-sdk/rsc"
```

### Parameters
- `value` (any): Serializable data (e.g., JSON)

### Returns
- `streamable`: Special value object returnable from Server Actions, holds data and supports updates via update method

**Note**: RSC is experimental; use AI SDK UI for production.