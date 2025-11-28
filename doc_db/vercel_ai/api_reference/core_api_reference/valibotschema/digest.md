## valibotSchema

Helper function that converts Valibot schemas into JSON schema objects compatible with the AI SDK. Currently experimental.

**Purpose**: Enables use of Valibot schemas for structured data generation and tool definitions within the AI SDK.

**Input**: A Valibot schema definition (type: `GenericSchema<unknown, T>`)

**Output**: A Schema object compatible with the AI SDK containing both JSON schema representation and validation functionality.

**Usage contexts**:
- Generating structured data
- Defining tools and tool calling

**Example**:
```ts
import { valibotSchema } from '@ai-sdk/valibot';
import { object, string, array } from 'valibot';

const recipeSchema = valibotSchema(
  object({
    name: string(),
    ingredients: array(
      object({
        name: string(),
        amount: string(),
      }),
    ),
    steps: array(string()),
  }),
);
```

**Import**: `import { valibotSchema } from "ai"`