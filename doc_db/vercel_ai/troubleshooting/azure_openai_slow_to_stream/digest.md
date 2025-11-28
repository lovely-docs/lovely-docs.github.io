When using OpenAI hosted on Azure, streaming may be slow and arrive in large chunks. This is a Microsoft Azure issue.

**Root Cause**: Azure's default content filtering settings can cause slow streaming behavior.

**Fix - Update Azure Content Filtering**:
1. Go to Azure AI Studio (ai.azure.com)
2. Navigate to "Shared resources" > "Content filters"
3. Create a new content filter
4. Under "Output filter", change "Streaming mode (Preview)" from "Default" to "Asynchronous Filter"

**Alternative Solution - Use smoothStream Transformation**:
Apply the `smoothStream` transformation to stream each word individually instead of in chunks:

```tsx
import { smoothStream, streamText } from 'ai';

const result = streamText({
  model,
  prompt,
  experimental_transform: smoothStream(),
});
```

The `smoothStream()` transformation is passed to the `experimental_transform` parameter of `streamText()`.