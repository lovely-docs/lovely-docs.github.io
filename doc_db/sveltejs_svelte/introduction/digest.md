## Overview

Svelte is a compiler-based framework that transforms declarative components into optimized JavaScript. Components are written in `.svelte` files combining HTML, CSS, and JavaScript.

## Setup

**SvelteKit (recommended):**
```sh
npx sv create myapp
cd myapp
npm run dev
```

**Vite:**
```sh
npm create vite@latest
npm run build
```

## Component Structure

`.svelte` files contain three optional sections:

```svelte
<script module>
	// runs once at module load
</script>

<script>
	// runs per component instance
	let count = 0;
</script>

<button onclick={() => count++}>{count}</button>

<style>
	button { font-size: 2em; }
</style>
```

- `<script>`: Instance-level logic; top-level variables accessible in markup
- `<script module>`: Module-level logic; can export bindings (not default export)
- `<style>`: Scoped CSS affecting only this component

## Reactive Modules

`.svelte.js` and `.svelte.ts` files support Svelte runes for reusable reactive logic and state sharing across the application (introduced in Svelte 5).

## Resources

- Interactive tutorial for learning
- VS Code extension for editor support
- Playground and StackBlitz for online environments
- Discord and Stack Overflow for help