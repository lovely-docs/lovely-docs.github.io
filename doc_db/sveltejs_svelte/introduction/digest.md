## Project Setup

**SvelteKit (Recommended):**
```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```
Official framework from Svelte team, powered by Vite, supports most application types.

**Vite Alternative:**
```sh
npm create vite@latest  # select svelte option
npm run build  # generates dist/
```
Uses vite-plugin-svelte; most projects need separate routing library. Other bundlers have plugins but Vite is recommended.

## Editor & Help

- VS Code extension (maintained by Svelte team)
- Command-line checking: `sv check`
- Community support via Discord and Stack Overflow (tag: svelte)

## .svelte File Structure

Components use `.svelte` files (superset of HTML) with optional sections:

```svelte
<script module>
	// runs once when module evaluates
	let total = 0;
</script>

<script>
	// runs per component instance
	total += 1;
</script>

<!-- markup -->

<style>
	/* scoped to component only */
	p { color: burlywood; }
</style>
```

- `<script>`: Instance-level logic; top-level variables accessible in markup; use runes for props/reactivity; supports TypeScript with `lang="ts"`
- `<script module>`: Module-level logic (rarely used); can export bindings but not `export default` (component is default export); variables accessible in component but not vice versa
- `<style>`: CSS scoped to component only
- All sections optional

## .svelte.js and .svelte.ts Files

Module files that support runes for reactive logic and state sharing across application. Cannot export reassigned state. Introduced in Svelte 5.