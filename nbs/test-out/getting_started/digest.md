## Project Setup

Create a new project with SvelteKit and Vite:
```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

Alternative: Use Vite directly with `npm create vite@latest` and select the `svelte` option. Plugins exist for Rollup and Webpack but Vite is recommended.

## Development Tools

- VS Code extension maintained by the Svelte team
- Command-line checking with `sv check`
- Community editor integrations via Svelte Society
- Support via Discord or Stack Overflow (tag: svelte)

## Component Files

Components are written in `.svelte` files with optional `<script>`, `<style>`, and markup sections.

**`<script>`** runs per component instance. Top-level variables are accessible in markup and use runes for props and reactivity.

**`<script module>`** runs once at module load. Variables are accessible in the component but not vice versa. You can export bindings (they become module exports), but not `export default`.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

**`<style>`** is scoped to the component only.

## Reactive Logic Files

`.svelte.js` and `.svelte.ts` files support runes for creating reusable reactive logic and shared reactive state. They behave like standard modules but with Svelte's reactivity system. You cannot export reassigned state across modules.