## $bindable Rune

Marks a prop as bindable, allowing data to flow bidirectionally between parent and child components. By default, props flow one-way from parent to child; bindable props enable the child to communicate changes back to the parent.

### Usage

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
- Parents are not required to use `bind:` — they can pass normal props
- Specify fallback values: `let { value = $bindable('fallback'), ...props } = $props();`
- Use sparingly; normal one-way props are preferred for clarity
- Mutation of non-bindable props is discouraged and triggers warnings