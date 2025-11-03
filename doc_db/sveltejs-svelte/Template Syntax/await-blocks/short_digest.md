{#await} blocks branch on Promise states (pending, fulfilled, rejected):

```svelte
{#await promise}
  <p>loading...</p>
{:then value}
  <p>{value}</p>
{:catch error}
  <p>{error.message}</p>
{/await}
```

Branches can be omitted. SSR only renders pending state. Works with dynamic imports for lazy loading.