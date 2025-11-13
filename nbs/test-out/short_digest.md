## Setup

Create projects with `npx sv create myapp` or `npm create vite@latest` with svelte option.

## Components

`.svelte` files contain optional `<script>`, `<style>`, and markup. `<script module>` runs once at load. `<style>` is scoped.

## Runes

`$`-prefixed keywords for reactivity:

- **$state** - Reactive state, deeply proxied for objects/arrays
- **$derived** - Auto-updates when dependencies change
- **$effect** - Runs side effects, tracks dependencies, supports cleanup
- **$props** - Component inputs with destructuring
- **$bindable** - Two-way binding for props
- **$inspect** - Dev-only reactive logging
- **$host** - Access host element in custom elements

Use `$derived` instead of `$effect` for state synchronization. Effects run after mount and in microtasks after state changes.