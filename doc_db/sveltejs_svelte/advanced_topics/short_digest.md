**Testing**: Vitest (unit/component with runes support, `$effect.root()`, `flushSync()`), Storybook (stories with `play` function), Playwright (E2E with `webServer` config).

**TypeScript**: `lang="ts"` for type-only features; preprocessor for full TS. `tsconfig.json`: `target: ES2015+`, `verbatimModuleSyntax: true`, `isolatedModules: true`. Type `$props` with interface + destructure, use `generics` attribute for generic props, `$state` normally, `Component`/`ComponentProps` for dynamic components, augment `svelte/elements` for custom types.

**Custom Elements**: `<svelte:options customElement="tag">` or object with `tag`, `shadow: 'none'`, `props` (reflect/type/attribute), `extend` (lifecycle). Styles encapsulated/inlined, slotted content eager, context isolated per element.

**Svelte 4**: Node 16+, TS 5+, bundler `browser` condition required. Removed CJS. Stricter types for `createEventDispatcher`/`Action`/`onMount`. `customElement` replaces `tag`. `SvelteComponentTyped` → `SvelteComponent`. Transitions local by default. Preprocessor order changed. `eslint-plugin-svelte3` → `eslint-plugin-svelte`.

**Svelte 5**: `let` → `$state()`, `$:` → `$derived()`/`$effect()`. `export let` → `$props()`. `on:` → event attributes. `createEventDispatcher` → callback props. Snippets replace slots. Components are functions (`mount`/`unmount`). `$bindable()` required for bindings. Modern browsers only. Run `npx sv migrate svelte-5`.

**FAQ**: Tutorial at /tutorial. Testing: unit (Vitest), component (jsdom/Playwright), E2E (Playwright). Routing: SvelteKit. Mobile: Tauri/Capacitor. Unused styles removed; use `:global()`. HMR via SvelteKit.