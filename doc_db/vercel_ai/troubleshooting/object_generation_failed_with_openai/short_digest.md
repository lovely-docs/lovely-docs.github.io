## NoObjectGeneratedError with OpenAI structured outputs

When using `generateObject` or `streamObject` with OpenAI, `.nullish()` and `.optional()` Zod methods cause content-filter errors. Use `.nullable()` instead:

```typescript
// ❌ Fails
schema: z.object({
  name: z.string().nullish(),
  email: z.string().optional(),
})

// ✅ Works
schema: z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
})
```

Only `.nullable()` is compatible with OpenAI's JSON Schema implementation.