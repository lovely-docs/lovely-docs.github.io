**Issue:** TypeScript error "Cannot find namespace 'JSX'" when using AI SDK in non-React projects.

**Cause:** AI SDK depends on `@types/react` (will be removed in next major version).

**Fix:** `npm install @types/react`