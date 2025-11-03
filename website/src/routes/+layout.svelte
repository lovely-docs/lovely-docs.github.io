<script lang="ts">
	import '../app.css';
	import { ModeWatcher, mode } from 'mode-watcher';

	$effect(() => {
		if (mode.current === 'light') {
			import('highlight.js/styles/github.min.css');
		} else {
			import('highlight.js/styles/github-dark.min.css');
		}
	});
	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
