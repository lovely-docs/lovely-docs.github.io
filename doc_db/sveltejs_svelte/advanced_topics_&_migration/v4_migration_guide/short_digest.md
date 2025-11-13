## Key breaking changes for Svelte 4

**Version requirements:** Node 16+, TypeScript 5+, SvelteKit 1.20.4+, webpack 5+

**Bundler config:** Must specify `browser` condition (Rollup: `browser: true` in node-resolve; webpack: add `"browser"` to `conditionNames`)

**Output format:** CommonJS removed; use bundler to convert ESM to CJS if needed

**Type strictness:**
- `createEventDispatcher<{ required: string }>` now enforces payload requirements
- `Action<HTMLElement, string>` requires generic parameter if action uses params
- `onMount` errors on async function returns

**API changes:**
- `tag` → `customElement` in `<svelte:options>`
- `SvelteComponentTyped` → `SvelteComponent`
- Transitions local by default; use `|global` for old behavior
- Slot bindings no longer shared between default and named slots
- Preprocessors run in order (markup → script → style per preprocessor)

**Other:** `eslint-plugin-svelte3` deprecated (use `eslint-plugin-svelte`), `svelte.JSX` → `svelteHTML` namespace