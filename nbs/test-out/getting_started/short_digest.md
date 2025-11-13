## Setup

Create projects with `npx sv create myapp` or use Vite directly. VS Code extension and `sv check` available for development.

## Component Structure

`.svelte` files contain optional `<script>`, `<script module>`, `<style>`, and markup sections. Script runs per-instance, script module runs once at load. Styles are component-scoped.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>
```

## Reactive Logic

`.svelte.js` and `.svelte.ts` files support runes for reusable reactive logic and shared state.