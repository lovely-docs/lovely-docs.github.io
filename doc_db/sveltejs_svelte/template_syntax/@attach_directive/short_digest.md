Attachments are functions that run in effects when elements mount or reactive state updates, optionally returning cleanup functions. Can be defined inline, passed to components via Symbol props, or created from factories. Use `createAttachmentKey` for programmatic creation or `fromAction` to convert actions.

Example:
```svelte
<script>
	function tooltip(content) {
		return (element) => {
			const t = tippy(element, { content });
			return t.destroy;
		};
	}
</script>

<button {@attach tooltip(msg)}>Hover me</button>
```

Control re-runs by nesting effects to avoid expensive setup work re-executing.