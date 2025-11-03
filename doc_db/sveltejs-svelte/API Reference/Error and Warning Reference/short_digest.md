## Client Errors & Warnings
- Binding: use `$bindable()`, `bind:checked`, `bind:this`
- State: cannot mutate in `$derived()`, use `$effect` for side-effects
- Hydration mismatch: ensure server/client match or force update
- Ownership: use `bind:` instead of mutating unbound props

## Compiler Errors & Warnings
- Props: use `$props()` not `export let`; each blocks use `array[i] = 4`
- Snippets: use `{@render snippet()}` not `{snippet}`; cannot mix with `let:`
- Lifecycle: call at component top level, unavailable on server
- a11y: enforce keyboard handlers, labels, ARIA attributes, media captions