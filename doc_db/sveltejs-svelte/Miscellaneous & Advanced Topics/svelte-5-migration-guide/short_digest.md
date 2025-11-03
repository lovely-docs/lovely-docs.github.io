## Key Changes

**Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props, event modifiers removed

**Slots**: `<slot />` → `children` prop with `{@render}`, named slots → props, `let:` → snippets

**Components**: Classes → functions, use `mount(App, {target})` instead of `new App({target})`

**Runes mode**: Bindable props need `$bindable()`, no auto-reactive classes, passive touch/wheel events

**Other**: Stricter HTML, modern browsers only, `null`/`undefined` render as empty string, form resets trigger bindings

Use `npx sv migrate svelte-5` for automatic migration.