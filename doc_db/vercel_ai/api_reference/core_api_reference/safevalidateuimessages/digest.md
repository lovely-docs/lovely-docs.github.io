## safeValidateUIMessages

Async function that validates UI messages and returns a result object instead of throwing errors.

### Purpose
Validates message structures with optional custom schemas for metadata, data parts, and tools. Returns `{ success: true, data: validatedMessages }` on success or `{ success: false, error }` on failure.

### Basic Usage
```typescript
import { safeValidateUIMessages } from 'ai';

const messages = [
  {
    id: '1',
    role: 'user',
    parts: [{ type: 'text', text: 'Hello!' }],
  },
];

const result = await safeValidateUIMessages({ messages });

if (!result.success) {
  console.error(result.error.message);
} else {
  const validatedMessages = result.data;
}
```

### Advanced Usage with Custom Schemas
```typescript
import { safeValidateUIMessages, tool } from 'ai';
import { z } from 'zod';

const metadataSchema = z.object({
  timestamp: z.string().datetime(),
  userId: z.string(),
});

const dataSchemas = {
  chart: z.object({
    data: z.array(z.number()),
    labels: z.array(z.string()),
  }),
  image: z.object({
    url: z.string().url(),
    caption: z.string(),
  }),
};

const tools = {
  weather: tool({
    description: 'Get weather info',
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => `Weather in ${location}: sunny`,
  }),
};

const messages = [
  {
    id: '1',
    role: 'user',
    metadata: { timestamp: '2024-01-01T00:00:00Z', userId: 'user123' },
    parts: [
      { type: 'text', text: 'Show me a chart' },
      { type: 'data-chart', data: { data: [1, 2, 3], labels: ['A', 'B', 'C'] } },
    ],
  },
  {
    id: '2',
    role: 'assistant',
    parts: [
      {
        type: 'tool-weather',
        toolCallId: 'call_123',
        state: 'output-available',
        input: { location: 'San Francisco' },
        output: 'Weather in San Francisco: sunny',
      },
    ],
  },
];

const result = await safeValidateUIMessages({
  messages,
  metadataSchema,
  dataSchemas,
  tools,
});

if (!result.success) {
  console.error(result.error.message);
} else {
  const validatedMessages = result.data;
}
```

### Key Features
- Non-throwing alternative to `validateUIMessages`
- Supports custom Zod schemas for message metadata
- Supports custom data part schemas (e.g., chart, image)
- Supports tool validation
- Returns discriminated union: `{ success: boolean, data?: T, error?: Error }`