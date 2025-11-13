

## Pages

### overview
Svelte is a compiler-based framework for building web UIs by transforming declarative components into optimized JavaScript.

Svelte is a compiler-based UI framework that transforms HTML, CSS, and JavaScript components into optimized code. Suitable for anything from components to full-stack apps with SvelteKit. Start with the interactive tutorial, then use this documentation as reference.

### getting_started
Instructions for setting up a new Svelte project using SvelteKit or Vite, with editor tooling and support resources.

**Setup:** Use `npx sv create myapp` with SvelteKit (recommended) or `npm create vite@latest` with Vite directly.

**Editor:** VS Code extension available, plus `sv check` for CLI validation.

**Help:** Discord chatroom or Stack Overflow.

### svelte_files
Svelte components are written in .svelte files with optional script, style, and markup sections; script blocks run per-instance while script module blocks run once at module load.

## Structure

`.svelte` files contain optional `<script>`, `<style>`, and markup sections.

## `<script>` vs `<script module>`

- `<script>`: runs per component instance, variables accessible in markup
- `<script module>`: runs once at module load, can export bindings (not `export default`)

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>
```

## `<style>`

CSS is automatically scoped to the component.

### .svelte.js_and_.svelte.ts_files
Svelte modules (.svelte.js/.svelte.ts) enable runes for reactive logic and state sharing.

.svelte.js and .svelte.ts files are modules supporting Svelte runes for reusable reactive logic and shared reactive state (cannot export reassigned state).

