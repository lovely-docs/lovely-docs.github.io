## readStreamableValue

Function that reads streamable values created on the server using `createStreamableValue` from the client side.

**Purpose**: Enables client-side consumption of server-streamed values in RSC (React Server Components) applications.

**Import**:
```ts
import { readStreamableValue } from "@ai-sdk/rsc"
```

**Usage**: Call `readStreamableValue()` with a streamable value returned from a server action, then iterate over it with `for await...of` to receive each emitted value:

```ts
// Server action
async function generate() {
  'use server';
  const streamable = createStreamableValue();
  streamable.update(1);
  streamable.update(2);
  streamable.done(3);
  return streamable.value;
}

// Client component
const stream = await generate();
for await (const delta of readStreamableValue(stream)) {
  setGeneration(generation => generation + delta);
}
```

**API**:
- **Parameter**: `stream` (StreamableValue) - the streamable value to read from
- **Returns**: An async iterator containing values emitted by the streamable value

**Note**: AI SDK RSC is experimental; production use should prefer AI SDK UI.