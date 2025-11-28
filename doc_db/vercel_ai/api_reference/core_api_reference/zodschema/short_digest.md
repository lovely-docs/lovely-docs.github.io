## Purpose
Converts Zod schemas to JSON schema objects compatible with the AI SDK for structured data generation and tools.

## Key Points
- Zod objects can be passed directly to AI SDK functions (auto-converted internally)
- Use `zodSchema()` explicitly to specify options like `useReferences`
- Metadata (`.meta()`, `.describe()`) must be the final method in the schema chain

## Recursive Schemas
```ts
import { zodSchema } from 'ai';
import { z } from 'zod';

const baseCategorySchema = z.object({ name: z.string() });
type Category = z.infer<typeof baseCategorySchema> & { subcategories: Category[] };
const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

const mySchema = zodSchema(z.object({ category: categorySchema }), { useReferences: true });
```

## API
- `zodSchema(schema, options?)` → Schema object
- Options: `useReferences` (boolean) - enables recursive schema support via references