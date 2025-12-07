Reads server-created streamable values on the client using async iteration.

```ts
import { readStreamableValue } from "@ai-sdk/rsc";

// Client-side
for await (const delta of readStreamableValue(stream)) {
  // Process each streamed value
}
```

Returns an async iterator of values from `createStreamableValue`.