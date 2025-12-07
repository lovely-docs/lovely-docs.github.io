Async function validating UI messages, returning `{success, data?, error?}` instead of throwing. Supports custom schemas for metadata, typed data parts, and tools.

```typescript
const result = await safeValidateUIMessages({
  messages,
  metadataSchema,
  dataSchemas,
  tools,
});

if (!result.success) console.error(result.error.message);
else console.log(result.data);
```