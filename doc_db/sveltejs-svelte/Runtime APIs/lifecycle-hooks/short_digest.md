## onMount
Runs when component mounts to DOM. Can return cleanup function (must be synchronous). Doesn't run on server.

## onDestroy
Runs before component unmounts. Only lifecycle hook that runs on server.

## tick
Returns promise that resolves after pending state changes apply. Use to ensure UI updates before continuing.

## Deprecated: beforeUpdate / afterUpdate
Use `$effect.pre` and `$effect` instead. These runes offer granular control—only react to explicitly referenced state.

Example: autoscroll chat only when messages change:
```svelte
$effect.pre(() => {
	messages;
	const autoscroll = viewport?.offsetHeight + viewport?.scrollTop > viewport?.scrollHeight - 50;
	if (autoscroll) tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
});
```