Helper function creating JSON schema objects for the AI SDK. Alternative to Zod, supports TypeScript typing and optional custom validation function. Takes JSONSchema7 definition and optional SchemaOptions with validate callback.

Example:
```ts
const schema = jsonSchema<{ recipe: { name: string; ingredients: Array<{ name: string; amount: string }>; steps: string[] } }>({
  type: 'object',
  properties: { recipe: { type: 'object', properties: { name: { type: 'string' }, ingredients: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, amount: { type: 'string' } }, required: ['name', 'amount'] } }, steps: { type: 'array', items: { type: 'string' } } }, required: ['name', 'ingredients', 'steps'] } },
  required: ['recipe']
});
```