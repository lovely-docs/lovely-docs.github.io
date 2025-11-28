## Purpose
React/Svelte/Vue hook that streams and parses JSON objects based on a schema, paired with backend `streamObject`.

## Basic Usage
```tsx
const { object, submit } = useObject({
  api: '/api/use-object',
  schema: z.object({ content: z.string() }),
});
submit('input'); // triggers API call
```

## Key Parameters
- **api**: Endpoint URL (relative or absolute)
- **schema**: Zod or JSON schema defining object shape
- **id?**: Unique identifier for cross-component state sharing
- **initialValue?**: Initial object value
- **fetch?**, **headers?**, **credentials?**: Request customization
- **onError?**, **onFinish?**: Callbacks for error and completion

## Returns
- **submit**: Trigger API call with input
- **object**: Current parsed object (updates as stream arrives)
- **error**, **isLoading**: Status tracking
- **stop**, **clear**: Control functions