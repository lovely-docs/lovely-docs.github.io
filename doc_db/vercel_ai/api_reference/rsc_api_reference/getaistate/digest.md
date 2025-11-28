## getAIState

Retrieves the current AI state in RSC (React Server Components) context.

**Import:**
```
import { getAIState } from "@ai-sdk/rsc"
```

**Parameters:**
- `key` (string, optional): Returns the value of the specified key in the AI state if the state is an object.

**Returns:**
The AI state value.

**Usage:**
Call `getAIState()` to access the current AI state. Optionally pass a key to extract a specific property from the state object.

**Note:** AI SDK RSC is experimental. The recommended approach for production is AI SDK UI, with a migration guide available.