The `{#key expression}...{/key}` block destroys and recreates its contents whenever the expression value changes.

**Use cases:**

1. **Component reinstantiation** - Causes components to be destroyed and recreated when the key expression changes:
```svelte
{#key value}
	<Component />
{/key}
```

2. **Triggering transitions** - Forces transitions to replay each time the value changes:
```svelte
{#key value}
	<div transition:fade>{value}</div>
{/key}
```