**Runes** are `$`-prefixed compiler keywords for reactive state management:

- **$state**: Reactive state; plain values stay plain, arrays/objects become deep proxies. Variants: `$state.raw` (non-reactive), `$state.snapshot` (static copy), `$state.eager` (immediate updates).
- **$derived**: Computed state from expressions; `$derived.by()` for complex logic. Side-effect free, lazy evaluation, can be temporarily reassigned.
- **$effect**: Side-effect functions triggered by state changes. Variants: `$effect.pre` (before DOM), `$effect.tracking()` (check if tracked), `$effect.pending()` (promise count), `$effect.root()` (manual cleanup). Don't update state in effects—use `$derived` instead.
- **$props**: Receive component inputs with destructuring, defaults, renaming, rest properties. `$props.id()` generates unique instance IDs.
- **$bindable**: Mark props as two-way bindable for child-to-parent communication.
- **$inspect**: Dev-only reactive logging; `.with()` for custom callbacks, `.trace()` to debug re-runs.
- **$host**: Access host element in custom element components for dispatching events.