# Each Block

Iterate over arrays and iterables:

```svelte
{#each items as item, i}
  <li>{i + 1}: {item.name}</li>
{/each}
```

Use keyed blocks for intelligent list updates:

```svelte
{#each items as item (item.id)}
  <li>{item.name}</li>
{/each}
```

Supports destructuring, rendering n times with `{#each { length: n }}`, and else blocks for empty lists.