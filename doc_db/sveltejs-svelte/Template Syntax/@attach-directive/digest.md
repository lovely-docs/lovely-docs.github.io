## @attach directive

Functions that run in an effect when an element mounts or when state read inside the function updates. Can optionally return a cleanup function called before re-run or after element removal.

### Basic usage
```svelte
function myAttachment(element) {
	console.log(element.nodeName);
	return () => console.log('cleaning up');
}

<div {@attach myAttachment}>...</div>
```

### Attachment factories
Return an attachment from a function to create reusable patterns:
```svelte
function tooltip(content) {
	return (element) => {
		const tooltip = tippy(element, { content });
		return tooltip.destroy;
	};
}

<button {@attach tooltip(content)}>Hover me</button>
```
The attachment re-runs whenever `content` changes.

### Inline attachments
```svelte
<canvas
	{@attach (canvas) => {
		const context = canvas.getContext('2d');
		$effect(() => {
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
		});
	}}
></canvas>
```

### Passing to components
When used on a component, creates a prop with a Symbol key. If the component spreads props onto an element, attachments are passed through:
```svelte
<!-- Button.svelte -->
<script>
	let { children, ...props } = $props();
</script>
<button {...props}>{@render children?.()}</button>

<!-- App.svelte -->
<Button {@attach tooltip(content)}>Hover me</Button>
```

### Controlling re-runs
Attachments are fully reactive and re-run on changes to any state read inside. To avoid expensive setup work re-running, pass data via a function and read it in a child effect:
```svelte
function foo(getBar) {
	return (node) => {
		veryExpensiveSetupWork(node);
		$effect(() => {
			update(node, getBar());
		});
	};
}
```

### Utilities
- `createAttachmentKey` - add attachments to objects for spreading
- `fromAction` - convert actions to attachments