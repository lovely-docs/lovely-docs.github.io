## Scoped Styles
Svelte automatically scopes component styles with hash-based classes (e.g., `svelte-123xyz`), preventing leakage. Scoped selectors override global styles with 0-1-0 specificity increase. Keyframes are also scoped.

## Global Styles
Use `:global(selector)` or `:global {...}` blocks to apply styles globally. Prefix keyframe names with `-global-` for global keyframes.

## CSS Custom Properties
Pass custom properties with `--property-name` syntax and read with `var()`:
```svelte
<Slider --track-color="black" />
<style>.track { background: var(--track-color, #aaa); }</style>
```

## Nested Styles
Nested `<style>` tags bypass scoping and apply globally.