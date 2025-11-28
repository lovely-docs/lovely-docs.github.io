## Problem
When using `streamText` or `streamObject` with Server Actions, you get an error: "only plain objects and a few built ins can be passed from client components". This occurs because these functions return non-serializable objects with methods and complex structures that cannot be passed from Server Actions to Client Components.

## Solution
Extract only serializable data from the Server Action result instead of returning the entire object. Use `createStreamableValue` to wrap data that needs to be streamed to the client, ensuring only serializable content (like text) is passed across the server-client boundary.

## Example
Instead of directly returning the streamText result object, use createStreamableValue to create a wrapper that can safely serialize and stream the text data to the client component.