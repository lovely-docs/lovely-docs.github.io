## `<svelte:options>` Element

Specifies per-component compiler options:
- `runes={true|false}` — Forces runes or legacy mode
- `namespace="html|svg|mathml"` — Sets component namespace
- `customElement={...}` — Configures custom element compilation
- `css="injected"` — Injects styles inline

Deprecated: `immutable` and `accessors` options (Svelte 4)

Example: `<svelte:options customElement="my-custom-element" />`