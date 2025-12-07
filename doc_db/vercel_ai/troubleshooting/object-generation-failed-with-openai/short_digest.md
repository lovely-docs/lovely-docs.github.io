## NoObjectGeneratedError with OpenAI

When using `generateObject` or `streamObject` with OpenAI, a `NoObjectGeneratedError` with finish reason `content-filter` occurs if your Zod schema uses `.nullish()` or `.optional()`. These are incompatible with OpenAI's JSON Schema implementation.

**Solution:** Use `.nullable()` instead:
```typescript
const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullable(), // ✅ instead of .nullish() or .optional()
    email: z.string().nullable(),
  }),
  prompt: 'Generate a user profile',
});
```

| Type | Compatible |
|------|-----------|
| `.nullable()` | ✅ Yes |
| `.optional()` | ❌ No |
| `.nullish()` | ❌ No |