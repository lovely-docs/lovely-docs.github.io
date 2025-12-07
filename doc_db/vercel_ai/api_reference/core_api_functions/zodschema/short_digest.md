## Purpose
Converts Zod schemas to JSON schema objects for the AI SDK. Use when you need options like `useReferences` for recursive schemas; otherwise pass Zod objects directly.

## Key Detail
Metadata methods (`.meta()`, `.describe()`) must be **last** in the schema chain—other methods return new instances that lose metadata.

## API
```ts
zodSchema(schema: z.Schema, options?: { useReferences?: boolean })
```

## Example
```ts
// Recursive schema with references
const categorySchema = z.object({ name: z.string() }).extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

zodSchema(z.object({ category: categorySchema }), { useReferences: true });

// Correct metadata placement
z.string().min(1).meta({ describe: 'first name' });
```