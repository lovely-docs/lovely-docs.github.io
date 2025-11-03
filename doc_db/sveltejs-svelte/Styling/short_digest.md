## Scoped Styles
Svelte automatically scopes component styles with hash-based classes, giving them higher specificity than global styles. Keyframes are also scoped automatically.

## Global Styles
Use `:global(selector)`, `-global-` prefix for keyframes, or `:global {...}` block for global styles.

## CSS Custom Properties
Pass and consume `--property-name` via `var(--property-name, fallback)` for dynamic styling.

## Nested Style Elements
Nested `<style>` tags bypass scoping and apply globally to the DOM.