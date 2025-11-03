## onMount

Schedules a callback to run when the component mounts to the DOM. Must be called during component initialization. Does not run on server-side rendered components.

If a function is returned from `onMount`, it will be called when the component unmounts. Note: this only works with synchronous returns; async functions always return a Promise.

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const interval = setInterval(() => console.log('beep'), 1000);
		return () => clearInterval(interval);
	});
</script>
```

## onDestroy

Schedules a callback to run immediately before the component unmounts. This is the only lifecycle hook that runs in server-side rendered components.

```svelte
<script>
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		console.log('the component is being destroyed');
	});
</script>
```

## tick

Returns a promise that resolves once pending state changes have been applied, or in the next microtask if there are none. Use this when you need to ensure the UI is updated before continuing.

```svelte
<script>
	import { tick } from 'svelte';

	$effect.pre(() => {
		console.log('about to update');
		tick().then(() => console.log('just updated'));
	});
</script>
```

## Deprecated: beforeUpdate / afterUpdate

Svelte 4 had hooks that ran before/after component updates. These are shimmed in Svelte 5 for backwards compatibility but not available in components using runes.

Use `$effect.pre` instead of `beforeUpdate` and `$effect` instead of `afterUpdate`. These runes offer more granular control and only react to changes you explicitly reference.

Example: autoscrolling chat window that only scrolls when messages change, not when theme changes:

```svelte
<script>
	import { tick } from 'svelte';

	let theme = $state('dark');
	let messages = $state([]);
	let viewport;

	$effect.pre(() => {
		messages;
		const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
		if (autoscroll) {
			tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
		}
	});

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			messages = [...messages, event.target.value];
			event.target.value = '';
		}
	}

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
	}
</script>

<div class:dark={theme === 'dark'}>
	<div bind:this={viewport}>
		{#each messages as message}
			<p>{message}</p>
		{/each}
	</div>
	<input onkeydown={handleKeydown} />
	<button onclick={toggle}>Toggle dark mode</button>
</div>
```

In Svelte 5, the component lifecycle consists only of creation and destruction. State updates don't trigger component-level hooks; instead, effects react to specific state changes.