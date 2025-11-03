# Complete Documentation

## Core Concepts
- **Runes**: `$state`, `$derived`, `$effect`, `$props()`, `$bindable()` for reactivity
- **Components**: `.svelte` files with optional `<script>`, `<script module>`, `<style>`
- **Template**: HTML/components with `{expr}` interpolation, `on:event`, `bind:property` directives

## Key Syntax
- **State & Effects**: `let count = $state(0)`, `let doubled = $derived(count * 2)`, `$effect(() => { cleanup })`
- **Props & Binding**: `let { value = $bindable() } = $props()`, parent: `bind:value={msg}`
- **Conditionals/Iteration**: `{#if} {:else if} {:else} {/if}`, `{#each items as item (id)} {/each}`
- **Snippets**: `{#snippet name(data)} content {/snippet}`, render: `{@render name()}`
- **Styling**: Scoped by default; `:global(selector)` for global; `style:prop={val}`
- **Directives**: `use:action`, `transition:fade|fly|slide`, `in:/out:`, `animate:flip`

## Special Elements
- `<svelte:boundary>` - Error boundaries
- `<svelte:window|document|body|head>` - Document access
- `<svelte:element this={tag}>` - Dynamic tags
- `<svelte:options>` - Compiler settings

## Runtime APIs
- **Stores**: `writable`, `readable`, `derived` with `.subscribe()`
- **Context**: `setContext`/`getContext` for parent-child data
- **Lifecycle**: `onMount`, `onDestroy`, `tick()`
- **Components**: `mount`, `unmount`, `render`, `hydrate`

## Migration (4→5)
- `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`
- `on:click` → `onclick`, `createEventDispatcher` → callbacks
- `<slot />` → `children` prop, named slots → props
- `new App({target})` → `mount(App, {target})`
