## safeValidateUIMessages

Async function that validates UI messages and returns `{ success, data | error }` instead of throwing.

Supports custom Zod schemas for metadata, data parts, and tools.

```typescript
const result = await safeValidateUIMessages({ messages });
if (!result.success) console.error(result.error.message);
else console.log(result.data);
```

With schemas:
```typescript
const result = await safeValidateUIMessages({
  messages,
  metadataSchema: z.object({ timestamp: z.string().datetime(), userId: z.string() }),
  dataSchemas: { chart: z.object({ data: z.array(z.number()), labels: z.array(z.string()) }) },
  tools: { weather: tool({ description: '...', parameters: z.object({ location: z.string() }), execute: async ({location}) => '...' }) },
});
```