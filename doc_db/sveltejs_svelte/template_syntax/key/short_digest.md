{#key expression} destroys and recreates contents when expression changes, causing component reinitialisation and triggering transitions:

```svelte
{#key value}
	<Component />
{/key}
```