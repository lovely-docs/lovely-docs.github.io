## Problem
`onFinish` callback doesn't execute when stream is aborted with `toUIMessageStreamResponse`.

## Solution
Add `consumeSseStream: consumeStream` to the configuration:

```tsx
import { consumeStream } from 'ai';

return result.toUIMessageStreamResponse({
  onFinish: async ({ isAborted }) => {
    if (isAborted) {
      console.log('Stream was aborted');
    }
  },
  consumeSseStream: consumeStream,
});
```

This ensures `onFinish` executes even on abort, allowing cleanup operations to run.