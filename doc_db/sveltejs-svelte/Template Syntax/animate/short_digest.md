## Animations in Keyed Each Blocks

Animations trigger when elements in a keyed each block are reordered (not on add/remove). Use the `animate:` directive on immediate children:

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

### Custom Animation Functions

Return an object with `delay`, `duration`, `easing`, and either `css` or `tick`:

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

Prefer `css` over `tick` for better performance (runs off main thread).