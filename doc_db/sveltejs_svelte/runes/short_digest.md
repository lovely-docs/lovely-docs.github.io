## Runes

`$`-prefixed compiler keywords for reactivity:

- **$state** — reactive state; arrays/objects become deep proxies. Variants: `$state.raw`, `$state.snapshot`, `$state.eager`
- **$derived** — computed values auto-updating on dependency changes. Use `$derived.by()` for complex logic
- **$effect** — runs side effects when state updates, auto-tracking dependencies. Variants: `$effect.pre`, `$effect.tracking()`, `$effect.root()`
- **$props** — receives component inputs with destructuring and defaults
- **$bindable** — marks props as bindable for bidirectional data flow
- **$inspect** — development debugging; logs on changes. `$inspect.trace()` traces what caused re-runs
- **$host** — accesses host element in custom element components