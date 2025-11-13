## Testing
- **Vitest**: Configure browser conditions, use `mount()` API for components, wrap effects in `$effect.root()` with `flushSync()`
- **Storybook**: Create stories with `play` function for interaction tests
- **Playwright**: Configure `webServer`, write DOM interaction tests

## TypeScript
- Add `lang="ts"` to script tags; configure preprocessor for full support
- Type props with interface + `$props()`, use `generics` attribute for generic props
- Use `Component` and `ComponentProps` for dynamic components

## Custom Elements
- Compile with `<svelte:options customElement="my-element" />`
- Configure with object: `tag`, `shadow: "none"`, `props` (with `attribute`, `reflect`, `type`), `extend`
- Styles encapsulated in shadow DOM, inlined as JS

## Svelte 4 Migration
- Node 16+, TypeScript 5+; bundlers must specify `browser` condition
- Stricter types on `createEventDispatcher`, `Action`
- Replace `tag=` with `customElement=`, `SvelteComponentTyped` with `SvelteComponent`
- Transitions local by default; slot bindings no longer shared

## Svelte 5 Migration
- `let` → `$state()`, `$:` → `$derived()`/`$effect()`, `export let` → `$props()`
- `on:` → event attributes; `createEventDispatcher` → callback props
- Slots → Snippets with `{@render}`; components now functions with `mount()`
- Requires modern browsers

## FAQ
- Support: Stack Overflow, Discord, Reddit; Tooling: VS Code extension, Prettier
- Testing: Vitest (unit), jsdom/browser (component), Playwright (E2E)
- Routing: SvelteKit; Mobile: SvelteKit SPA + Tauri/Capacitor