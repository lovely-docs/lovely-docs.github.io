## Basic iteration
Iterate over arrays, array-like objects, or iterables (Map, Set, etc.) using `{#each expression as name}...{/each}`. Access the index with `{#each expression as name, index}...{/each}`.

```svelte
{#each items as item, i}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

## Keyed each blocks
Provide a key expression to uniquely identify items: `{#each expression as name (key)}...{/each}`. Svelte uses this to intelligently update the list by inserting, moving, and deleting items rather than just updating state. Keys should be strings or numbers for identity persistence.

```svelte
{#each items as item, i (item.id)}
	<li>{i + 1}: {item.name} x {item.qty}</li>
{/each}
```

## Destructuring
Use destructuring and rest patterns in each blocks:

```svelte
{#each items as { id, name, qty }, i (id)}
	<li>{i + 1}: {name} x {qty}</li>
{/each}

{#each objects as { id, ...rest }}
	<li><span>{id}</span><MyComponent {...rest} /></li>
{/each}
```

## Rendering without items
Omit the `as` part to render something n times: `{#each { length: 8 }, rank}...{/each}`

## Else blocks
Add `{:else}` to render content when the list is empty:

```svelte
{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks today!</p>
{/each}
```