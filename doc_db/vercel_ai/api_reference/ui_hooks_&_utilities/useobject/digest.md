## Purpose
`experimental_useObject()` is a React/Svelte/Vue hook that consumes text streams representing JSON objects and parses them into complete objects based on a schema. It pairs with the backend `streamObject` function.

## Basic Usage
```tsx
'use client';
import { experimental_useObject as useObject } from '@ai-sdk/react';

export default function Page() {
  const { object, submit } = useObject({
    api: '/api/use-object',
    schema: z.object({ content: z.string() }),
  });

  return (
    <div>
      <button onClick={() => submit('example input')}>Generate</button>
      {object?.content && <p>{object.content}</p>}
    </div>
  );
}
```

## Parameters
- **api** (string): Endpoint that streams JSON matching the schema as chunked text. Can be relative (`/path`) or absolute URL.
- **schema** (Zod Schema | JSON Schema): Defines the shape of the complete object. Pass Zod schema or JSON schema via `jsonSchema` function.
- **id?** (string): Unique identifier for shared state across components. Auto-generated if omitted.
- **initialValue?** (DeepPartial<RESULT>): Initial object value.
- **fetch?** (FetchFunction): Custom fetch function. Defaults to global fetch.
- **headers?** (Record<string, string> | Headers): Headers for API call.
- **credentials?** (RequestCredentials): Fetch credentials mode: "omit", "same-origin", or "include".
- **onError?** ((error: Error) => void): Error callback.
- **onFinish?** ((result: OnFinishResult) => void): Called when streaming finishes. Result contains `object` (typed per schema, may be undefined if invalid) and `error` (TypeValidationError if object doesn't match schema).

## Returns
- **submit** ((input: INPUT) => void): Calls API with input as JSON body.
- **object** (DeepPartial<RESULT> | undefined): Current generated object value, updated as API streams JSON chunks.
- **error** (Error | unknown): Error object if API call fails.
- **isLoading** (boolean): Whether request is in progress.
- **stop** (() => void): Aborts current API request.
- **clear** (() => void): Clears object state.

## Notes
- Experimental feature, available only in React, Svelte, and Vue.
- Object is typed according to the provided schema.
- Streaming updates allow progressive object building as chunks arrive.