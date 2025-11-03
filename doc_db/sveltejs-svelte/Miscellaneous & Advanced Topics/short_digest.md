## Testing
- **Vitest**: Unit/integration tests with `$effect.root()` and `flushSync()`
- **Component Testing**: `mount()` API or `@testing-library/svelte`
- **Playwright**: E2E tests with webServer config

## TypeScript
- `lang="ts"` on script tags, configure `vitePreprocess` in `svelte.config.js`
- Type props/state with `$props()` and `$state(type)`, use generics
- Extend custom elements via `svelteHTML` namespace

## Custom Elements
- `<svelte:options customElement={{ tag, props, shadow, extend }} />`
- Styles encapsulated, slotted content eager, context boundary

## Svelte 4 → 5 Migration
- **Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`
- **Events**: `on:click` → `onclick`, remove `createEventDispatcher`
- **Slots**: `<slot />` → `children` prop with `{@render}`
- **Components**: Classes → functions, use `mount()`
- Run `npx sv migrate svelte-5` for automatic migration