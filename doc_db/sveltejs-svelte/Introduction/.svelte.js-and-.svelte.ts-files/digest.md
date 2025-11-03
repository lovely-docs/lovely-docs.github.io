Svelte supports `.svelte.js` and `.svelte.ts` files in addition to `.svelte` component files. These files behave like regular JavaScript or TypeScript modules but with the added ability to use Svelte runes, enabling reactive logic and state management outside of components.

**Use cases:**
- Creating reusable reactive logic that can be shared across your application
- Sharing reactive state across multiple components (note: you cannot export reassigned state directly)

This feature was introduced in Svelte 5 and did not exist in earlier versions.