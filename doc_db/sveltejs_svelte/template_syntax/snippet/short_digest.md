## Snippets

Reusable markup blocks declared with `{#snippet name(params)}...{/snippet}` and rendered with `{@render name()}`.

**Scope**: Reference values from script/parent blocks; visible to siblings and children in same lexical scope.

**Passing to components**: Snippets are values passed as props. Snippets declared inside a component implicitly become props; non-snippet content becomes `children` snippet.

**Optional snippets**: Use `{@render children?.()}` or conditional rendering.

**Typing**: `import type { Snippet } from 'svelte'` and use `Snippet<[ParamType]>` for type safety.

**Exporting**: Top-level snippets can export from `<script module>` (Svelte 5.5.0+).

**Programmatic**: Use `createRawSnippet` API for advanced cases.

Replaces deprecated Svelte 4 slots.