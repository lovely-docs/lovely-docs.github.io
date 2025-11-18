## Deprecated $app/stores API

Store-based equivalents of `$app/state` (use `$app/state` instead in SvelteKit 2.12+).

- **getStores()** — returns `{page, navigating, updated}`
- **navigating** — Readable store with Navigation object during navigation, null otherwise
- **page** — Readable store with page data
- **updated** — Readable store (boolean) + `check()` method for version polling