## Project Setup

Create projects with SvelteKit and Vite:
```bash
npx sv create myapp
cd myapp
npm run dev
```

Alternative: `npm create vite@latest` with svelte option. Vite is recommended; plugins exist for Rollup and Webpack.

Development tools: VS Code extension, `sv check` CLI, community integrations via Svelte Society.

## Component Files

Components use `.svelte` files with optional `<script>`, `<style>`, and markup sections.

**`<script>`** runs per instance. Top-level variables accessible in markup. Use runes for props and reactivity.

**`<script module>`** runs once at module load. Variables accessible in component but not vice versa. Export bindings become module exports (no `export default`).

**`<style>`** scoped to component only.

## Reactive Logic Files

`.svelte.js` and `.svelte.ts` files support runes for reusable reactive logic and shared state. Behave like standard modules with Svelte's reactivity system.

## Runes

`$`-prefixed compiler keywords forming Svelte's reactivity system. Built-in, valid only in specific positions.

**$state** - Creates reactive state. Arrays and objects become deeply reactive proxies:
```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers reactivity
```
Use `$state.raw` for non-reactive objects. Use `$state.snapshot()` to convert proxies to plain objects.

**$derived** - Auto-updates when dependencies change:
```js
let count = $state(0);
let doubled = $derived(count * 2);
let total = $derived.by(() => {
  let sum = 0;
  for (const n of numbers) sum += n;
  return sum;
});
```

**$effect** - Runs side effects when reactive state changes, automatically tracking dependencies:
```js
$effect(() => {
  const interval = setInterval(() => count += 1, milliseconds);
  return () => clearInterval(interval);
});
```
Effects run after mount and in microtasks after state changes. Return a teardown function for cleanup. Use `$effect.pre()` to run before DOM updates. Use `$effect.root()` for manually controlled nested effects.

**$props** - Receives component inputs with destructuring, defaults, and rest syntax:
```js
let { adjective = 'happy', ...others } = $props();
```

**$bindable** - Enables two-way data binding for component props:
```js
// Child
let { value = $bindable() } = $props();
<input bind:value={value} />

// Parent
<FancyInput bind:value={message} />
```

**$inspect** - Development-only rune that reactively logs value changes:
```js
$inspect(count, message);
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which state caused effect/derived to re-run
```

**$host** - Access host element in custom element components:
```js
$host().dispatchEvent(new CustomEvent('increment'));
```

## $effect Details

Effects are browser-only (not during SSR). Use for third-party libraries, canvas drawing, or network requests. Avoid updating state inside effects.

Values read asynchronously (after `await` or in `setTimeout`) are not tracked. Effects only depend on values read in the last run, so conditional code affects which dependencies are tracked:
```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
    if (condition) {
        confetti({ colors: [color] });
    } else {
        confetti();
    }
});
```

**$effect.tracking** - Returns whether code is running in a tracking context (effect or template).

Don't use effects to synchronize state—use `$derived` instead. For complex derived values, use `$derived.by`.