

## Pages

### getting_started
How to set up a new Svelte project and available development tools.

**Recommended:** `npx sv create myapp` with SvelteKit and Vite.

**Alternative:** `npm create vite@latest` (select svelte option) - requires manual routing setup.

**Other tools:** Rollup and Webpack plugins available but Vite preferred.

**Tooling:** VS Code extension, editor integrations, `sv check` CLI.

### svelte_files
Svelte components are written in .svelte files with optional script, style, and markup sections; script runs per-instance while script module runs once at module load.

## Structure

`.svelte` files contain optional script, styles, and markup sections.

## `<script>` vs `<script module>`

- `<script>`: Runs per instance, variables accessible in markup
- `<script module>`: Runs once at module load, can export bindings (not `export default`)

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
Use .svelte.js and .svelte.ts files to create reusable reactive logic with runes.

`.svelte.js` and `.svelte.ts` files are modules that support runes for creating reusable reactive logic and sharing reactive state. You cannot export reassigned state across modules.

