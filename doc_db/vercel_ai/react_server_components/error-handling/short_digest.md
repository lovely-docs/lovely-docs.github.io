Two error handling patterns for RSC:

1. **UI errors**: Use `streamableUI.error()` to return error UI, optionally wrap client component with React Error Boundary
2. **Other errors**: Wrap `createStreamableValue` in try-catch and return `{ error: e.message }` object