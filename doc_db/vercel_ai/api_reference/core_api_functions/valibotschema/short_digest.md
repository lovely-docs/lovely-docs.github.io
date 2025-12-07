Converts Valibot schemas to AI SDK-compatible JSON schemas for structured data generation and tools.

```ts
import { valibotSchema } from '@ai-sdk/valibot';
import { object, string, array } from 'valibot';

const schema = valibotSchema(
  object({
    name: string(),
    items: array(object({ name: string(), amount: string() })),
  }),
);
```

Returns a Schema object with JSON schema representation and validation.