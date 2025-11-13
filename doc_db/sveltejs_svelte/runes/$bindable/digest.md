## $bindable Rune

The `$bindable` rune marks a prop as bindable, allowing data to flow bidirectionally between parent and child components. This enables a parent to use the `bind:` directive to bind to a child's prop.

### Basic Usage

Mark a prop as bindable in the child component:

```svelte
// FancyInput.svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />
```

The parent can then bind to it:

```svelte
// App.svelte
<script>
	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

### Key Points

- Bindable props allow data to flow from child to parent, making it possible to mutate state in the child
- Parents don't have to use `bind:` — they can pass a normal prop if they don't want bidirectional binding
- You can specify a fallback value: `let { value = $bindable('fallback'), ...props } = $props();`
- Mutation of normal props is discouraged and triggers warnings; bindable props are the proper way to allow child mutations