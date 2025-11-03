{#await} blocks handle Promise states in templates with three branches:

**Syntax:**
```svelte
{#await expression}
  <!-- pending state -->
{:then value}
  <!-- fulfilled state -->
{:catch error}
  <!-- rejected state -->
{/await}
```

**Branches can be omitted:**
- Omit `catch` if error handling isn't needed
- Omit initial block to skip pending state: `{#await promise then value}...{/await}`
- Omit `then` to show only errors: `{#await promise catch error}...{/await}`

**Key behaviors:**
- During server-side rendering, only the pending branch renders
- If expression isn't a Promise, only the `then` branch renders
- Can use with dynamic imports for lazy component loading: `{#await import('./Component.svelte') then { default: Component }}<Component />{/await}`