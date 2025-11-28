## Breaking Changes

**Removed Functionality:**
- Experimental `StreamingReactResponse` has been removed. Use AI SDK RSC instead to build streaming UIs.

**Deprecated Functionality:**
- `nanoid` export is deprecated. Use `generateId` instead.

## UI Package Separation

UI framework integrations (Svelte, Vue.js, SolidJS) have moved to separate Node modules. Update imports:
- `ai/svelte` → `@ai-sdk/svelte`
- `ai/vue` → `@ai-sdk/vue`
- `ai/solid` → `@ai-sdk/solid`

React and RSC integrations remain in the main package. Old exports still work but will be removed in a future release.

## Installation

Update to version 3.2:
```
pnpm add ai@latest
```