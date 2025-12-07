Reactive element dimension tracker. Constructor takes a function returning an HTMLElement, exposes `width` and `height` properties that update automatically.

```svelte
const size = new ElementSize(() => el);
<p>Width: {size.width} Height: {size.height}</p>
```