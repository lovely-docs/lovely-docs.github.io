## Error Handling in RSC API

The RSC API supports two categories of errors: UI streaming errors and other value streaming errors.

### Handling UI Errors

Use the `streamableUI` object's `error()` method to catch and handle errors during UI generation:

```tsx
'use server';
import { createStreamableUI } from '@ai-sdk/rsc';

export async function getStreamedUI() {
  const ui = createStreamableUI();
  
  (async () => {
    ui.update(<div>loading</div>);
    const data = await fetchData();
    ui.done(<div>{data}</div>);
  })().catch(e => {
    ui.error(<div>Error: {e.message}</div>);
  });
  
  return ui.value;
}
```

On the client side, wrap the streamed component with a React Error Boundary to catch additional rendering errors:

```tsx
import { getStreamedUI } from '@/actions';
import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

export default function Page() {
  const [streamedUI, setStreamedUI] = useState(null);
  
  return (
    <div>
      <button onClick={async () => setStreamedUI(await getStreamedUI())}>
        What does the new UI look like?
      </button>
      <ErrorBoundary>{streamedUI}</ErrorBoundary>
    </div>
  );
}
```

### Handling Other Streaming Errors

For non-UI streaming, return an error object that the receiver can inspect:

```tsx
'use server';
import { createStreamableValue } from '@ai-sdk/rsc';
import { fetchData, emptyData } from '../utils/data';

export const getStreamedData = async () => {
  const streamableData = createStreamableValue<string>(emptyData);
  
  try {
    (async () => {
      streamableData.update(await fetchData());
      streamableData.update(await fetchData());
      streamableData.done(await fetchData());
    })();
    
    return { data: streamableData.value };
  } catch (e) {
    return { error: e.message };
  }
};
```

**Note:** AI SDK RSC is experimental; use AI SDK UI for production.