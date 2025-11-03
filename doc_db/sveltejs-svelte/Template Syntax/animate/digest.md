## Animations in Keyed Each Blocks

Animations are triggered when elements in a keyed each block are reordered. They only run when an existing item's index changes, not when items are added or removed. The `animate:` directive must be placed on an immediate child of a keyed each block.

### Built-in and Custom Animations

Use built-in animation functions or create custom ones:

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

### Custom Animation Functions

A custom animation function receives the node, an animation object with `from` and `to` DOMRect properties, and optional parameters. It returns an object with animation configuration:

```js
animation = (node, { from, to }, params) => ({
	delay?: number,
	duration?: number,
	easing?: (t: number) => number,
	css?: (t: number, u: number) => string,
	tick?: (t: number, u: number) => void
})
```

The `from` property contains the element's starting DOMRect, and `to` contains its final DOMRect after reordering.

### CSS-based Animations

If the returned object has a `css` method, Svelte creates a web animation. The `t` argument ranges from 0 to 1 (after easing), and `u` equals `1 - t`. This method is preferred as it runs off the main thread:

```js
function whizz(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const d = Math.sqrt(dx * dx + dy * dy);
	
	return {
		duration: Math.sqrt(d) * 120,
		easing: cubicOut,
		css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
	};
}
```

### Tick-based Animations

Alternatively, return a `tick` function called during animation with the same `t` and `u` arguments. Use this only when CSS animations aren't suitable:

```js
tick: (t, u) => Object.assign(node.style, { color: t > 0.5 ? 'Pink' : 'Blue' })
```