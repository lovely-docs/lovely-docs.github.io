

## Pages

### getting-started
Project setup with SvelteKit (npx sv create) or Vite (npm create vite); editor support via VS Code extension; community help via Discord/Stack Overflow.

## Setup with SvelteKit (Recommended)

The official way to start a new Svelte project:

```sh
npx sv create myapp
cd myapp
npm install
npm run dev
```

SvelteKit is the official application framework from the Svelte team, powered by Vite, and supports building almost any type of application.

## Alternatives to SvelteKit

**Vite with Svelte plugin:**
```sh
npm create vite@latest
# select svelte option
npm run build  # generates HTML, JS, CSS in dist/
```

Uses vite-plugin-svelte. Most projects will need a separate routing library.

Vite can be used in standalone mode for single page apps (SPAs), which SvelteKit also supports.

Other bundlers have plugins available, but Vite is recommended.

## Editor Tooling

- VS Code extension maintained by Svelte team
- Integrations available for various other editors
- Command-line checking: `sv check`

## Getting Help

- Discord chatroom for community support
- Stack Overflow for Q&A (tag: svelte)

### svelte-files
.svelte file structure: optional `<script>` (per-instance), `<script module>` (once), markup, and `<style>` (scoped); runes for props/reactivity; module exports allowed except default.

## Structure

Svelte components are written in `.svelte` files using a superset of HTML. All three sections (script, styles, markup) are optional.

```svelte
<script module>
	// module-level logic (rarely used)
</script>

<script>
	// instance-level logic
</script>

<!-- markup -->

<style>
	/* scoped styles */
</style>
```

## `<script>`

Contains JavaScript or TypeScript (add `lang="ts"` attribute) that runs when a component instance is created. Top-level variables can be referenced in markup. Use runes to declare component props and add reactivity.

## `<script module>`

Runs once when the module first evaluates, not for each component instance. Variables declared here can be referenced elsewhere in the component but not vice versa.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
	console.log(`instantiated ${total} times`);
</script>
```

You can export bindings from this block (they become module exports), but not `export default` since the component is the default export. When using TypeScript, ensure your editor recognizes these exports (VS Code extension and IntelliJ plugin handle this automatically).

In Svelte 4, this was created using `<script context="module">`.

## `<style>`

CSS is scoped to the component only:

```svelte
<style>
	p {
		color: burlywood; /* only affects <p> in this component */
	}
</style>
```

### svelte.js_and_svelte.ts_files
.svelte.js/.svelte.ts modules support runes for reactive logic and state sharing, but cannot export reassigned state.

.svelte.js and .svelte.ts files are module files that behave like regular .js or .ts modules but with the added ability to use runes. This enables creating reusable reactive logic and sharing reactive state across an application. Note that reassigned state cannot be exported across modules. This feature was introduced in Svelte 5.

