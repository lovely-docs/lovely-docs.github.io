## $bindable Rune

The `$bindable` rune enables two-way data binding for component props, allowing data to flow from child to parent. This is useful for simplifying code but should be used sparingly.

### Basic Usage

Mark a prop as bindable using the `$bindable()` rune:

```svelte
// FancyInput.svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />
```

Parent components can then use the `bind:` directive to establish two-way binding:

```svelte
// App.svelte
<script>
	import FancyInput from './FancyInput.svelte';
	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

### Key Points

- Bindable props allow state mutations in child components
- Normal props can also be mutated, but Svelte warns against this
- Parent components don't have to use `bind:` — they can pass normal props
- Specify fallback values: `let { value = $bindable('fallback'), ...props } = $props();`