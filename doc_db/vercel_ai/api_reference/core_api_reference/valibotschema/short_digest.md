Converts Valibot schemas to AI SDK-compatible JSON schemas for structured data generation and tools. Takes a Valibot schema and returns a typed Schema object with validation.

```ts
import { valibotSchema } from '@ai-sdk/valibot';
const recipeSchema = valibotSchema(
  object({
    name: string(),
    ingredients: array(object({ name: string(), amount: string() })),
    steps: array(string()),
  }),
);
```