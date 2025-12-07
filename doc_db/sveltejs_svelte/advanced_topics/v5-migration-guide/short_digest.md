## Core Syntax Changes

**Reactivity**: `let` → `$state(value)`, `$:` → `$derived(expr)` or `$effect(() => {})`, `export let` → `let { prop } = $props()`

**Events**: `on:click={handler}` → `onclick={handler}`, `createEventDispatcher` → callback props, event modifiers removed

**Slots**: `<slot />` → `{@render children?.()}`, named slots → snippet props

## Component Instantiation

`new Component({...})` → `mount(Component, {...})`, `$set` → mutate `$state` object, `$destroy` → `unmount()`

## Runes Mode Breaking Changes

- Bindings to exports forbidden; use `bind:this`
- Props need `$bindable()` to be bindable
- `accessors`/`immutable` options ignored
- Classes not auto-reactive
- Touch/wheel events passive
- Stricter HTML/attribute syntax
- `beforeUpdate`/`afterUpdate` disallowed (use `$effect.pre`/`$effect`)
- `null`/`undefined` → empty string
- `bind:files` only accepts `null`/`undefined`/`FileList`
- Hydration uses comments; mismatches not repaired