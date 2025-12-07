Reactive wrappers for window properties (innerWidth, innerHeight, scrollX, scrollY, devicePixelRatio, online, etc.) with `.current` property. All available since 5.11.0, return undefined on server.

```svelte
<script>
	import { innerWidth, innerHeight, scrollX, online } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current} | scroll: {scrollX.current},{scrollY.current} | online: {online.current}</p>
```