## Purpose
Helper function creating JSON schema objects compatible with the AI SDK as an alternative to Zod schemas.

## API
- `schema` (JSONSchema7): The JSON schema definition
- `options.validate` (optional): Custom validation function returning `{ success: true; value }` or `{ success: false; error }`

## Example
```ts
import { jsonSchema } from 'ai';

const mySchema = jsonSchema<{ recipe: { name: string; ingredients: { name: string; amount: string }[]; steps: string[] } }>({
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        ingredients: {
          type: 'array',
          items: { type: 'object', properties: { name: { type: 'string' }, amount: { type: 'string' } }, required: ['name', 'amount'] },
        },
        steps: { type: 'array', items: { type: 'string' } },
      },
      required: ['name', 'ingredients', 'steps'],
    },
  },
  required: ['recipe'],
});
```