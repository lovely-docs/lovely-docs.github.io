## @attach directive

Functions that run in an effect when an element mounts or state updates. Return a cleanup function if needed.

```svelte
function myAttachment(element) {
	return () => console.log('cleaning up');
}
<div {@attach myAttachment}>...</div>
```

**Attachment factories** - return attachments from functions for reusable patterns:
```svelte
function tooltip(content) {
	return (element) => {
		const tooltip = tippy(element, { content });
		return tooltip.destroy;
	};
}
<button {@attach tooltip(content)}>Hover me</button>
```

**Inline attachments** - define directly on elements with nested effects for fine-grained reactivity.

**Component props** - attachments passed to components are spread as Symbol-keyed props.

**Controlling re-runs** - use nested effects to prevent expensive setup work from re-running on every state change.