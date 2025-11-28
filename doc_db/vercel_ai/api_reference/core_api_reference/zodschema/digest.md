## Purpose
`zodSchema()` is a helper function that converts Zod schemas into JSON schema objects compatible with the AI SDK. Use it for generating structured data and in tools.

## Key Points
- You can pass Zod objects directly to AI SDK functions; they're automatically converted using `zodSchema()` internally
- Use `zodSchema()` explicitly when you need to specify options like `useReferences`

## Metadata Handling
When using `.meta()` or `.describe()` on Zod schemas, these methods must be called **at the end** of the schema chain. Most Zod schema methods (`.min()`, `.optional()`, `.extend()`, etc.) return new schema instances that don't inherit metadata from previous ones.

```ts
// ❌ Metadata lost - .min() returns new instance without metadata
z.string().meta({ describe: 'first name' }).min(1);

// ✅ Metadata preserved - .meta() is final method
z.string().min(1).meta({ describe: 'first name' });
```

## Recursive Schemas Example
```ts
import { zodSchema } from 'ai';
import { z } from 'zod';

const baseCategorySchema = z.object({
  name: z.string(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

const mySchema = zodSchema(
  z.object({
    category: categorySchema,
  }),
  { useReferences: true },
);
```

## API
**Parameters:**
- `zodSchema` (z.Schema): The Zod schema definition
- `options` (object, optional):
  - `useReferences` (boolean, optional): Enables support for references in schemas. Required for recursive schemas with `z.lazy()`. Not all language models/providers support references. Defaults to `false`.

**Returns:** A Schema object compatible with the AI SDK containing JSON schema representation and validation functionality.