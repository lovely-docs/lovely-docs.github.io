## Core Concepts
- **Runes** ($state, $derived, $effect, $props, $bindable, $inspect, $host) manage reactivity in Svelte 5
- **Template syntax** includes conditionals, iteration, async handling, snippets, directives (bind, use, transition, animate, style, class)
- **Styling** is scoped by default; use `:global()` for global styles and CSS custom properties for component theming
- **Special elements** (svelte:boundary, svelte:window, svelte:document, svelte:head, svelte:element, svelte:options) provide framework features

## State & APIs
- **Stores** (writable, readable, derived) enable reactive state management; access with `$` prefix
- **Context** (setContext, getContext) passes values parent-to-child without prop-drilling
- **Lifecycle** (onMount, onDestroy, tick) manages component initialization and cleanup
- **Imperative API** (mount, unmount, hydrate) controls component instantiation

## Advanced
- **Animations/Transitions**: Built-in functions (blur, fade, fly, scale, slide, draw, crossfade) and FLIP animation
- **TypeScript**: Full support with `lang="ts"`; type props and actions
- **Custom Elements**: Compile to web components with `customElement` option
- **Testing**: Vitest for units, @testing-library/svelte for components, Playwright for E2E
- **Svelte 5 Migration**: Replace `let` with `$state()`, `$:` with `$derived()`/`$effect()`, `export let` with `$props()`, slots with snippets