## NoObjectGeneratedError with content-filter finish reason

When using `generateObject` or `streamObject` with OpenAI's structured output generation, incompatible Zod schema types cause a `NoObjectGeneratedError` with finish reason `content-filter`.

### Problem

OpenAI's structured output uses JSON Schema and rejects certain Zod patterns:
- `.nullish()` - not supported (allows null, undefined, or omitted)
- `.optional()` - not supported (field can be omitted)
- `.nullable()` - supported (allows null or the specified type)

```typescript
// ❌ Fails with content-filter error
const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullish(),
    email: z.string().optional(),
    age: z.number().nullable(),
  }),
  prompt: 'Generate a user profile',
});
```

### Solution

Replace `.nullish()` and `.optional()` with `.nullable()`:

```typescript
// ✅ Works correctly
const result = await generateObject({
  model: openai('gpt-4o-2024-08-06'),
  schema: z.object({
    name: z.string().nullable(),
    email: z.string().nullable(),
    age: z.number().nullable(),
  }),
  prompt: 'Generate a user profile',
});

console.log(result.object);
// { name: "John Doe", email: "john@example.com", age: 30 }
// or { name: null, email: null, age: 25 }
```

### Schema Type Compatibility

| Zod Type | Compatible | Behavior |
|----------|-----------|----------|
| `.nullable()` | ✅ Yes | Allows null or the specified type |
| `.optional()` | ❌ No | Field can be omitted |
| `.nullish()` | ❌ No | Allows null, undefined, or omitted |