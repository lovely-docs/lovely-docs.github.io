## Problem
Streamable UI created with `createStreamableUI` can be slow to update when the stream is not properly closed.

## Solution
Call the `.done()` method on the stream object to close it. This ensures the stream is properly terminated and updates are flushed.

## Example
```tsx
import { createStreamableUI } from '@ai-sdk/rsc';

const submitMessage = async () => {
  'use server';

  const stream = createStreamableUI('1');
  stream.update('2');
  stream.append('3');
  stream.done('4'); // Close the stream

  return stream.value;
};
```

The `.done()` method accepts an optional final value to send before closing.