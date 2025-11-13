## Key Changes

**Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props, event modifiers removed

**Slots**: Replaced with snippets using `$props()` and `{@render}`

**Components**: Now functions, use `mount(App, { target })` instead of `new App()`

**Runes mode**: Properties not bindable by default, use `$bindable()`, classes not auto-reactive

**Migration**: Run `npx sv migrate svelte-5` for automatic conversion