## useObject Hook

Experimental hook for streaming JSON objects from an API endpoint and parsing them into typed objects using Zod/JSON schemas.

**Parameters**: api endpoint, schema (Zod or JSON), optional id, initialValue, fetch, headers, credentials, onError, onFinish callbacks

**Returns**: submit() to call API, object (current parsed result), error, isLoading flag, stop() and clear() functions

**Example**:
```tsx
const { object, submit } = useObject({
  api: '/api/use-object',
  schema: z.object({ content: z.string() }),
});
return <button onClick={() => submit('input')}>Generate</button>;
```