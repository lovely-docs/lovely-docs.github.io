## Overview
`createStreamableUI` creates a stream that sends UI from the server to the client. The returned value can be rendered as a normal React node on the client side.

## Import
```
import { createStreamableUI } from "@ai-sdk/rsc"
```

## API

**Parameters:**
- `initialValue` (ReactNode, optional): The initial value of the streamable UI.

**Returns:**
- `value` (ReactNode): The streamable UI value that can be returned from a Server Action and received by the client.

**Methods:**
- `update(ReactNode)`: Replaces the current UI node with a new one. Previous node cannot be updated after appending.
- `append(ReactNode)`: Appends a new UI node to the end. Once appended, the previous UI node cannot be updated anymore.
- `done(ReactNode | null)`: Marks the UI as finalized and closes the stream. Required to be called, otherwise the response stays in loading state. After calling, UI cannot be updated or appended.
- `error(Error)`: Signals an error in the UI stream. Thrown on client side and caught by nearest error boundary.

## Note
AI SDK RSC is experimental. Use AI SDK UI for production instead.