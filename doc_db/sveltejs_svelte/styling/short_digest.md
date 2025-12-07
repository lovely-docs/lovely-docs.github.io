**Scoped Styles**: Hash-based classes (+0-1-0 specificity) auto-scope component CSS and `@keyframes`; use `:where()` for multiple scoping classes.

**Global Styles**: `:global(selector)` or `:global {...}` blocks apply styles globally; prepend `-global-` to `@keyframes` names.

**CSS Custom Properties**: Pass via `--name` syntax, desugars to wrapper element (`display: contents` or `<g>`), read with `var(--name, fallback)`, inherit from parents.

**Nested Styles**: Nested `<style>` tags bypass scoping and apply globally.