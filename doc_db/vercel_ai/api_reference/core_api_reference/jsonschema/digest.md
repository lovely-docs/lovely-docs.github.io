## Purpose
`jsonSchema()` is a helper function that creates JSON schema objects compatible with the AI SDK. It serves as an alternative to Zod schemas, providing flexibility for dynamic situations like OpenAPI definitions or when using other validation libraries.

## Usage
Use `jsonSchema()` to generate structured data and in tool definitions.

## API

### Parameters
- `schema` (JSONSchema7): The JSON schema definition
- `options` (SchemaOptions, optional):
  - `validate` (optional function): Custom validation function that takes an unknown value and returns either `{ success: true; value: OBJECT }` or `{ success: false; error: Error }`

### Returns
A JSON schema object compatible with the AI SDK

## Example
```ts
import { jsonSchema } from 'ai';

const mySchema = jsonSchema<{
  recipe: {
    name: string;
    ingredients: { name: string; amount: string }[];
    steps: string[];
  };
}>({
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              amount: { type: 'string' },
            },
            required: ['name', 'amount'],
          },
        },
        steps: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name', 'ingredients', 'steps'],
    },
  },
  required: ['recipe'],
});
```

The function is generic and accepts a TypeScript type parameter to provide type safety for the schema.