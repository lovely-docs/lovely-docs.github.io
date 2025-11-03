## Project Setup

Start a new Svelte project with SvelteKit (recommended):
```bash
npx sv create myapp
npm install
npm run dev
```

Alternatively, use Vite:
```bash
npm create vite@latest  # select svelte
npm run build
```

VS Code extension available. Resources: Discord, Stack Overflow.

## Component Structure

Svelte components use `.svelte` files with three optional sections:
- `<script>` — runs per component instance
- `<script module>` — runs once at module load
- `<style>` — automatically scoped to the component

Example:
```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>

<style>
	p { color: burlywood; }
</style>
```

## Reactive Logic Files

`.svelte.js` and `.svelte.ts` files allow using Svelte runes outside components for reusable reactive logic and shared state across the app (reassigned state cannot be exported).