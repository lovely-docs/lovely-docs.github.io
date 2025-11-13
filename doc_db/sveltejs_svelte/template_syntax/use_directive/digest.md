Actions are functions called when an element is mounted using the `use:` directive. They typically use `$effect` to manage setup and teardown:

```svelte
<script>
	function myaction(node) {
		$effect(() => {
			// setup
			return () => {
				// teardown
			};
		});
	}
</script>

<div use:myaction>...</div>
```

Actions can accept arguments:

```svelte
<script>
	function myaction(node, data) {
		// ...
	}
</script>

<div use:myaction={data}>...</div>
```

The action runs once on mount (not during SSR) and does not re-run if the argument changes.

For typing, the `Action` interface accepts three optional type arguments: node type, parameter type, and custom event handlers:

```svelte
<script>
	/** @type {import('svelte/action').Action<
	 * 	HTMLDivElement,
	 * 	undefined,
	 * 	{
	 * 		onswiperight: (e: CustomEvent) => void;
	 * 		onswipeleft: (e: CustomEvent) => void;
	 * 	}
	 * >}
	 */
	function gestures(node) {
		$effect(() => {
			node.dispatchEvent(new CustomEvent('swipeleft'));
			node.dispatchEvent(new CustomEvent('swiperight'));
		});
	}
</script>

<div use:gestures onswipeleft={next} onswiperight={prev}>...</div>
```

Note: In Svelte 5.29+, attachments are recommended as a more flexible alternative.