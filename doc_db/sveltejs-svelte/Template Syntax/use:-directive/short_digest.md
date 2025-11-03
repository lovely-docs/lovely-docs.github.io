## use: directive for actions

Actions are functions called on element mount via `use:` directive with `$effect` for setup/teardown:

```svelte
function myaction(node, data) {
	$effect(() => {
		// setup
		return () => { /* teardown */ };
	});
}

<div use:myaction={data}>...</div>
```

Type actions with `Action<NodeType, ParamType, EventHandlers>` interface. Actions run once on mount, not during SSR, and don't re-run if arguments change.