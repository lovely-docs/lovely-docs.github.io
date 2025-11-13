Await blocks handle the three states of a Promise: pending, fulfilled, and rejected.

**Syntax:**
```svelte
{#await expression}
  <!-- pending -->
{:then value}
  <!-- fulfilled -->
{:catch error}
  <!-- rejected -->
{/await}
```

**Variations:**
- Omit `catch` block if error handling isn't needed
- Omit initial pending block: `{#await promise then value}...{/await}`
- Omit `then` block to show only errors: `{#await promise catch error}...{/await}`

**Server-side rendering:** Only the pending branch renders during SSR. If the expression isn't a Promise, only the `then` branch renders.

**Lazy component loading:**
```svelte
{#await import('./Component.svelte') then { default: Component }}
  <Component />
{/await}
```