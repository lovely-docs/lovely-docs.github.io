Async function validating UI messages against schemas for metadata, data parts, and tools.

```typescript
import { validateUIMessages } from 'ai';

// Basic: validate without custom schemas
const validatedMessages = await validateUIMessages({ messages });

// Advanced: with custom schemas
const validatedMessages = await validateUIMessages({
  messages,
  metadataSchema: z.object({ timestamp: z.string().datetime(), userId: z.string() }),
  dataSchemas: { chart: z.object({ data: z.array(z.number()), labels: z.array(z.string()) }) },
  tools: { weather: tool({ description: '...', parameters: z.object({ location: z.string() }), execute: async ({ location }) => '...' }) },
});
```