## AnimationFrames

Declarative `requestAnimationFrame` wrapper with FPS limiting and frame metrics.

```svelte
const animation = new AnimationFrames(
	(args) => { /* args.delta = ms since last frame */ },
	{ fpsLimit: () => fpsLimit }
);
// Properties: animation.fps, animation.running
// Methods: animation.start(), animation.stop()
```