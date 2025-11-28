Reads server-created streamable values on the client using async iteration.

```ts
import { readStreamableValue } from "@ai-sdk/rsc"

for await (const delta of readStreamableValue(stream)) {
  // process each emitted value
}
```

Returns an async iterator over values from a `StreamableValue`.