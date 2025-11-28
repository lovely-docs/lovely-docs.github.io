Generates a unique identifier string. This is the same ID generator used internally by the AI SDK.

**Usage:**
```ts
import { generateId } from 'ai';

const id = generateId();
```

**Parameters:**
- `size` (number, optional): The length of the generated ID. Defaults to 16. This parameter is deprecated and will be removed in the next major version.

**Returns:** A string representing the generated ID.

**Related:** See `createIdGenerator()` for creating custom ID generators.