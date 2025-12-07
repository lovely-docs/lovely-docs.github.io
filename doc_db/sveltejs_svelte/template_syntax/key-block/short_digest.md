{#key expression} destroys and recreates contents when expression changes. Reinstantiates components or replays transitions:
```svelte
{#key value}
	<Component />
	<div transition:fade>{value}</div>
{/key}
```